import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  mobileOpen = false;
  features = [
    { icon: 'verified', text: 'Especialistas certificados' },
    { icon: 'schedule', text: 'Horarios flexibles' },
    { icon: 'payments', text: 'Planes de financiamiento' },
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
