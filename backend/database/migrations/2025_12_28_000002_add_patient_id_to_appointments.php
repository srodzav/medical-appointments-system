<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\Patient;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate existing appointment data to patients table
        $appointments = DB::table('appointments')->get();
        
        foreach ($appointments as $appointment) {
            // Check if patient already exists by email
            $patient = DB::table('patients')
                ->where('email', $appointment->patient_email)
                ->first();
            
            if (!$patient) {
                // Create new patient
                $patientId = DB::table('patients')->insertGetId([
                    'name' => $appointment->patient_name,
                    'email' => $appointment->patient_email,
                    'phone' => $appointment->patient_phone,
                    'notes' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $patientId = $patient->id;
            }
            
            // Update appointment with patient_id
            DB::table('appointments')
                ->where('id', $appointment->id)
                ->update(['patient_id' => $patientId]);
        }
        
        // Now add patient_id column with foreign key
        Schema::table('appointments', function (Blueprint $table) {
            $table->foreignId('patient_id')->nullable()->after('user_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['patient_id']);
            $table->dropColumn('patient_id');
        });
    }
};
