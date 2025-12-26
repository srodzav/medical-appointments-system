import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.scss',
})
export class TreatmentsComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  mobileOpen = false;
  treatments = [
    {
      icon: 'straighten',
      title: 'Brackets Metálicos',
      description: 'Opción tradicional, efectiva y económica. Ideales para todo tipo de correcciones dentales.',
      features: ['Durables y resistentes', 'Resultados comprobados', 'Mejor relación calidad-precio'],
      popular: false,
    },
    {
      icon: 'auto_awesome',
      title: 'Brackets Estéticos',
      description: 'Brackets de cerámica o zafiro que se mimetizan con tus dientes para mayor discreción.',
      features: ['Prácticamente invisibles', 'Cómodos y suaves', 'Igual de efectivos'],
      popular: true,
    },
    {
      icon: 'visibility_off',
      title: 'Ortodoncia Invisible',
      description: 'Alineadores transparentes removibles. La opción más moderna y estética del mercado.',
      features: ['100% transparentes', 'Removibles', 'Sin brackets ni alambres'],
      popular: false,
    },
    {
      icon: 'child_care',
      title: 'Ortodoncia Infantil',
      description: 'Tratamientos especializados para niños y adolescentes en etapa de crecimiento.',
      features: ['Prevención temprana', 'Seguimiento personalizado', 'Resultados más rápidos'],
      popular: false,
    },
  ];

  closeAll() {
    this.mobileOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    this.closeAll();

    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 0;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  }
}
