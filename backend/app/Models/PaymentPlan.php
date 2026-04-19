<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentPlan extends Model
{
    protected $fillable = [
        'patient_id',
        'user_id',
        'treatment_name',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'total_installments',
        'paid_installments',
        'installment_amount',
        'start_date',
        'end_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'installment_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Calcular el progreso del plan de pagos
    public function getProgressPercentageAttribute(): float
    {
        if ($this->total_amount == 0) {
            return 0;
        }
        return round(($this->paid_amount / $this->total_amount) * 100, 2);
    }
}
