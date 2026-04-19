<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\PaymentPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function dashboard(Request $request)
    {
        $userId = auth()->id();
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();

        // Total patients
        $totalPatients = Patient::count();
        $newPatientsThisMonth = Patient::where('created_at', '>=', $currentMonth)->count();

        // Appointments statistics
        $totalAppointments = Appointment::where('user_id', $userId)->count();
        $appointmentsThisMonth = Appointment::where('user_id', $userId)
            ->where('created_at', '>=', $currentMonth)
            ->count();
        $upcomingAppointments = Appointment::where('user_id', $userId)
            ->where('appointment_date', '>=', now())
            ->where('status', '!=', 'cancelled')
            ->count();
        $pendingAppointments = Appointment::where('user_id', $userId)
            ->where('status', 'pending')
            ->count();

        // Financial statistics
        $incomeThisMonth = Payment::where('status', 'completed')
            ->where('payment_date', '>=', $currentMonth)
            ->sum('amount');
        $incomeLastMonth = Payment::where('status', 'completed')
            ->whereBetween('payment_date', [$lastMonth, $currentMonth])
            ->sum('amount');
        
        $totalIncome = Payment::where('status', 'completed')->sum('amount');
        $accountsReceivable = PaymentPlan::where('status', 'active')->sum('remaining_amount');

        // Calculate percentage change
        $incomeChange = 0;
        if ($incomeLastMonth > 0) {
            $incomeChange = (($incomeThisMonth - $incomeLastMonth) / $incomeLastMonth) * 100;
        }

        return response()->json([
            'patients' => [
                'total' => $totalPatients,
                'new_this_month' => $newPatientsThisMonth,
            ],
            'appointments' => [
                'total' => $totalAppointments,
                'this_month' => $appointmentsThisMonth,
                'upcoming' => $upcomingAppointments,
                'pending' => $pendingAppointments,
            ],
            'finance' => [
                'income_this_month' => round($incomeThisMonth, 2),
                'income_last_month' => round($incomeLastMonth, 2),
                'income_change_percentage' => round($incomeChange, 2),
                'total_income' => round($totalIncome, 2),
                'accounts_receivable' => round($accountsReceivable, 2),
            ],
        ]);
    }

    /**
     * Get monthly income report
     */
    public function monthlyIncome(Request $request)
    {
        $year = $request->get('year', Carbon::now()->year);

        $monthlyIncome = Payment::select(
            DB::raw('MONTH(payment_date) as month'),
            DB::raw('SUM(amount) as total')
        )
            ->where('status', 'completed')
            ->whereYear('payment_date', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Fill missing months with 0
        $result = [];
        for ($i = 1; $i <= 12; $i++) {
            $found = $monthlyIncome->firstWhere('month', $i);
            $result[] = [
                'month' => $i,
                'month_name' => Carbon::create()->month($i)->format('F'),
                'total' => $found ? round($found->total, 2) : 0,
            ];
        }

        return response()->json($result);
    }

    /**
     * Get daily income report for a specific month
     */
    public function dailyIncome(Request $request)
    {
        $month = $request->get('month', Carbon::now()->month);
        $year = $request->get('year', Carbon::now()->year);

        $dailyIncome = Payment::select(
            DB::raw('DATE(payment_date) as date'),
            DB::raw('SUM(amount) as total')
        )
            ->where('status', 'completed')
            ->whereYear('payment_date', $year)
            ->whereMonth('payment_date', $month)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($dailyIncome);
    }

    /**
     * Get treatment types statistics
     */
    public function treatmentStats(Request $request)
    {
        $fromDate = $request->get('from_date', Carbon::now()->subYear());
        $toDate = $request->get('to_date', Carbon::now());

        $treatmentStats = Appointment::select(
            'treatment_type',
            DB::raw('COUNT(*) as count')
        )
            ->whereBetween('appointment_date', [$fromDate, $toDate])
            ->groupBy('treatment_type')
            ->orderBy('count', 'desc')
            ->get();

        return response()->json($treatmentStats);
    }

    /**
     * Get appointment status statistics
     */
    public function appointmentStats(Request $request)
    {
        $fromDate = $request->get('from_date', Carbon::now()->startOfMonth());
        $toDate = $request->get('to_date', Carbon::now());

        $statusStats = Appointment::select(
            'status',
            DB::raw('COUNT(*) as count')
        )
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->groupBy('status')
            ->get();

        // Cancellation rate
        $totalAppointments = $statusStats->sum('count');
        $cancelledAppointments = $statusStats->firstWhere('status', 'cancelled');
        $cancellationRate = $totalAppointments > 0 ? 
            ($cancelledAppointments ? ($cancelledAppointments->count / $totalAppointments) * 100 : 0) : 0;

        return response()->json([
            'by_status' => $statusStats,
            'cancellation_rate' => round($cancellationRate, 2),
            'total_appointments' => $totalAppointments,
        ]);
    }

    /**
     * Get payment method statistics
     */
    public function paymentMethodStats(Request $request)
    {
        $fromDate = $request->get('from_date', Carbon::now()->startOfMonth());
        $toDate = $request->get('to_date', Carbon::now());

        $paymentMethodStats = Payment::select(
            'payment_method',
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(amount) as total')
        )
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$fromDate, $toDate])
            ->groupBy('payment_method')
            ->get();

        return response()->json($paymentMethodStats);
    }

    /**
     * Get accounts receivable details
     */
    public function accountsReceivable()
    {
        $activePaymentPlans = PaymentPlan::with(['patient'])
            ->where('status', 'active')
            ->where('remaining_amount', '>', 0)
            ->orderBy('remaining_amount', 'desc')
            ->get();

        $totalReceivable = $activePaymentPlans->sum('remaining_amount');

        return response()->json([
            'total_receivable' => round($totalReceivable, 2),
            'active_plans_count' => $activePaymentPlans->count(),
            'plans' => $activePaymentPlans,
        ]);
    }

    /**
     * Get top patients by spending
     */
    public function topPatientsBySpending(Request $request)
    {
        $limit = $request->get('limit', 10);

        $topPatients = Payment::select(
            'patient_id',
            DB::raw('SUM(amount) as total_spent'),
            DB::raw('COUNT(*) as payment_count')
        )
            ->where('status', 'completed')
            ->groupBy('patient_id')
            ->orderBy('total_spent', 'desc')
            ->limit($limit)
            ->with('patient')
            ->get();

        return response()->json($topPatients);
    }

    /**
     * Get peak hours for appointments
     */
    public function peakHours(Request $request)
    {
        $fromDate = $request->get('from_date', Carbon::now()->subMonth());
        $toDate = $request->get('to_date', Carbon::now());

        $peakHours = Appointment::select(
            DB::raw('HOUR(appointment_date) as hour'),
            DB::raw('COUNT(*) as count')
        )
            ->whereNotNull('appointment_date')
            ->whereBetween('appointment_date', [$fromDate, $toDate])
            ->groupBy('hour')
            ->orderBy('count', 'desc')
            ->get();

        return response()->json($peakHours);
    }

    /**
     * Get comprehensive financial report
     */
    public function financialReport(Request $request)
    {
        $fromDate = $request->get('from_date', Carbon::now()->startOfMonth());
        $toDate = $request->get('to_date', Carbon::now());

        // Total income
        $totalIncome = Payment::where('status', 'completed')
            ->whereBetween('payment_date', [$fromDate, $toDate])
            ->sum('amount');

        // Payments by type
        $paymentsByType = Payment::select(
            'payment_type',
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(amount) as total')
        )
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$fromDate, $toDate])
            ->groupBy('payment_type')
            ->get();

        // Payments by method
        $paymentsByMethod = Payment::select(
            'payment_method',
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(amount) as total')
        )
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$fromDate, $toDate])
            ->groupBy('payment_method')
            ->get();

        // Active payment plans
        $activePaymentPlans = PaymentPlan::where('status', 'active')->count();
        $completedPaymentPlans = PaymentPlan::where('status', 'completed')
            ->whereBetween('end_date', [$fromDate, $toDate])
            ->count();

        // Accounts receivable
        $accountsReceivable = PaymentPlan::where('status', 'active')->sum('remaining_amount');

        return response()->json([
            'period' => [
                'from' => $fromDate,
                'to' => $toDate,
            ],
            'income' => [
                'total' => round($totalIncome, 2),
                'by_type' => $paymentsByType,
                'by_method' => $paymentsByMethod,
            ],
            'payment_plans' => [
                'active' => $activePaymentPlans,
                'completed_in_period' => $completedPaymentPlans,
            ],
            'accounts_receivable' => round($accountsReceivable, 2),
        ]);
    }
}
