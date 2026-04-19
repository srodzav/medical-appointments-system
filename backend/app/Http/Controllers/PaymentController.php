<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PaymentPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments
     */
    public function index(Request $request)
    {
        $query = Payment::with(['patient', 'user', 'appointment', 'paymentPlan']);

        // Filter by patient if provided
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range if provided
        if ($request->has('from_date')) {
            $query->where('payment_date', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('payment_date', '<=', $request->to_date);
        }

        // Filter by payment method
        if ($request->has('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        $payments = $query->orderBy('payment_date', 'desc')->paginate(20);

        return response()->json($payments);
    }

    /**
     * Store a newly created payment
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'payment_plan_id' => 'nullable|exists:payment_plans,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:cash,card,transfer,check,other',
            'payment_type' => 'required|in:full,partial,installment',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:completed,pending,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $payment = Payment::create([
                'patient_id' => $request->patient_id,
                'appointment_id' => $request->appointment_id,
                'payment_plan_id' => $request->payment_plan_id,
                'user_id' => auth()->id(),
                'amount' => $request->amount,
                'payment_date' => $request->payment_date,
                'payment_method' => $request->payment_method,
                'payment_type' => $request->payment_type,
                'reference_number' => $request->reference_number,
                'notes' => $request->notes,
                'status' => $request->status ?? 'completed',
            ]);

            // If payment is linked to a payment plan, update the plan
            if ($request->payment_plan_id && $request->status !== 'cancelled') {
                $paymentPlan = PaymentPlan::findOrFail($request->payment_plan_id);
                $paymentPlan->paid_amount += $request->amount;
                $paymentPlan->remaining_amount = $paymentPlan->total_amount - $paymentPlan->paid_amount;
                
                if ($request->payment_type === 'installment') {
                    $paymentPlan->paid_installments += 1;
                }

                // Check if payment plan is completed
                if ($paymentPlan->remaining_amount <= 0) {
                    $paymentPlan->status = 'completed';
                    $paymentPlan->end_date = now();
                }

                $paymentPlan->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Pago registrado exitosamente',
                'data' => $payment->load(['patient', 'user', 'paymentPlan'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al registrar el pago: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified payment
     */
    public function show($id)
    {
        $payment = Payment::with(['patient', 'user', 'appointment', 'paymentPlan'])->findOrFail($id);

        return response()->json($payment);
    }

    /**
     * Update the specified payment
     */
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'amount' => 'sometimes|required|numeric|min:0',
            'payment_date' => 'sometimes|required|date',
            'payment_method' => 'sometimes|required|in:cash,card,transfer,check,other',
            'payment_type' => 'sometimes|required|in:full,partial,installment',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:completed,pending,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $oldAmount = $payment->amount;
            $oldStatus = $payment->status;
            
            $payment->update($request->all());

            // If payment is linked to a payment plan, update the plan accordingly
            if ($payment->payment_plan_id) {
                $paymentPlan = PaymentPlan::findOrFail($payment->payment_plan_id);
                
                // Adjust paid amount if amount changed
                if ($request->has('amount')) {
                    $difference = $request->amount - $oldAmount;
                    $paymentPlan->paid_amount += $difference;
                    $paymentPlan->remaining_amount = $paymentPlan->total_amount - $paymentPlan->paid_amount;
                }

                // Handle status changes
                if ($request->has('status')) {
                    if ($payment->status === 'cancelled' && $oldStatus !== 'cancelled') {
                        $paymentPlan->paid_amount -= $payment->amount;
                        $paymentPlan->remaining_amount = $paymentPlan->total_amount - $paymentPlan->paid_amount;
                        if ($payment->payment_type === 'installment') {
                            $paymentPlan->paid_installments = max(0, $paymentPlan->paid_installments - 1);
                        }
                    }
                }

                $paymentPlan->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Pago actualizado exitosamente',
                'data' => $payment->load(['patient', 'user', 'paymentPlan'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al actualizar el pago: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified payment
     */
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);

        DB::beginTransaction();
        try {
            // If payment is linked to a payment plan, update the plan
            if ($payment->payment_plan_id && $payment->status === 'completed') {
                $paymentPlan = PaymentPlan::findOrFail($payment->payment_plan_id);
                $paymentPlan->paid_amount -= $payment->amount;
                $paymentPlan->remaining_amount = $paymentPlan->total_amount - $paymentPlan->paid_amount;
                
                if ($payment->payment_type === 'installment') {
                    $paymentPlan->paid_installments = max(0, $paymentPlan->paid_installments - 1);
                }

                $paymentPlan->status = 'active';
                $paymentPlan->save();
            }

            $payment->delete();
            DB::commit();

            return response()->json([
                'message' => 'Pago eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al eliminar el pago: ' . $e->getMessage()], 500);
        }
    }
}
