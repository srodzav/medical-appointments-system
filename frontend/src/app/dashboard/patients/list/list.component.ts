import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService, Patient } from '../../../services/patient.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  patients: Patient[] = [];
  loading = true;
  searchQuery = '';
  currentPage = 1;
  lastPage = 1;
  total = 0;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService
      .getAll({
        search: this.searchQuery || undefined,
        per_page: 15,
      })
      .subscribe({
        next: (response) => {
          this.patients = response.data;
          this.currentPage = response.current_page;
          this.lastPage = response.last_page;
          this.total = response.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading patients:', error);
          this.loading = false;
        },
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadPatients();
  }

  deletePatient(patient: Patient): void {
    if (!confirm(`¿Estás seguro de eliminar a ${patient.name}? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.patientService.delete(patient.id).subscribe({
      next: () => {
        this.loadPatients();
      },
      error: (error) => {
        alert(error.error.message || 'No se puede eliminar un paciente con citas registradas');
      },
    });
  }
}
