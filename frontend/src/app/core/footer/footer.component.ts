import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  email: string = '';

  panels = {
    treatments: false,
    services: false,
    subscribe: false,
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  togglePanel(name: 'treatments' | 'services' | 'subscribe') {
    this.panels[name] = !this.panels[name];
  }

  onSubmit() {
    if (!this.email) return;
    console.log('Nuevo suscriptor:', this.email);
    alert('¡Gracias por suscribirte! Te mantendremos informado sobre nuestras promociones y novedades.');
    this.email = '';
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();

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

  scrollToTop(event: Event) {
    event.preventDefault();

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
}
