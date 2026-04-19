import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MedicalRecord {
  id?: number;
  patient_id: number;
  appointment_id?: number;
  user_id?: number;
  record_date: string;
  record_type: 'consultation' | 'treatment' | 'follow_up' | 'diagnosis' | 'emergency' | 'other';
  title: string;
  description: string;
  diagnosis?: string;
  treatment_plan?: string;
  medications?: string;
  allergies?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  patient?: any;
  user?: any;
  appointment?: any;
  files?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private apiUrl = `${environment.apiUrl}/medical-records`;

  constructor(private http: HttpClient) {}

  /**
   * Get all medical records with optional filters
   */
  getRecords(params?: {
    patient_id?: number;
    record_type?: string;
    from_date?: string;
    to_date?: string;
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
   * Get a single medical record
   */
  getRecord(id: number): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new medical record
   */
  createRecord(record: MedicalRecord): Observable<any> {
    return this.http.post<any>(this.apiUrl, record);
  }

  /**
   * Update a medical record
   */
  updateRecord(id: number, record: Partial<MedicalRecord>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, record);
  }

  /**
   * Delete a medical record
   */
  deleteRecord(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get records by patient
   */
  getRecordsByPatient(patientId: number): Observable<any> {
    return this.getRecords({ patient_id: patientId });
  }
}
