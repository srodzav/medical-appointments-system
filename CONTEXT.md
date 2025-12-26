# CONTEXT - Demo Basic & Demo Pro

## Resumen del Proyecto

Este proyecto es parte de un sistema de demos para presentar a clientes del área médica/dental. Consta de tres componentes principales:

### Arquitectura de Subdominios

```
demo-basic.sebastianrdz.com    → Landing page estática
demo-pro.sebastianrdz.com      → Sistema completo con funcionalidades / Sistema completo para administrador
demo-api.sebastianrdz.com      → Backend API (Laravel)
```

### Propósito de Cada Demo

**Demo Basic (demo-basic):**

- Landing page estática y atractiva
- Diseño profesional para clínicas de ortodoncia/medicina
- Sin backend, solo frontend
- Agendar cita por WhatsApp directo
- Contacto por email
- Smooth scroll navigation
- SEO optimizado
- Deploy: Neubox

**Demo Pro (demo-pro):**

- Todo lo de demo-basic +
- Sistema de autenticación (login/register) para admin
- Dashboard administrativo
- CRUD de citas médicas
- Integración con Google Calendar
- Recordatorios automáticos (WhatsApp/Email)
- Panel de administración
- Consume API REST
- Deploy: Neubox

---

## 🎨 Stack Tecnológico - Demo Basic

### Frontend

- **Framework:** Angular 19
- **Arquitectura:** Standalone Components
- **Lenguaje:** TypeScript 5.7
- **Estilos:** SCSS con variables CSS
- **Renderizado:** Angular SSR (Server Side Rendering)
- **Icons:** Material Symbols + Font Awesome 6.5
- **Fuentes:** Inter (Google Fonts)

### Herramientas

- Node.js (requerido)
- Angular CLI
- Git para control de versiones

---

## 🏗️ Estructura del Proyecto Demo Basic

```
demo-basic/
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── core/                    # Componentes core
    │   │   │   ├── header/              # Navbar con smooth scroll
    │   │   │   ├── footer/              # Footer optimizado para móvil
    │   │   │   └── hero/                # Hero section principal
    │   │   │
    │   │   ├── features/                # Features de la landing
    │   │   │   ├── treatments/          # Sección de tratamientos
    │   │   │   ├── benefits/            # Sección de beneficios
    │   │   │   ├── about/               # Sección nosotros/equipo
    │   │   │   └── contact/             # Sección de contacto
    │   │   │
    │   │   ├── app.component.ts         # Root component
    │   │   ├── app.component.html       # Template principal
    │   │   ├── app.config.ts            # App config
    │   │   └── app.routes.ts            # Routing config
    │   │
    │   ├── index.html                   # HTML principal
    │   ├── main.ts                      # Entry point
    │   ├── main.server.ts               # SSR entry point
    │   └── styles.scss                  # Estilos globales + variables
    │
    ├── angular.json                     # Angular config
    ├── package.json                     # Dependencias
    ├── tsconfig.json                    # TypeScript config
    └── server.ts                        # Server SSR
```

---

## 🎨 Paleta de Colores (Variables CSS)

```scss
:root {
  --primary: #003c97; // Azul principal
  --primary-dark: #4338ca; // Azul oscuro
  --light-bg: #f0f8ff; // Fondo claro
  --accent: #007bff; // Acento
  --text: #111827; // Texto principal
  --white-text: #f9fafb; // Texto blanco
  --text-light: #64748b; // Texto secundario
  --success: #10b981; // Verde éxito
  --warning: #fbbf24; // Amarillo advertencia
}
```

---

## 📱 Componentes Implementados

### 1. Header (Navbar)

**Ubicación:** `src/app/core/header/`

**Features:**

- Logo clickeable (scroll to top)
- Navegación con smooth scroll a secciones
- Links: Tratamientos, Beneficios, Nosotros, Contacto
- Teléfono clickeable: 444 312 2257
- CTA destacado: "Agenda gratis"
- Menú hamburguesa para móvil
- Header sticky con efecto al scroll
- Cierre automático del menú móvil al navegar

**Funciones clave:**

```typescript
scrollToSection(event: Event, sectionId: string)  // Scroll suave a secciones
toggleMobileMenu()                                 // Abrir/cerrar menú móvil
closeAll()                                         // Cerrar menú
```

