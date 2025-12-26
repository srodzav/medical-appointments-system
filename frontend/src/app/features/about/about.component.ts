import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  mobileOpen = false;
  team = [
    {
      name: 'Dra. Ana María Torres',
      role: 'Ortodoncista Principal',
      credentials: 'Especialista certificada por el Consejo Mexicano de Ortodoncia',
      image: 'sentiment_satisfied',
    },
    {
      name: 'Dr. Carlos Mendoza',
      role: 'Ortodoncista Senior',
      credentials: 'Maestría en Ortodoncia y Ortopedia Maxilofacial',
      image: 'sentiment_satisfied',
    },
    {
      name: 'Dra. Laura Martínez',
      role: 'Especialista en Ortodoncia Infantil',
      credentials: 'Certificación Internacional en Ortodoncia Interceptiva',
      image: 'sentiment_satisfied',
    },
  ];

  credentials = [
    { icon: 'school', text: 'Certificaciones internacionales' },
    { icon: 'workspace_premium', text: 'Miembros activos de asociaciones profesionales' },
    { icon: 'update', text: 'Actualización continua en nuevas técnicas' },
    { icon: 'favorite', text: 'Más de 5,000 pacientes satisfechos' },
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
