import { Component } from '@angular/core';
import { HeaderComponent } from '../../core/header/header.component';
import { HeroComponent } from '../../core/hero/hero.component';
import { TreatmentsComponent } from '../../features/treatments/treatments.component';
import { BenefitsComponent } from '../../features/benefits/benefits.component';
import { AboutComponent } from '../../features/about/about.component';
import { ContactComponent } from '../../features/contact/contact.component';
import { FooterComponent } from '../../core/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent, HeroComponent, TreatmentsComponent, BenefitsComponent, AboutComponent, ContactComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