---

### 2. Hero Section

**Ubicación:** `src/app/core/hero/`

**Features:**

- Badge destacado: "Tu sonrisa perfecta comienza aquí"
- Headline principal con texto destacado
- Descripción persuasiva
- 2 CTAs principales:
  - "Agenda tu cita gratuita"
  - "Conoce nuestros tratamientos"
- 3 características destacadas:
  - Especialistas certificados
  - Horarios flexibles
  - Planes de financiamiento
- Placeholder visual para imagen
- Estadísticas floating: "15+ años", "5,000+ pacientes"
- Elementos decorativos animados
- Responsive design (2 columnas → 1 en móvil)

**Animaciones:**

- fadeInUp para contenido
- fadeInRight para imagen
- float para elementos decorativos

---

### 3. Treatments (Tratamientos)

**Ubicación:** `src/app/features/treatments/`

**Features:**

- 4 tipos de tratamientos:
  1. **Brackets Metálicos** - Tradicionales y efectivos
  2. **Brackets Estéticos** - Discretos (Marcado como "Más elegido")
  3. **Ortodoncia Invisible** - Alineadores transparentes
  4. **Ortodoncia Infantil** - Especializada para niños

**Cada tarjeta incluye:**

- Icono distintivo con gradiente
- Título y descripción
- 3 características con checkmarks
- CTA "Agendar consulta"
- Hover effect con elevación

**CTA Final:**

- Banner destacado: "¿No estás seguro cuál tratamiento es para ti?"
- Refuerza consulta gratuita

---

### 4. Benefits (Beneficios)

**Ubicación:** `src/app/features/benefits/`

**Features:**

- 6 beneficios diferenciadores:
  1. **Especialistas en ortodoncia** - Certificación internacional
  2. **Tratamientos 100% personalizados** - Plan exclusivo
  3. **Facilidades de pago** - Hasta 24 meses sin intereses
  4. **Seguimiento constante** - Atención 24/7
  5. **Resultados visibles y duraderos** - 98% satisfacción
  6. **Tecnología de vanguardia** - Tecnología 3D

**Sección de estadísticas:**

- 15+ años de experiencia
- 5,000+ pacientes atendidos
- 98% satisfacción del cliente
- 100% compromiso con resultados

**Testimonial:**

- Quote destacado de paciente satisfecho
- Avatar y detalles del tratamiento
- Genera confianza social

**Animaciones:**

- fadeInUp escalonado para cada card
- Hover effects sutiles

---

### 5. About (Nosotros)

**Ubicación:** `src/app/features/about/`

**Features:**

- Layout dividido: Visual + Contenido
- Placeholder para foto del equipo
- Badge de experiencia flotante
- Texto humanizado:
  - "Tu sonrisa en manos expertas"
  - Descripción de filosofía y compromiso

**Credenciales destacadas:**

- Certificaciones internacionales
- Miembros de asociaciones profesionales
- Actualización continua
- 5,000+ pacientes satisfechos

**Equipo de especialistas (3 cards):**

1. **Dra. Ana María Torres** - Ortodoncista Principal
2. **Dr. Carlos Mendoza** - Ortodoncista Senior
3. **Dra. Laura Martínez** - Especialista Ortodoncia Infantil

**CTA:** "Conoce a nuestro equipo"

---

### 6. Contact (Contacto)

**Ubicación:** `src/app/features/contact/`

**Features:**

**Formulario de contacto:**

- Nombre completo
- Teléfono
- Email
- Mensaje
- Validación required
- Alert de confirmación al enviar

**Información de contacto:**

- 📍 **Dirección:** Av. Constitución 1234, Col. Centro, SLP 78000
- 📞 **Teléfono:** 444 312 2257 (clickeable para llamar)
- ✉️ **Email:** contacto@ortodonciademo.com

**Horarios de atención:**

- Lunes - Viernes: 9:00 AM - 7:00 PM
- Sábados: 9:00 AM - 2:00 PM
- Domingos: Cerrado

**WhatsApp CTA:**

- Botón verde destacado
- Link directo: https://wa.me/524443122257
- "Respuesta inmediata"

**Mapa de Google Maps:**

- Integrado con iframe
- Responsive
- Muestra ubicación demo

---

### 7. Footer

**Ubicación:** `src/app/core/footer/`

