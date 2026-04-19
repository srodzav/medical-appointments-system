<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalRecord extends Model
{
    protected $fillable = [
        'patient_id',
        'appointment_id',
        'user_id',
        'record_date',
        'record_type',
        'title',
        'description',
        'diagnosis',
        'treatment_plan',
        'medications',
        'allergies',
        'notes',
    ];

    protected $casts = [
        'record_date' => 'date',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function files()
    {
        return $this->hasMany(MedicalFile::class);
    }
}
