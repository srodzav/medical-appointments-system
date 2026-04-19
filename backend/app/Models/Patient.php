<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'notes',
        'birth_date',
        'blood_type',
        'allergies',
        'chronic_conditions',
        'current_medications',
        'emergency_contact_name',
        'emergency_contact_phone',
        'insurance_info',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    /**
     * Get all appointments for this patient
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the most recent appointment
     */
    public function latestAppointment()
    {
        return $this->hasOne(Appointment::class)
            ->orderBy('appointment_date', 'desc')
            ->orderBy('id', 'desc');
    }

    /**
     * Get all medical records for this patient
     */
    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class)->orderBy('record_date', 'desc');
    }

    /**
     * Get all medical files for this patient
     */
    public function medicalFiles()
    {
        return $this->hasMany(MedicalFile::class)->orderBy('created_at', 'desc');
    }

    /**
     * Get all payments for this patient
     */
    public function payments()
    {
        return $this->hasMany(Payment::class)->orderBy('payment_date', 'desc');
    }

    /**
     * Get all payment plans for this patient
     */
    public function paymentPlans()
    {
        return $this->hasMany(PaymentPlan::class)->orderBy('start_date', 'desc');
    }

    /**
     * Get active payment plans
     */
    public function activePaymentPlans()
    {
        return $this->hasMany(PaymentPlan::class)->where('status', 'active');
    }

    /**
     * Calculate total debt (remaining amount from all active plans)
     */
    public function getTotalDebtAttribute()
    {
        return $this->activePaymentPlans()->sum('remaining_amount');
    }

    /**
     * Calculate total paid
     */
    public function getTotalPaidAttribute()
    {
        return $this->payments()->where('status', 'completed')->sum('amount');
    }

    /**
     * Scope to search patients by name or email
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
              ->orWhere('email', 'LIKE', "%{$search}%")
              ->orWhere('phone', 'LIKE', "%{$search}%");
        });
    }
}