**Features:**

**Desktop:**

- Logo clickeable (scroll to top)
- Descripción breve
- Redes sociales (Facebook, Twitter, Instagram)
- 2 columnas de navegación:
  - Navegación (Tratamientos, Beneficios, Nosotros, Contacto)
  - Legal (Aviso de privacidad, Términos, etc.)
- Formulario de suscripción funcional
- Contacto: WhatsApp + Email
- Copyright con link a sebastianrdz.com

**Mobile:**

- Diseño compacto optimizado
- Oculta descripción larga
- Oculta columnas de links
- Prioriza contacto y suscripción
- Reduce espaciados
- ~60% menos altura que desktop

**Funcionalidad:**

```typescript
scrollToSection(event, sectionId); // Scroll a secciones
scrollToTop(event); // Volver arriba
onSubmit(); // Suscripción con alert
```

---

## 🎯 Decisiones de Diseño

### Responsive Strategy

- **Desktop:** Grid de 2-4 columnas
- **Tablet:** Grid de 2 columnas
- **Mobile:** 1 columna, stack vertical

### Breakpoints

```scss
@media (max-width: 968px); // Tablet @media (max-width: 768px) // Mobile landscape @media (max-width: 576px) // Mobile portrait @media (max-width: 420px); // Small mobile
```

### Animaciones

- Smooth scroll nativo (`scroll-behavior: smooth`)
- fadeIn/fadeOut para entrada de elementos
- Float para elementos decorativos
- Hover effects sutiles con transform
- Transiciones de 0.3s para interacciones

### Accesibilidad

- Atributos ARIA correctos
- Labels en formularios
- Focus states visibles
- Contraste de colores WCAG AA
- Navegación por teclado (Escape cierra menús)

---

## 🔗 Enlaces y Funcionalidad

### Navegación Smooth Scroll

Todos los links del navbar apuntan a IDs de sección:

- `#tratamientos` → Treatments component
- `#beneficios` → Benefits component
- `#nosotros` → About component
- `#contacto` → Contact component

### Links Externos Funcionales

- **Teléfono:** `tel:+4443122257`
- **WhatsApp:** `https://wa.me/524443122257`
- **Email:** `mailto:contacto@ortodonciademo.com`
- **Redes Sociales:** Links a perfiles (placeholder)
- **Google Maps:** Iframe embebido con ubicación

### CTAs Principales

- "Agenda tu cita gratuita" (múltiples ubicaciones)
- "Conoce nuestros tratamientos"
- "Agendar consulta"
- WhatsApp directo

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
cd frontend
npm install

# Desarrollo local
npm start
# o
ng serve

# Build para producción
npm run build
# o
ng build

# Build con SSR
npm run build:ssr

# Servir SSR local
npm run serve:ssr
```

---

## 📦 Dependencias Principales

```json
{
  "@angular/core": "^19.0.0",
  "@angular/common": "^19.0.0",
  "@angular/router": "^19.0.0",
  "@angular/forms": "^19.0.0",
  "@angular/platform-browser": "^19.0.0",
  "@angular/platform-server": "^19.0.0",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "typescript": "~5.7.2"
}
```

---

## 🌐 Deploy

### Demo Basic (Actual)

- **Repositorio:** https://github.com/srodzav/demo-basic
- **URL:** https://demo-basic.sebastianrdz.com
- **Plataforma:** Neubox
- **Build Command:** `npm run build`
- **Output Directory:** `dist/frontend/browser`

### Configuración Vercel

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist/frontend/browser",
  "framework": "angular"
}
```

---

## 🎯 Roadmap Demo Pro

### Frontend Demo Pro

1. **Copiar base de demo-basic**
2. **Agregar autenticación:**
   - Componentes: Login, Register
   - Guards para rutas protegidas
   - Interceptors HTTP
   - Manejo de tokens
3. **Dashboard administrativo:**
   - Layout admin (sidebar + topbar)
   - Vista de citas (tabla/calendario)
   - CRUD de citas
   - Perfil de usuario
4. **Integración con API:**
   - Servicios HTTP
   - State management
   - Manejo de errores
5. **Features adicionales:**
   - Notificaciones en tiempo real
   - Filtros y búsquedas
   - Exportar datos

### Backend Demo Pro (Laravel)

