import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  formData = {
    name: '',
    phone: '',
    email: '',
    message: '',
  };

  schedule = [
    { day: 'Lunes - Viernes', hours: '9:00 AM - 7:00 PM' },
    { day: 'Sábados', hours: '9:00 AM - 2:00 PM' },
    { day: 'Domingos', hours: 'Cerrado' },
  ];

  contactInfo = [
    {
      icon: 'location_on',
      title: 'Dirección',
      content: 'Calle Independencia 1189, Centro Historico, Col. Centro',
      subContent: 'San Luis Potosí, S.L.P. 78000',
      link: 'https://maps.google.com',
    },
    {
      icon: 'call',
      title: 'Teléfono',
      content: '444 312 2257',
      subContent: 'WhatsApp disponible',
      link: 'tel:+4443122257',
    },
    {
      icon: 'email',
      title: 'Email',
      content: 'contact@sebastianrdz.com',
      subContent: 'Respuesta en 24 horas',
      link: 'mailto:contact@sebastianrdz.com',
    },
  ];

  onSubmit() {
    console.log('Form submitted:', this.formData);
    // forms logic to send email
    alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      name: '',
      phone: '',
      email: '',
      message: '',
    };
  }
}
