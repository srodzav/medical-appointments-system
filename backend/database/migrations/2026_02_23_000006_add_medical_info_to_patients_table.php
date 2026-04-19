<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->date('birth_date')->nullable()->after('phone');
            $table->string('blood_type')->nullable()->after('birth_date');
            $table->text('allergies')->nullable()->after('blood_type');
            $table->text('chronic_conditions')->nullable()->after('allergies');
            $table->text('current_medications')->nullable()->after('chronic_conditions');
            $table->string('emergency_contact_name')->nullable()->after('current_medications');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');
            $table->text('insurance_info')->nullable()->after('emergency_contact_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn([
                'birth_date',
                'blood_type',
                'allergies',
                'chronic_conditions',
                'current_medications',
                'emergency_contact_name',
                'emergency_contact_phone',
                'insurance_info',
            ]);
        });
    }
};
