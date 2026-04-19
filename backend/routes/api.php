<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentPlanController;
use App\Http\Controllers\StatisticsController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/appointments/public', [AppointmentController::class, 'storePublic']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    // Patients
    Route::get('/patients/search', [PatientController::class, 'search']);
    Route::get('/patients/find-by-email', [PatientController::class, 'findByEmail']);
    Route::post('/patients/find-or-create', [PatientController::class, 'findOrCreate']);
    Route::apiResource('patients', PatientController::class);
    
    // Appointments CRUD
    Route::apiResource('appointments', AppointmentController::class);
    
    // Additional appointment actions
    Route::get('/appointments-weekly-calendar', [AppointmentController::class, 'weeklyCalendar']);
    Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);
    Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::post('/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);

    // Medical Records
    Route::apiResource('medical-records', MedicalRecordController::class);

    // Payments
    Route::apiResource('payments', PaymentController::class);

    // Payment Plans
    Route::apiResource('payment-plans', PaymentPlanController::class);
    Route::post('/payment-plans/{id}/cancel', [PaymentPlanController::class, 'cancel']);

    // Statistics and Reports
    Route::get('/statistics/dashboard', [StatisticsController::class, 'dashboard']);
    Route::get('/statistics/monthly-income', [StatisticsController::class, 'monthlyIncome']);
    Route::get('/statistics/daily-income', [StatisticsController::class, 'dailyIncome']);
    Route::get('/statistics/treatment-stats', [StatisticsController::class, 'treatmentStats']);
    Route::get('/statistics/appointment-stats', [StatisticsController::class, 'appointmentStats']);
    Route::get('/statistics/payment-method-stats', [StatisticsController::class, 'paymentMethodStats']);
    Route::get('/statistics/accounts-receivable', [StatisticsController::class, 'accountsReceivable']);
    Route::get('/statistics/top-patients', [StatisticsController::class, 'topPatientsBySpending']);
    Route::get('/statistics/peak-hours', [StatisticsController::class, 'peakHours']);
    Route::get('/statistics/financial-report', [StatisticsController::class, 'financialReport']);
});
