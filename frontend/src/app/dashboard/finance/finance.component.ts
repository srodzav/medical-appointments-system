import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticsService } from '../../services/statistics.service';
import { PaymentService } from '../../services/payment.service';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface PaymentMethodStat {
  method: string;
  total: number;
  count: number;
  percentage: number;
}

interface AccountReceivable {
  patient_id: number;
  patient_name: string;
  total_pending: number;
  total_completed: number;
  oldest_pending_date: string;
}

interface FinancialSummary {
  today: number;
  this_week: number;
  this_month: number;
  this_year: number;
}

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss'
})
export class FinanceComponent implements OnInit {
  loading = true;
  
  // Financial summary
  incomeSummary: FinancialSummary = {
    today: 0,
    this_week: 0,
    this_month: 0,
    this_year: 0
  };
  
  // Payment methods
  paymentMethods: PaymentMethodStat[] = [];
  
  // Accounts receivable
  accountsReceivable: AccountReceivable[] = [];
  totalReceivable = 0;
  
  // Monthly income data
  monthlyIncome: any[] = [];
  
  // Daily income data
  dailyIncome: any[] = [];
  
  // Filters
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];
  
  years: number[] = [];

  constructor(
    private statisticsService: StatisticsService,
    private paymentService: PaymentService
  ) {
    // Generate last 5 years
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  ngOnInit(): void {
    this.loadFinancialData();
  }

  loadFinancialData(): void {
    this.loading = true;
    
    // Load all financial data
    Promise.all([
      this.loadIncomeSummary(),
      this.loadPaymentMethods(),
      this.loadAccountsReceivable(),
      this.loadMonthlyIncome(),
      this.loadDailyIncome()
    ]).finally(() => {
      this.loading = false;
    });
  }

  async loadIncomeSummary(): Promise<void> {
    try {
      const data = await firstValueFrom(this.statisticsService.getDashboardStats());
      this.incomeSummary = {
        today: 0, // Not available in current API
        this_week: 0, // Not available in current API
        this_month: data.finance?.income_this_month || 0,
        this_year: data.finance?.total_income || 0
      };
    } catch (error) {
      console.error('Error loading income summary:', error);
    }
  }

  async loadPaymentMethods(): Promise<void> {
    try {
      const data = await firstValueFrom(this.statisticsService.getPaymentMethodStats());
      this.paymentMethods = data || [];
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  }

  async loadAccountsReceivable(): Promise<void> {
    try {
      const data = await firstValueFrom(this.statisticsService.getAccountsReceivable());
      this.accountsReceivable = data.accounts || [];
      this.totalReceivable = data.total_receivable || 0;
    } catch (error) {
      console.error('Error loading accounts receivable:', error);
    }
  }

  async loadMonthlyIncome(): Promise<void> {
    try {
      const data = await firstValueFrom(this.statisticsService.getMonthlyIncome(this.selectedYear));
      this.monthlyIncome = data || [];
    } catch (error) {
      console.error('Error loading monthly income:', error);
    }
  }

  async loadDailyIncome(): Promise<void> {
    try {
      const data = await firstValueFrom(this.statisticsService.getDailyIncome(
        this.selectedMonth,
        this.selectedYear
      ));
      this.dailyIncome = data || [];
    } catch (error) {
      console.error('Error loading daily income:', error);
    }
  }

  onYearChange(): void {
    this.loadMonthlyIncome();
    this.loadDailyIncome();
  }

  onMonthChange(): void {
    this.loadDailyIncome();
  }

  getMonthName(month: number): string {
    const monthData = this.months.find(m => m.value === month);
    return monthData ? monthData.label : '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getMaxDailyIncome(): number {
    if (this.dailyIncome.length === 0) return 0;
    return Math.max(...this.dailyIncome.map(d => d.total || 0));
  }

  getMaxMonthlyIncome(): number {
    if (this.monthlyIncome.length === 0) return 0;
    return Math.max(...this.monthlyIncome.map(m => m.total || 0));
  }

  getBarHeight(value: number, max: number): number {
    if (max === 0) return 0;
    return (value / max) * 100;
  }
}
