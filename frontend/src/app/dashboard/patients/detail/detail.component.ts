import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PatientService, Patient } from '../../../services/patient.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  patient: Patient | null = null;
  loading = true;

  constructor(private patientService: PatientService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(+id);
    }
  }

  loadPatient(id: number): void {
    this.patientService.getById(id).subscribe({
      next: (response) => {
        this.patient = response.patient;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.loading = false;
      },
    });
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      cancelled: 'status-cancelled',
      completed: 'status-completed',
    };
    return classes[status] || '';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
    };
    return texts[status] || status;
  }

  getTreatmentText(type: string): string {
    const treatments: { [key: string]: string } = {
      brackets_metalicos: 'Brackets Metálicos',
      brackets_esteticos: 'Brackets Estéticos',
      ortodoncia_invisible: 'Ortodoncia Invisible',
      ortodoncia_infantil: 'Ortodoncia Infantil',
      ortodoncia: 'Ortodoncia',
      brackets: 'Brackets',
      invisalign: 'Invisalign',
      retenedores: 'Retenedores',
      consulta: 'Consulta General',
    };
    return treatments[type] || type;
  }
}
