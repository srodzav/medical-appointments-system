<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    /**
     * Get all patients with their appointment count
     */
    public function index(Request $request)
    {
        $query = Patient::withCount('appointments')
            ->with(['latestAppointment' => function ($query) {
                $query->select('id', 'patient_id', 'appointment_date', 'status');
            }]);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $patients = $query->paginate($request->get('per_page', 15));

        return response()->json($patients);
    }

    /**
     * Search patients (for autocomplete)
     */
    public function search(Request $request)
    {
        $search = $request->get('q', '');
        
        if (strlen($search) < 2) {
            return response()->json([]);
        }

        $patients = Patient::search($search)
            ->limit(10)
            ->get(['id', 'name', 'email', 'phone']);

        return response()->json($patients);
    }

    /**
     * Get patient by email (for checking if exists)
     */
    public function findByEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid email',
                'errors' => $validator->errors()
            ], 422);
        }

        $patient = Patient::where('email', $request->email)->first();

        if (!$patient) {
            return response()->json(['exists' => false], 404);
        }

        return response()->json([
            'exists' => true,
            'patient' => $patient,
        ]);
    }

    /**
     * Store a new patient
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:patients,email|max:255',
            'phone' => 'required|string|max:20',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $patient = Patient::create($request->only(['name', 'email', 'phone', 'notes']));

        return response()->json([
            'message' => 'Patient created successfully',
            'patient' => $patient,
        ], 201);
    }

    /**
     * Get specific patient with appointments
     */
    public function show(Patient $patient)
    {
        $patient->load(['appointments' => function ($query) {
            $query->orderBy('appointment_date', 'desc');
        }]);

        return response()->json([
            'patient' => $patient,
        ]);
    }

    /**
     * Update patient
     */
    public function update(Request $request, Patient $patient)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:patients,email,' . $patient->id,
            'phone' => 'sometimes|required|string|max:20',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $patient->update($request->only(['name', 'email', 'phone', 'notes']));

        return response()->json([
            'message' => 'Patient updated successfully',
            'patient' => $patient->fresh(),
        ]);
    }

    /**
     * Delete patient
     */
    public function destroy(Patient $patient)
    {
        // Check if patient has appointments
        if ($patient->appointments()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete patient with existing appointments',
            ], 400);
        }

        $patient->delete();

        return response()->json([
            'message' => 'Patient deleted successfully',
        ]);
    }

    /**
     * Find or create patient (helper for appointments)
     */
    public function findOrCreate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Try to find by email first
        $patient = Patient::where('email', $request->email)->first();

        if ($patient) {
            // Update phone if different
            if ($patient->phone !== $request->phone) {
                $patient->update(['phone' => $request->phone]);
            }
            
            return response()->json([
                'patient' => $patient,
                'created' => false,
            ]);
        }

        // Create new patient
        $patient = Patient::create($request->only(['name', 'email', 'phone']));

        return response()->json([
            'patient' => $patient,
            'created' => true,
        ], 201);
    }
}
