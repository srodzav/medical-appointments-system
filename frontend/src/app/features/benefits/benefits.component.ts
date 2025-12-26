import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './benefits.component.html',
  styleUrl: './benefits.component.scss',
})
export class BenefitsComponent {
  benefits = [
    {
      icon: 'workspace_premium',
      title: 'Especialistas en ortodoncia',
      description: 'Equipo certificado con más de 15 años de experiencia en tratamientos ortodónticos avanzados.',
      highlight: 'Certificación internacional',
    },
    {
      icon: 'tune',
      title: 'Tratamientos 100% personalizados',
      description: 'Cada sonrisa es única. Diseñamos un plan de tratamiento exclusivo basado en tus necesidades específicas.',
      highlight: 'Plan personalizado',
    },
    {
      icon: 'payments',
      title: 'Facilidades de pago',
      description: 'Opciones flexibles de financiamiento sin intereses. Tu sonrisa perfecta al alcance de tu bolsillo.',
      highlight: 'Hasta 24 meses sin intereses',
    },
    {
      icon: 'monitor_heart',
      title: 'Seguimiento constante',
      description: 'Monitoreo continuo de tu progreso con citas regulares y comunicación directa con tu ortodoncista.',
      highlight: 'Atención 24/7',
    },
    {
      icon: 'verified',
      title: 'Resultados visibles y duraderos',
      description: 'Técnicas probadas que garantizan resultados permanentes. Miles de pacientes satisfechos nos respaldan.',
      highlight: '98% de satisfacción',
    },
    {
      icon: 'science',
      title: 'Tecnología de vanguardia',
      description: 'Equipos de última generación y técnicas innovadoras para tratamientos más rápidos y cómodos.',
      highlight: 'Tecnología 3D',
    },
  ];
}
