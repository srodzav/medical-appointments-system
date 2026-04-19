import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Payment {
  id?: number;
  patient_id: number;
  appointment_id?: number;
  payment_plan_id?: number;
  user_id?: number;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'card' | 'transfer' | 'check' | 'other';
  payment_type: 'full' | 'partial' | 'installment';
  reference_number?: string;
  notes?: string;
  status: 'completed' | 'pending' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  patient?: any;
  user?: any;
  appointment?: any;
  payment_plan?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Get all payments with optional filters
   */
  getPayments(params?: {
    patient_id?: number;
    status?: string;
    from_date?: string;
    to_date?: string;
    payment_method?: string;
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
   * Get a single payment
   */
  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new payment
   */
  createPayment(payment: Payment): Observable<any> {
    return this.http.post<any>(this.apiUrl, payment);
  }

  /**
   * Update a payment
   */
  updatePayment(id: number, payment: Partial<Payment>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payment);
  }

  /**
   * Delete a payment
   */
  deletePayment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get payments by patient
   */
  getPaymentsByPatient(patientId: number): Observable<any> {
    return this.getPayments({ patient_id: patientId });
  }
}
