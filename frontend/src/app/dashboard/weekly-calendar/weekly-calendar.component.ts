import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { RouterModule } from '@angular/router';

interface DaySlot {
  day: string;
  date: string;
  appointments: Appointment[];
}

@Component({
  selector: 'app-weekly-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './weekly-calendar.component.html',
  styleUrl: './weekly-calendar.component.scss',
})
export class WeeklyCalendarComponent implements OnInit {
  weekDays: DaySlot[] = [];
  startDate: Date = new Date();
  isLoading = false;
  error = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadWeeklyAppointments();
  }

  loadWeeklyAppointments() {
    this.isLoading = true;
    this.error = '';

    // Get Monday of current week
    const monday = this.getMonday(this.startDate);

    this.appointmentService.getWeeklyCalendar(monday.toISOString().split('T')[0]).subscribe({
      next: (response) => {
        this.buildWeekView(response.appointments, monday);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el calendario';
        this.isLoading = false;
        console.error('Error loading calendar:', err);
      },
    });
  }

  buildWeekView(appointments: Appointment[], startDate: Date) {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    this.weekDays = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      this.weekDays.push({
        day: days[i],
        date: dateStr,
        appointments: appointments.filter((apt) => {
          if (!apt.appointment_date) return false;
          const aptDate = new Date(apt.appointment_date).toISOString().split('T')[0];
          return aptDate === dateStr;
        }),
      });
    }
  }

  getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0); // Reset time to midnight
    return d;
  }

  previousWeek() {
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.loadWeeklyAppointments();
  }

  nextWeek() {
    this.startDate.setDate(this.startDate.getDate() + 7);
    this.loadWeeklyAppointments();
  }

  currentWeek() {
    this.startDate = new Date();
    this.loadWeeklyAppointments();
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
    });
  }

  getTreatmentText(type: string): string {
    const treatments: any = {
      consulta_general: 'Consulta General',
      brackets: 'Brackets General',
      brackets_metalicos: 'Brackets Metálicos',
      brackets_esteticos: 'Brackets Estéticos',
      ortodoncia: 'Ortodoncia General',
      ortodoncia_invisible: 'Ortodoncia Invisible',
      ortodoncia_infantil: 'Ortodoncia Infantil',
    };
    return treatments[type] || type;
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Completada';
      default:
        return 'Pendiente';
    }
  }
}
