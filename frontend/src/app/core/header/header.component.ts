import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  mobileOpen = false;
  scrolled = false;
  private scrollSub?: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // detecta scroll para compactar header (solo en browser)
    if (isPlatformBrowser(this.platformId)) {
      this.scrollSub = fromEvent(window, 'scroll')
        .pipe(throttleTime(50))
        .subscribe(() => {
          this.scrolled = window.scrollY > 12;
        });
    }
  }

  ngOnDestroy(): void {
    this.scrollSub?.unsubscribe();
  }

  toggleMobileMenu() {
    this.mobileOpen = !this.mobileOpen;
    if (isPlatformBrowser(this.platformId)) {
      if (this.mobileOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

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

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeAll();
  }
}
