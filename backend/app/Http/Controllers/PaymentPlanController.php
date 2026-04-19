<?php

namespace App\Http\Controllers;

use App\Models\PaymentPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentPlanController extends Controller
{
    /**
     * Display a listing of payment plans
     */
    public function index(Request $request)
    {
        $query = PaymentPlan::with(['patient', 'user', 'payments']);

        // Filter by patient if provided
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $plans = $query->orderBy('start_date', 'desc')->paginate(20);

        return response()->json($plans);
    }

    /**
     * Store a newly created payment plan
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'treatment_name' => 'required|string|max:255',
            'total_amount' => 'required|numeric|min:0',
            'total_installments' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $installmentAmount = $request->total_amount / $request->total_installments;

        $plan = PaymentPlan::create([
            'patient_id' => $request->patient_id,
            'user_id' => auth()->id(),
            'treatment_name' => $request->treatment_name,
            'total_amount' => $request->total_amount,
            'paid_amount' => 0,
            'remaining_amount' => $request->total_amount,
            'total_installments' => $request->total_installments,
            'paid_installments' => 0,
            'installment_amount' => $installmentAmount,
            'start_date' => $request->start_date,
            'status' => 'active',
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Plan de pagos creado exitosamente',
            'data' => $plan->load(['patient', 'user'])
        ], 201);
    }

    /**
     * Display the specified payment plan
     */
    public function show($id)
    {
        $plan = PaymentPlan::with(['patient', 'user', 'payments'])->findOrFail($id);

        return response()->json($plan);
    }

    /**
     * Update the specified payment plan
     */
    public function update(Request $request, $id)
    {
        $plan = PaymentPlan::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'treatment_name' => 'sometimes|required|string|max:255',
            'total_amount' => 'sometimes|required|numeric|min:0',
            'total_installments' => 'sometimes|required|integer|min:1',
            'status' => 'sometimes|in:active,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Recalculate if total amount or installments changed
        if ($request->has('total_amount') || $request->has('total_installments')) {
            $totalAmount = $request->total_amount ?? $plan->total_amount;
            $totalInstallments = $request->total_installments ?? $plan->total_installments;
            $plan->installment_amount = $totalAmount / $totalInstallments;
            $plan->remaining_amount = $totalAmount - $plan->paid_amount;
        }

        $plan->update($request->all());

        return response()->json([
            'message' => 'Plan de pagos actualizado exitosamente',
            'data' => $plan->load(['patient', 'user'])
        ]);
    }

    /**
     * Remove the specified payment plan
     */
    public function destroy($id)
    {
        $plan = PaymentPlan::findOrFail($id);
        
        // Check if plan has payments
        if ($plan->payments()->count() > 0) {
            return response()->json([
                'error' => 'No se puede eliminar un plan de pagos que tiene pagos registrados'
            ], 422);
        }

        $plan->delete();

        return response()->json([
            'message' => 'Plan de pagos eliminado exitosamente'
        ]);
    }

    /**
     * Cancel a payment plan
     */
    public function cancel($id)
    {
        $plan = PaymentPlan::findOrFail($id);
        $plan->status = 'cancelled';
        $plan->save();

        return response()->json([
            'message' => 'Plan de pagos cancelado exitosamente',
            'data' => $plan
        ]);
    }
}
