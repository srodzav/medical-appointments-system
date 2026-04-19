import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentPlan {
  id?: number;
  patient_id: number;
  user_id?: number;
  treatment_name: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  total_installments: number;
  paid_installments: number;
  installment_amount?: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  patient?: any;
  user?: any;
  payments?: any[];
  progress_percentage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentPlanService {
  private apiUrl = `${environment.apiUrl}/payment-plans`;

  constructor(private http: HttpClient) {}

  /**
   * Get all payment plans with optional filters
   */
  getPaymentPlans(params?: {
    patient_id?: number;
    status?: string;
  }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params]) {
          httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
        }
      });
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  /**
   * Get a single payment plan
   */
  getPaymentPlan(id: number): Observable<PaymentPlan> {
    return this.http.get<PaymentPlan>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new payment plan
   */
  createPaymentPlan(plan: PaymentPlan): Observable<any> {
    return this.http.post<any>(this.apiUrl, plan);
  }

  /**
   * Update a payment plan
   */
  updatePaymentPlan(id: number, plan: Partial<PaymentPlan>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, plan);
  }

  /**
   * Delete a payment plan
   */
  deletePaymentPlan(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cancel a payment plan
   */
  cancelPaymentPlan(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/cancel`, {});
  }

  /**
   * Get payment plans by patient
   */
  getPaymentPlansByPatient(patientId: number): Observable<any> {
    return this.getPaymentPlans({ patient_id: patientId });
  }

  /**
   * Calculate progress percentage
   */
  calculateProgress(plan: PaymentPlan): number {
    if (plan.total_amount === 0) {
      return 0;
    }
    return Math.round((plan.paid_amount / plan.total_amount) * 100);
  }
}
