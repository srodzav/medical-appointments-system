<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;

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
    Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);
    Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::post('/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);
});
