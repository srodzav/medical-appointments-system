import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  appointments_count?: number;
  latest_appointment?: any;
  appointments?: any[];
}

export interface PatientFilters {
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  /**
   * Get all patients with pagination
   */
  getAll(filters?: PatientFilters): Observable<any> {
    let params = new HttpParams();

    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.sort_by) {
      params = params.set('sort_by', filters.sort_by);
    }
    if (filters?.sort_order) {
      params = params.set('sort_order', filters.sort_order);
    }
    if (filters?.per_page) {
      params = params.set('per_page', filters.per_page.toString());
    }

    return this.http.get(this.apiUrl, { params });
  }

  /**
   * Search patients (autocomplete)
   */
  search(query: string): Observable<Patient[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Patient[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Find patient by email
   */
  findByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.apiUrl}/find-by-email`, { params });
  }

  /**
   * Find or create patient
   */
  findOrCreate(data: { name: string; email: string; phone: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/find-or-create`, data);
  }

  /**
   * Get patient by ID with appointments
   */
  getById(id: number): Observable<{ patient: Patient }> {
    return this.http.get<{ patient: Patient }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new patient
   */
  create(patient: Partial<Patient>): Observable<any> {
    return this.http.post(this.apiUrl, patient);
  }

  /**
   * Update patient
   */
  update(id: number, patient: Partial<Patient>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, patient);
  }

  /**
   * Delete patient
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
