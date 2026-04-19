import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService, Patient } from '../../../services/patient.service';
import { MedicalRecordService, MedicalRecord } from '../../../services/medical-record.service';
import { PaymentService, Payment } from '../../../services/payment.service';
import { PaymentPlanService, PaymentPlan } from '../../../services/payment-plan.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  patient: Patient | null = null;
  loading = true;
  activeTab: 'info' | 'medical' | 'payments' | 'plans' = 'info';
  
  // Medical Records
  medicalRecords: MedicalRecord[] = [];
  loadingRecords = false;
  showRecordForm = false;
  newRecord: Partial<MedicalRecord> = {
    record_type: 'consultation',
    record_date: new Date().toISOString().split('T')[0],
  };

  // Payments
  payments: Payment[] = [];
  loadingPayments = false;
  showPaymentForm = false;
  newPayment: Partial<Payment> = {
    payment_method: 'cash',
    payment_type: 'full',
    status: 'completed',
    payment_date: new Date().toISOString().split('T')[0],
  };

  // Payment Plans
  paymentPlans: PaymentPlan[] = [];
  loadingPlans = false;
  showPlanForm = false;
  newPlan: Partial<PaymentPlan> = {
    total_installments: 1,
    start_date: new Date().toISOString().split('T')[0],
  };

  // Edit patient
  editingPatient = false;
  editedPatient: Partial<Patient> = {};

  constructor(
    private patientService: PatientService,
    private medicalRecordService: MedicalRecordService,
    private paymentService: PaymentService,
    private paymentPlanService: PaymentPlanService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(+id);
    }
  }

  loadPatient(id: number): void {
    this.loading = true;
    this.patientService.getById(id).subscribe({
      next: (response) => {
        this.patient = response.patient;
        this.editedPatient = { ...this.patient };
        if (this.editedPatient.birth_date) {
          this.editedPatient.birth_date = this.editedPatient.birth_date.split('T')[0];
        }
        this.loading = false;
        this.loadMedicalRecords(id);
        this.loadPayments(id);
        this.loadPaymentPlans(id);
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.loading = false;
        this.notification.error('No se pudo cargar la información del paciente');
      },
    });
  }

  loadMedicalRecords(patientId: number): void {
    this.loadingRecords = true;
    this.medicalRecordService.getRecordsByPatient(patientId).subscribe({
      next: (response) => {
        this.medicalRecords = response.data || [];
        this.loadingRecords = false;
      },
      error: (error) => {
        console.error('Error loading medical records:', error);
        this.loadingRecords = false;
      },
    });
  }

  loadPayments(patientId: number): void {
    this.loadingPayments = true;
    this.paymentService.getPaymentsByPatient(patientId).subscribe({
      next: (response) => {
        this.payments = response.data || [];
        this.loadingPayments = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loadingPayments = false;
      },
    });
  }

  loadPaymentPlans(patientId: number): void {
    this.loadingPlans = true;
    this.paymentPlanService.getPaymentPlansByPatient(patientId).subscribe({
      next: (response) => {
        this.paymentPlans = response.data || [];
        this.loadingPlans = false;
      },
      error: (error) => {
        console.error('Error loading payment plans:', error);
        this.loadingPlans = false;
      },
    });
  }

  // Patient Management
  toggleEditPatient(): void {
    this.editingPatient = !this.editingPatient;
    if (!this.editingPatient && this.patient) {
      this.editedPatient = { ...this.patient };
    }
  }

  savePatient(): void {
    if (!this.patient || !this.patient.id) return;
    
    this.patientService.update(this.patient.id, this.editedPatient).subscribe({
      next: (response) => {
        this.patient = response.patient;
        this.editedPatient = { ...this.patient };
        if (this.editedPatient.birth_date) {
          this.editedPatient.birth_date = this.editedPatient.birth_date.split('T')[0];
        }
        this.editingPatient = false;
        this.notification.success('Paciente actualizado correctamente');
      },
      error: (error) => {
        console.error('Error updating patient:', error);
        this.notification.error('No se pudo actualizar el paciente');
      },
    });
  }

  // Medical Records Management
  saveRecord(): void {
    if (!this.patient) return;

    const record = {
      ...this.newRecord,
      patient_id: this.patient.id,
    } as MedicalRecord;

    this.medicalRecordService.createRecord(record).subscribe({
      next: (response) => {
        this.medicalRecords.unshift(response.data);
        this.showRecordForm = false;
        this.resetRecordForm();
        this.notification.success('Registro médico creado exitosamente');
      },
      error: (error) => {
        console.error('Error creating medical record:', error);
        this.notification.error('No se pudo crear el registro médico');
      },
    });
  }

  deleteRecord(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este registro médico?')) return;

    this.medicalRecordService.deleteRecord(id).subscribe({
      next: () => {
        this.medicalRecords = this.medicalRecords.filter((r) => r.id !== id);
        this.notification.success('Registro eliminado correctamente');
      },
      error: (error) => {
        console.error('Error deleting record:', error);
        this.notification.error('No se pudo eliminar el registro');
      },
    });
  }

  resetRecordForm(): void {
    this.newRecord = {
      record_type: 'consultation',
      record_date: new Date().toISOString().split('T')[0],
    };
  }

  // Payments Management
  savePayment(): void {
    if (!this.patient) return;

    const payment = {
      ...this.newPayment,
      patient_id: this.patient.id,
    } as Payment;

    this.paymentService.createPayment(payment).subscribe({
      next: (response) => {
        this.payments.unshift(response.data);
        this.showPaymentForm = false;
        this.resetPaymentForm();
        this.notification.success('Pago registrado exitosamente');
        // Reload payment plans to update balances
        this.loadPaymentPlans(this.patient!.id);
      },
      error: (error) => {
        console.error('Error creating payment:', error);
        this.notification.error('No se pudo registrar el pago');
      },
    });
  }

  deletePayment(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este pago?')) return;

    this.paymentService.deletePayment(id).subscribe({
      next: () => {
        this.payments = this.payments.filter((p) => p.id !== id);
        this.notification.success('Pago eliminado correctamente');
        if (this.patient) {
          this.loadPaymentPlans(this.patient.id);
        }
      },
      error: (error) => {
        console.error('Error deleting payment:', error);
        this.notification.error('No se pudo eliminar el pago');
      },
    });
  }

  resetPaymentForm(): void {
    this.newPayment = {
      payment_method: 'cash',
      payment_type: 'full',
      status: 'completed',
      payment_date: new Date().toISOString().split('T')[0],
    };
  }

  // Payment Plans Management
  savePlan(): void {
    if (!this.patient) return;

    const plan = {
      ...this.newPlan,
      patient_id: this.patient.id,
      paid_amount: 0,
      remaining_amount: this.newPlan.total_amount,
      paid_installments: 0,
      status: 'active' as const,
    } as PaymentPlan;

    this.paymentPlanService.createPaymentPlan(plan).subscribe({
      next: (response) => {
        this.paymentPlans.unshift(response.data);
        this.showPlanForm = false;
        this.resetPlanForm();
        this.notification.success('Plan de pagos creado exitosamente');
      },
      error: (error) => {
        console.error('Error creating payment plan:', error);
        this.notification.error('No se pudo crear el plan de pagos');
      },
    });
  }

  cancelPlan(id: number): void {
    if (!confirm('¿Estás seguro de cancelar este plan de pagos?')) return;

    this.paymentPlanService.cancelPaymentPlan(id).subscribe({
      next: () => {
        const plan = this.paymentPlans.find((p) => p.id === id);
        if (plan) {
          plan.status = 'cancelled';
        }
        this.notification.warning('Plan de pagos cancelado');
      },
      error: (error) => {
        console.error('Error canceling plan:', error);
        this.notification.error('No se pudo cancelar el plan');
      },
    });
  }

  deletePlan(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este plan de pagos?')) return;

    this.paymentPlanService.deletePaymentPlan(id).subscribe({
      next: () => {
        this.paymentPlans = this.paymentPlans.filter((p) => p.id !== id);
        this.notification.success('Plan eliminado correctamente');
      },
      error: (error) => {
        console.error('Error deleting plan:', error);
        this.notification.error(error.error?.error || 'No se pudo eliminar el plan');
      },
    });
  }

  resetPlanForm(): void {
    this.newPlan = {
      total_installments: 1,
      start_date: new Date().toISOString().split('T')[0],
    };
  }

  // Helpers
  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      cancelled: 'status-cancelled',
      completed: 'status-completed',
      active: 'status-active',
    };
    return classes[status] || '';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
      active: 'Activo',
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
      consulta_general: 'Consulta General',
    };
    return treatments[type] || type;
  }

  getRecordTypeText(type: string): string {
    const types: { [key: string]: string } = {
      consultation: 'Consulta',
      treatment: 'Tratamiento',
      follow_up: 'Seguimiento',
      diagnosis: 'Diagnóstico',
      emergency: 'Emergencia',
      other: 'Otro',
    };
    return types[type] || type;
  }

  getPaymentMethodText(method: string): string {
    const methods: { [key: string]: string } = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
      check: 'Cheque',
      other: 'Otro',
    };
    return methods[method] || method;
  }

  getPaymentTypeText(type: string): string {
    const types: { [key: string]: string } = {
      full: 'Pago Completo',
      partial: 'Pago Parcial',
      installment: 'Abono',
    };
    return types[type] || type;
  }

  calculateProgress(plan: PaymentPlan): number {
    return this.paymentPlanService.calculateProgress(plan);
  }

  getTotalPaid(): number {
    return this.payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + Number(p.amount), 0);
  }

  getCompletedPaymentsCount(): number {
    return this.payments.filter((p) => p.status === 'completed').length;
  }

  getTotalDebt(): number {
    return this.paymentPlans
      .filter((p) => p.status === 'active')
      .reduce((sum, p) => sum + Number(p.remaining_amount), 0);
  }
}
