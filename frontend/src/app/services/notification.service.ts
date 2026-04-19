import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Mensaje de éxito
   */
  success(message: string, title: string = 'Éxito'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.toastr.success(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Mensaje de error
   */
  error(message: string, title: string = 'Error'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.toastr.error(message, title, {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      enableHtml: true,
    });
  }

  /**
   * Mensaje de advertencia
   */
  warning(message: string, title: string = 'Advertencia'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.toastr.warning(message, title, {
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Mensaje informativo
   */
  info(message: string, title: string = 'Información'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.toastr.info(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Mensaje personalizado con opciones
   */
  custom(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title?: string,
    options?: any
  ): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const defaultOptions = {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      enableHtml: false,
      ...options,
    };

    switch (type) {
      case 'success':
        this.toastr.success(message, title, defaultOptions);
        break;
      case 'error':
        this.toastr.error(message, title, defaultOptions);
        break;
      case 'warning':
        this.toastr.warning(message, title, defaultOptions);
        break;
      case 'info':
        this.toastr.info(message, title, defaultOptions);
        break;
    }
  }

  /**
   * Mensaje con acción (sin cerrar automáticamente)
   */
  persistent(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title?: string
  ): void {
    const options = {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: true,
      tapToDismiss: false,
    };

    this.custom(type, message, title, options);
  }

  /**
   * Limpiar todas las notificaciones
   */
  clear(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.toastr.clear();
  }
}
