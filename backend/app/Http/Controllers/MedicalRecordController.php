<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MedicalRecordController extends Controller
{
    /**
     * Display a listing of medical records for a patient
     */
    public function index(Request $request)
    {
        $query = MedicalRecord::with(['patient', 'user', 'appointment']);

        // Filter by patient if provided
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        // Filter by record type if provided
        if ($request->has('record_type')) {
            $query->where('record_type', $request->record_type);
        }

        // Filter by date range if provided
        if ($request->has('from_date')) {
            $query->where('record_date', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('record_date', '<=', $request->to_date);
        }

        $records = $query->orderBy('record_date', 'desc')->paginate(20);

        return response()->json($records);
    }

    /**
     * Store a newly created medical record
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'record_date' => 'required|date',
            'record_type' => 'required|in:consultation,treatment,follow_up,diagnosis,emergency,other',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'diagnosis' => 'nullable|string',
            'treatment_plan' => 'nullable|string',
            'medications' => 'nullable|string',
            'allergies' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record = MedicalRecord::create([
            'patient_id' => $request->patient_id,
            'appointment_id' => $request->appointment_id,
            'user_id' => auth()->id(),
            'record_date' => $request->record_date,
            'record_type' => $request->record_type,
            'title' => $request->title,
            'description' => $request->description,
            'diagnosis' => $request->diagnosis,
            'treatment_plan' => $request->treatment_plan,
            'medications' => $request->medications,
            'allergies' => $request->allergies,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Registro médico creado exitosamente',
            'data' => $record->load(['patient', 'user', 'appointment'])
        ], 201);
    }

    /**
     * Display the specified medical record
     */
    public function show($id)
    {
        $record = MedicalRecord::with(['patient', 'user', 'appointment', 'files'])->findOrFail($id);

        return response()->json($record);
    }

    /**
     * Update the specified medical record
     */
    public function update(Request $request, $id)
    {
        $record = MedicalRecord::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'record_date' => 'sometimes|required|date',
            'record_type' => 'sometimes|required|in:consultation,treatment,follow_up,diagnosis,emergency,other',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'diagnosis' => 'nullable|string',
            'treatment_plan' => 'nullable|string',
            'medications' => 'nullable|string',
            'allergies' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record->update($request->all());

        return response()->json([
            'message' => 'Registro médico actualizado exitosamente',
            'data' => $record->load(['patient', 'user', 'appointment'])
        ]);
    }

    /**
     * Remove the specified medical record
     */
    public function destroy($id)
    {
        $record = MedicalRecord::findOrFail($id);
        $record->delete();

        return response()->json([
            'message' => 'Registro médico eliminado exitosamente'
        ]);
    }
}