1. **Setup inicial:**
   - Laravel 11
   - MySQL/PostgreSQL
   - Sanctum auth
2. **Modelos y migraciones:**
   - Users
   - Appointments (citas)
   - Patients
   - Notifications
3. **API REST:**
   - Auth endpoints
   - CRUD citas
   - Usuarios
4. **Integraciones:**
   - Google Calendar API
   - Twilio/WhatsApp Business API
   - Servicio de emails
5. **Features avanzadas:**
   - Cron jobs para recordatorios
   - Webhooks
   - Logs y auditoría

---

## 💡 Notas Importantes

### Para el Nuevo Chat (Demo Pro)

Cuando empieces a trabajar en demo-pro, recuerda:

1. **Copiar el código base:** Puedes copiar todo el directorio `frontend/` de demo-basic como punto de partida
2. **Agregar FormsModule reactivo:** Para formularios complejos
3. **Instalar HttpClient:** Para consumir API
4. **Agregar Guards:** Para proteger rutas del dashboard
5. **State management:** Considerar NgRx o Signals
6. **Separar layouts:** Un layout público (landing) y uno privado (dashboard)

### Estructura de Rutas Demo Pro

```typescript
const routes = [
  // Público
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protegido (Dashboard)
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'citas', component: AppointmentsComponent },
      { path: 'calendario', component: CalendarComponent },
      { path: 'perfil', component: ProfileComponent },
    ],
  },
];
```

### API Endpoints (Laravel)

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/user

GET    /api/appointments
POST   /api/appointments
GET    /api/appointments/:id
PUT    /api/appointments/:id
DELETE /api/appointments/:id

POST   /api/appointments/:id/confirm
POST   /api/appointments/:id/cancel
POST   /api/appointments/:id/reschedule
```

---

## 📞 Información de Contacto Demo

**Datos utilizados en el demo:**

- Teléfono: 444 312 2257
- WhatsApp: +52 444 312 2257
- Email: contacto@ortodonciademo.com
- Dirección: Av. Constitución 1234, Col. Centro, San Luis Potosí, S.L.P. 78000

**Redes sociales (placeholder):**

- Facebook: https://facebook.com
- Twitter: https://twitter.com
- Instagram: https://instagram.com

---

## 🎨 Recursos y Assets

### Iconos

- **Material Symbols Outlined:** Usados en toda la aplicación
- **Font Awesome 6.5:** Redes sociales y algunos iconos

### Fuentes

- **Inter:** Google Fonts, pesos 400-900
- Aplicada globalmente via `styles.scss`

### Placeholders

- Iconos de Material Symbols para imágenes de personas
- Gradientes de marca para fondos
- Elementos decorativos con CSS

---

## 🔧 Solución de Problemas Comunes

### Error: Cannot find module '@angular/...'

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### SSR no funciona

```bash
npm run build:ssr
npm run serve:ssr:frontend
```

### Smooth scroll no funciona

Verificar que `styles.scss` tenga:

```scss
html {
  scroll-behavior: smooth;
}
```

---

## 📚 Referencias

- **Angular Docs:** https://angular.dev
- **Material Symbols:** https://fonts.google.com/icons
- **Font Awesome:** https://fontawesome.com
- **Portfolio:** https://sebastianrdz.com

---

## ✅ Checklist de Implementación Demo Pro

### Frontend

- [ ] Copiar código base de demo-basic
- [ ] Implementar sistema de autenticación
- [ ] Crear layout de dashboard
- [ ] Implementar CRUD de citas
- [ ] Agregar guards y protección de rutas
- [ ] Conectar con API backend
- [ ] Implementar manejo de estados
- [ ] Agregar loading states y spinners
- [ ] Implementar manejo de errores
- [ ] Testing

### Backend

- [ ] Crear proyecto Laravel
- [ ] Configurar base de datos
- [ ] Implementar autenticación Sanctum
- [ ] Crear modelos y migraciones
- [ ] Implementar API REST
- [ ] Integrar Google Calendar
- [ ] Configurar notificaciones (Email/WhatsApp)
- [ ] Crear seeders con datos demo
- [ ] Documentar API (Swagger/Postman)
- [ ] Testing

---

**Última actualización:** Diciembre 26, 2025
**Autor:** Sebastian Rodriguez
**Versión:** Demo Basic v1.0
