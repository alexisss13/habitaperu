# HabitaPeru — Estado actual y roadmap completo

> Documento de referencia técnica para continuar el desarrollo.
> Actualizado: mayo 2026.

---

## 1. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15+ (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Base de datos | PostgreSQL vía Prisma ORM |
| Autenticación | NextAuth v5 (auth.js) |
| Internacionalización | i18n custom con contexto React (`lib/i18n-context.tsx`) |
| Iconos | `hugeicons-react` |
| Validaciones | Zod |
| Hashing criptográfico | Node.js `crypto` (SHA-256) |

---

## 2. Arquitectura responsive — cómo funciona

### La regla fundamental
El punto de corte es **768px**. Por debajo → móvil. Por encima → desktop.

```
window.innerWidth < 768px  →  isMobile: true
window.innerWidth >= 768px →  isMobile: false (isDesktop)
```

El hook `hooks/useResponsive.ts` mide el ancho del cliente. Devuelve `isLoading: true` durante el primer render de SSR para evitar flash de layout incorrecto.

### Patrón A — rutas sin datos de servidor (login, register, settings públicas)

```
app/[locale]/login/
├── page.tsx              ← 'use client', usa useResponsive, renderiza Mobile o Desktop
├── login-desktop.tsx     ← componente de la vista desktop
└── login-mobile.tsx      ← componente de la vista móvil
```

### Patrón B — rutas con datos de servidor (home, admin/*, landlord, tenant, propiedades)

```
app/admin/dashboard/
├── page.tsx              ← Server Component, hace fetch a DB, retorna <DashboardView data={...} />
├── dashboard-view.tsx    ← 'use client', usa useResponsive → renderiza Mobile o Desktop
├── dashboard-desktop.tsx ← componente de la vista desktop
└── dashboard-mobile.tsx  ← componente de la vista móvil
```

**Regla:** Los server components (`page.tsx`) nunca importan `useResponsive`. Solo los `*-view.tsx` lo hacen.

### Ejemplo de un view típico

```tsx
// 'use client'
export function XyzView({ data }: Props) {
  const { isMobile, isLoading } = useResponsive()
  if (isLoading) return <LoadingScreen message="Cargando..." />
  return isMobile ? <XyzMobile data={data} /> : <XyzDesktop data={data} />
}
```

---

## 3. Convenciones de estilos (Tailwind v4)

### Regla general: siempre Tailwind, salvo estas excepciones

| Caso | Qué usar | Ejemplo |
|---|---|---|
| Layout, spacing, colores de marca | `className="..."` Tailwind | `className="flex items-center gap-4 bg-accent text-white"` |
| Valores **dinámicos en runtime** (React state) | `style={{}}` | `style={{ marginLeft: isSidebarCollapsed ? '80px' : '280px' }}` |
| Gradientes de marca y decorativos | `style={{}}` | `style={{ background: 'linear-gradient(135deg, #0f3457 0%, #0a2540 100%)' }}` |
| Radial-gradient blobs decorativos | `style={{}}` | `style={{ background: 'radial-gradient(circle, rgba(15,52,87,0.04) 0%, transparent 70%)' }}` |
| CSS gradient text (`-webkit-background-clip`) | `style={{}}` | Ver hero del publicar |
| Animaciones con `@keyframes` complejos | `style jsx` | gradientShift en header |
| CSS variables NO mapeadas en `@theme` | `className="bg-[var(--admin-hover-bg)]"` | Arbitrary value |
| `clamp()` en font-size | `className="text-[clamp(2rem,4vw,2.75rem)]"` | Arbitrary value |
| `repeat(auto-fit, ...)` en grid | `className="grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"` | Arbitrary value |

### Tokens Tailwind disponibles (definidos en `@theme` en `globals.css`)

```
bg-bg / bg-bg-2 / bg-bg-card / bg-border
text-text / text-text-muted / text-text-dim
bg-accent / text-accent / border-accent
bg-accent-secondary / text-accent-secondary
text-brown / bg-cream
bg-green / text-green
bg-red / text-red
bg-admin-bg / bg-admin-sidebar-bg / bg-admin-card-bg
border-admin-border / text-admin-text / text-admin-text-muted
text-admin-accent / text-admin-success / text-admin-warning / text-admin-error
shadow-sm / shadow-base / shadow-lg / shadow-card
rounded-DEFAULT / rounded-sm
```

### Hover — nunca `onMouseEnter/Leave`

```tsx
// MAL — no usar
onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)' }}

// BIEN — Tailwind puro
className="transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(15,52,87,0.15)]"
```

---

## 4. Estructura de rutas — estado actual

### Rutas públicas / i18n

| Ruta | Estado | Desktop | Mobile |
|---|---|---|---|
| `/[locale]/` (home) | ✅ Completo | `home-client-desktop.tsx` | `home-client-mobile.tsx` |
| `/[locale]/login` | ✅ Completo | `login-desktop.tsx` | `login-mobile.tsx` |
| `/[locale]/register` | ✅ Completo | `register-desktop.tsx` | `register-mobile.tsx` |
| `/[locale]/publicar` | ✅ Landing page | `publish-client.tsx` | `publish-mobile.tsx` |
| `/[locale]/publicar/formulario` | ❌ **Pendiente** | — | — |
| `/propiedades` | ✅ Vista básica | `propiedades-desktop.tsx` | `propiedades-mobile.tsx` |
| `/propiedades/[id]` | ✅ Vista básica | `property-detail-desktop.tsx` | `property-detail-mobile.tsx` |

### Panel Admin (`/admin/*`)

| Ruta | Estado | Desktop | Mobile |
|---|---|---|---|
| `/admin/dashboard` | ✅ Completo | `dashboard-desktop.tsx` | `dashboard-mobile.tsx` |
| `/admin/users` | ✅ Vista básica | `users-desktop.tsx` | `users-mobile.tsx` |
| `/admin/contracts` | ✅ Vista básica | `contracts-desktop.tsx` | `contracts-mobile.tsx` |
| `/admin/payments` | ✅ Vista básica | `payments-desktop.tsx` | `payments-mobile.tsx` |
| `/admin/properties` | ✅ Vista básica | `properties-desktop.tsx` | `properties-mobile.tsx` |
| `/admin/settings` | ✅ Vista básica | `settings-desktop.tsx` | `settings-mobile.tsx` |
| `/admin/kyc` | ❌ **Pendiente** | — | — |
| `/admin/audit` | ❌ **Pendiente** | — | — |

### Panel Arrendador (`/landlord/*`)

| Ruta | Estado | Desktop | Mobile |
|---|---|---|---|
| `/landlord/dashboard` | ✅ Completo | `dashboard-desktop.tsx` | `dashboard-mobile.tsx` |
| `/landlord/tenants` | ✅ Completo | `tenants-desktop.tsx` | `tenants-mobile.tsx` |
| `/landlord/contracts` | ✅ Completo | `contracts-desktop.tsx` | `contracts-mobile.tsx` |
| `/landlord/payments` | ✅ Completo | `payments-desktop.tsx` | `payments-mobile.tsx` |
| `/landlord/settings` | ✅ Completo | usa `UserSettingsView` | — |
| `/landlord/properties` | ✅ Completo | `properties-desktop.tsx` | `properties-mobile.tsx` |
| `/landlord/properties/new` | ✅ Completo | multi-step form (un archivo) | responsive |
| `/landlord/properties/[id]/edit` | ❌ **Pendiente** | — | — |
| `/landlord/contracts/new` | ✅ integrado en contracts | — | — |
| `/landlord/contracts/[id]` | → usa `/contracts/[id]` | — | — |

### Panel Inquilino (`/tenant/*`)

| Ruta | Estado | Desktop | Mobile |
|---|---|---|---|
| `/tenant/dashboard` | ✅ Completo | `dashboard-desktop.tsx` | `dashboard-mobile.tsx` |
| `/tenant/contract` | ✅ Completo | `contract-desktop.tsx` | `contract-mobile.tsx` |
| `/tenant/payments` | ✅ Completo | `payments-desktop.tsx` | `payments-mobile.tsx` |
| `/tenant/favorites` | ✅ Completo | `favorites-desktop.tsx` | `favorites-mobile.tsx` |
| `/tenant/profile` | ✅ Completo | `profile-desktop.tsx` | `profile-mobile.tsx` |
| `/tenant/kyc` | ✅ Completo | `kyc-desktop.tsx` | `kyc-mobile.tsx` |

### Flujo de contrato (rutas transversales)

| Ruta | Estado | Descripción |
|---|---|---|
| `/contracts/[id]` | ✅ Completo | Clickwrap: visualiza contrato, registra AuditLog, firma |
| `/contracts/[id]/audit` | ❌ **Pendiente** | Página dedicada solo al Audit Trail |
| `/contracts/[id]/download` | ✅ API existe | `app/api/contracts/[id]/download/route.ts` |

---

## 5. API Routes — estado actual

### Implementadas

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/auth/register` | POST | Registro de usuario con Zod validation |
| `/api/properties` | GET | Lista propiedades con filtros (type, district, price, rooms, status) |
| `/api/properties` | POST | Crea propiedad (solo LANDLORD) |
| `/api/properties/[id]` | GET/PATCH/DELETE | CRUD de propiedad individual |
| `/api/contracts/[id]/download` | GET | Descarga PDF/HTML del contrato |

### Pendientes de implementar

```
POST   /api/contracts              → Crear contrato DRAFT (ya existe createDraftContract Server Action)
GET    /api/contracts              → Listar contratos del usuario autenticado
GET    /api/contracts/[id]         → Detalle de contrato (para la vista Clickwrap)
PATCH  /api/contracts/[id]         → Actualizar estado (si se necesita vía API además de Server Actions)

GET    /api/users/[id]             → Perfil público de usuario
PATCH  /api/users/me               → Actualizar perfil del usuario autenticado

POST   /api/kyc                    → Enviar documentos KYC
GET    /api/kyc/[userId]           → Estado KYC del usuario
PATCH  /api/kyc/[userId]           → Aprobar/rechazar KYC (solo ADMIN)

POST   /api/payments               → Registrar pago
GET    /api/payments               → Listar pagos (filtrado por contrato/usuario)
PATCH  /api/payments/[id]          → Actualizar estado de pago

GET    /api/notifications          → Notificaciones del usuario autenticado
PATCH  /api/notifications/[id]/read → Marcar como leída
DELETE /api/notifications/[id]     → Eliminar notificación

POST   /api/reviews                → Crear reseña
GET    /api/reviews?propertyId=... → Reseñas de una propiedad

POST   /api/favorites              → Agregar/quitar favorito (toggle)
GET    /api/favorites              → Favoritos del usuario autenticado

GET    /api/audit/[contractId]     → Audit Trail completo de un contrato (solo partes + admin)

POST   /api/upload/property-images → Subir imágenes de propiedad (requiere storage: Cloudinary/S3/R2)
POST   /api/upload/kyc-docs        → Subir documentos KYC
```

---

## 6. Server Actions — estado actual

Archivo: `app/actions/contract-actions.ts`

| Acción | Estado | Descripción |
|---|---|---|
| `createDraftContract` | ✅ Implementada | Crea contrato DRAFT + genera hash SHA-256 |
| `recordContractView` | ✅ Implementada | Registra en AuditLog que el usuario vio el contrato (Clickwrap) |
| `signContractAsTenant` | ✅ Implementada | Firma el contrato como TENANT, cambia estado a PENDING_LANDLORD |
| `counterSignAsLandlord` | ✅ Implementada | Contrafirma como LANDLORD con OCC, activa contrato, marca propiedad OCUPADA |

### Pendientes

```
createPayment(contractId, amount, dueDate)        → Generar cuotas del contrato
markPaymentAsPaid(paymentId, receiptUrl)          → Marcar pago como PAGADO
breachContract(contractId, reason)               → Rescindir contrato (BREACHED_CANCELLED)
finishContract(contractId)                        → Finalizar contrato natural (FINISHED)
requestKYCReview(userId)                          → Enviar KYC a revisión
approveKYC(userId, notes)                         → Admin aprueba KYC
rejectKYC(userId, reason)                         → Admin rechaza KYC
toggleFavorite(propertyId)                        → Agregar/quitar favorito
createReview(propertyId, targetId, rating, comment) → Crear reseña post-contrato
```

---

## 7. Motor LegalTech — lo que ya está construido

Este es el núcleo del proyecto. Está completamente funcional.

### Flujo de firma de contrato

```
DRAFT
  ↓ (landlord crea con createDraftContract)
PENDING_TENANT
  ↓ (tenant visualiza → recordContractView)
  ↓ (tenant firma → signContractAsTenant)
PENDING_LANDLORD
  ↓ (landlord contrafirma → counterSignAsLandlord)
  ↓ (OCC: propiedad → OCUPADA, version++)
ACTIVE
  ↓ (vencimiento natural)
FINISHED
  o
  ↓ (incumplimiento: 2 meses impago → Ley 30933)
BREACHED_CANCELLED
```

### Leyes implementadas
- **Ley 27269** — Firmas y Certificados Digitales (firmas digitales válidas)
- **Ley 30201** — Allanamiento Futuro (cláusula en el contrato generado)
- **Ley 30933** — Desalojo Notarial Exprés (cláusula de 2 meses impago)
- **Ley 29733** — Protección de Datos Personales (cláusula LOPD + DNI encriptado)

### Archivo de contrato generado
`lib/services/contract-engine.ts` produce un HTML completo con:
- Datos de partes (landlord + tenant con DNI)
- Cláusulas legales obligatorias
- Bloque de firmas
- Hash SHA-256 del documento en el footer

### Audit Trail (modelo `AuditLog`)
- Registro **inmutable** (solo INSERT, nunca UPDATE/DELETE)
- Campos: `contractId`, `userId`, `action` (VIEWED / SIGNED_TENANT / COUNTERSIGNED_LANDLORD), `ipAddress`, `userAgent`, `cryptoHash`, `timestamp`
- El `cryptoHash` es el SHA-256 del HTML exacto que vio el usuario al firmar

---

## 8. Bugs y desincronizaciones conocidas

### Críticos (rompen funcionalidad real)

**1. Mismatch en PaymentStatus**
El schema define: `PAGADO | PENDIENTE | EN_PROCESO | VENCIDO`
El código de `landlord/dashboard/page.tsx` usa: `'PENDING' | 'OVERDUE'`
→ Las queries a DB devuelven 0 resultados. Corregir a `'PENDIENTE' | 'VENCIDO'`.

**2. Campo `kycStatus` no existe en User**
`landlord/dashboard/page.tsx` hace `prisma.user.findMany({ where: { kycStatus: 'PENDING' } })`.
El modelo `User` no tiene ese campo. KYC está en el modelo `KYCVerification` con relación 1:1.
→ Cambiar la query para hacer join:
```ts
prisma.user.findMany({
  where: { kycVerification: { status: 'PENDIENTE' } },
  include: { kycVerification: true }
})
```

**3. Relación `contracts` incorrecta en User**
El schema define `contractsAsTenant` y `contractsAsLandlord`, no `contracts`.
Revisar cualquier query que use `user.contracts.*`.

**4. Tenant dashboard con datos mock**
`tenant/dashboard/dashboard-desktop.tsx` y `dashboard-mobile.tsx` tienen datos hardcodeados.
`tenant/dashboard/page.tsx` no pasa datos reales. Necesita la misma estructura que admin/landlord.

### No críticos (UX issues)

**5. `Property.amenities` y `Property.images` son `Json?`**
Se tratan como `string[]` en toda la UI. Agregar cast explícito en todas las queries:
```ts
amenities: property.amenities as string[] ?? []
images: property.images as string[] ?? []
```

**6. `publicar/page.tsx` no tiene formulario real**
La ruta `publish-client.tsx` es una landing page de marketing. No hay formulario para publicar
una propiedad. El botón "Publicar propiedad" redirige a `/register`, no a un formulario.

**7. Botones OAuth sin backend**
Los botones de Google y Facebook en login/register llaman `signIn('google')` / `signIn('facebook')`
pero el proveedor no está configurado en `lib/auth.ts`. Deben ocultarse o implementarse.

---

## 9. Vistas y funcionalidades pendientes — detalle

### 9.1 Formulario de publicación de propiedad
**Ruta:** `/[locale]/publicar/formulario` (o `/landlord/properties/new`)

Multi-step form con:
1. **Tipo y condición** — HABITACION / DEPARTAMENTO / CASA / OFICINA / LOCAL + SIN_MUEBLES / SEMI_AMOBLADO / AMOBLADO
2. **Ubicación** — distrito, dirección (mapa opcional)
3. **Características** — habitaciones, baños, área, estacionamientos, duración mínima, disponibilidad
4. **Amenities** — lista de checkboxes (WiFi, agua caliente, seguridad, etc.)
5. **Fotos** — upload de imágenes (mín. 1, máx. 10)
6. **Precio** — precio mensual, depósito (N meses), perfil de inquilino ideal
7. **Revisión** — preview y confirmación

Conecta con `POST /api/properties`.

### 9.2 Vista y firma de contrato (Clickwrap)
**Ruta:** `/contracts/[id]`

Esta es la pantalla más crítica del Motor LegalTech:
1. El server component hace `GET /api/contracts/[id]` — verifica que el usuario es parte del contrato
2. Llama `recordContractView(contractId)` al cargar para registrar el AuditLog de VIEWED
3. Muestra el HTML del contrato generado por `generatePeruvianLeaseAgreement`
4. Botón "He leído y acepto" — llama `signContractAsTenant(contractId)` o `counterSignAsLandlord(contractId)` según el rol
5. Muestra estado del contrato (quién firmó, quién falta)
6. Si ACTIVE: muestra botón de descarga del contrato

### 9.3 Panel del arrendador — rutas faltantes

**`/landlord/properties`** — Lista de propiedades del arrendador con acciones:
- Ver detalle, editar, archivar
- Status (DISPONIBLE / OCUPADA / MANTENIMIENTO)
- CTA para publicar nueva

**`/landlord/contracts`** — Contratos del arrendador:
- Lista con filtro por estado (DRAFT / PENDING_TENANT / PENDING_LANDLORD / ACTIVE / FINISHED)
- Crear nuevo contrato: seleccionar propiedad + buscar inquilino por email
- Ver estado de firma de cada parte
- Botón "Contrafirmar" cuando esté en PENDING_LANDLORD

**`/landlord/payments`** — Gestión de pagos:
- Calendario de vencimientos del mes
- Semáforo de pagos por inquilino (usa `PaymentTrafficLight` que ya existe)
- Marcar pago como recibido
- Historial mensual

**`/landlord/tenants`** — Gestión de inquilinos:
- Lista de inquilinos activos
- Estado KYC de cada inquilino (usa `KYCReviewCard` que ya existe)
- Historial de contratos por inquilino

### 9.4 Panel del inquilino — rutas faltantes

**`/tenant/contract`** — Mi contrato activo:
- Detalles del contrato vigente
- Próximos vencimientos de pago
- Botón "Firmar" si está en PENDING_TENANT
- Link para ver AuditTrail
- Descarga del contrato

**`/tenant/payments`** — Historial de pagos:
- Lista de todos los pagos (PAGADO / PENDIENTE / VENCIDO)
- Subir comprobante de pago

**`/tenant/favorites`** — Propiedades guardadas:
- Grid de propiedades favoritas
- Quitar de favoritos
- Link a detalle

**`/tenant/kyc`** — Verificación de identidad:
- Estado actual del KYC
- Formulario para subir: DNI (frente y dorso), selfie, certificado de antecedentes
- Estados: PENDIENTE → EN_REVISION → APROBADO / RECHAZADO

### 9.5 Admin — rutas avanzadas

**`/admin/kyc`** — Revisión de KYC pendientes:
- Lista de usuarios en estado EN_REVISION
- Ver documentos subidos
- Botones Aprobar / Rechazar con nota
- Usa `KYCReviewCard` que ya existe en `components/landlord/`

**`/admin/audit`** — Audit Trail global:
- Lista de todos los AuditLog filtrable por action, contrato, usuario, fecha
- Exportar a CSV

### 9.6 Notificaciones
El modelo `Notification` existe. Falta todo:
- Bell icon con badge en el header (ya hay un placeholder en `admin-navbar`)
- Dropdown de notificaciones
- Página `/notifications` para el historial
- Lógica de creación de notificaciones (se deben crear en los Server Actions: al firmar, al aprobar KYC, al vencer un pago, etc.)

---

## 10. Integraciones externas pendientes

### Storage de imágenes
Las propiedades y el KYC necesitan subir archivos. Opciones:
- **Cloudflare R2** (recomendado para costo) + `@aws-sdk/client-s3`
- **Cloudinary** (más fácil, tiene transforms de imagen)
- **Vercel Blob** (si se despliega en Vercel)

Las imágenes se guardan como URLs en `Property.images (Json)` y `KYCVerification.dniDocument`.

### Email
Para notificaciones transaccionales (confirmación de registro, contrato firmado, pago vencido):
- **Resend** + `react-email` (recomendado)
- Templates necesarios: bienvenida, contrato enviado, contrato firmado, pago próximo a vencer, KYC aprobado/rechazado

### Pagos
El contract engine ya define los proveedores: `Niubiz | Culqi | Izipay | BCP | Interbank | BBVA`.
Para MVP: registro manual de pagos (el inquilino sube el comprobante).
Para producción: integración con Culqi o Niubiz (pasarelas peruanas).

### WhatsApp
El `property-detail-desktop.tsx` tiene un botón "Contactar por WhatsApp".
Implementar como `href="https://wa.me/51${phone}?text=..."` en el landlord.

---

## 11. Internacionalización (i18n)

**Locales soportados:** `es | en | pt | fr | de | it | ja | ko | zh`
**Default:** `es`

El middleware redirige automáticamente `/` → `/es/`.
Las rutas `/admin`, `/landlord`, `/tenant` NO pasan por el middleware de locale (están excluidas).

### Archivos de traducción
**Ubicación esperada:** `lib/i18n.ts` + archivos de mensajes (revisar implementación actual).

Las claves usadas en las vistas siguen el patrón `namespace.key`:
- `register.title`, `register.welcome`, `register.role`, `register.tenant`, `register.landlord`, etc.
- `publish.hero.badge`, `publish.hero.title`, `publish.features.kyc.title`, etc.
- `home.*` para la página principal

Verificar que todos los namespaces tengan traducciones completas en los 9 idiomas.

---

## 12. Autenticación y autorización

### Roles definidos

| Rol | Acceso |
|---|---|
| `ADMIN` | Todo el panel `/admin/*`, puede ver y gestionar todo |
| `LANDLORD` | Panel `/landlord/*`, solo sus propiedades y contratos |
| `TENANT` | Panel `/tenant/*`, solo sus contratos y favoritos |

### Guards pendientes de implementar
El middleware actual solo maneja i18n. Falta agregar protección de rutas por rol:
```
/admin/*     → solo ADMIN
/landlord/*  → solo LANDLORD
/tenant/*    → solo TENANT
```

Actualmente solo el `tenant/dashboard/page.tsx` tiene `if (!session || session.user.role !== "TENANT") redirect("/login")`.
Replicar para todas las rutas protegidas, idealmente en el middleware.

### JWT extendido
`types/next-auth.d.ts` extiende la sesión con `id` y `role`.
Asegurarse de que todas las páginas que necesitan el rol lo lean de `session.user.role` y no de la DB.

---

## 13. Consideraciones importantes para el desarrollo futuro

### OCC (Optimistic Concurrency Control)
`counterSignAsLandlord` implementa OCC con el campo `Property.version`.
Si dos arrendadores intentan activar un contrato sobre la misma propiedad simultáneamente,
el segundo recibe `ContractConcurrencyError`. La UI debe manejar este error mostrando
un mensaje claro: "La propiedad ya fue arrendada. Actualice la página."

### AuditLog es inmutable
Nunca hacer UPDATE o DELETE sobre `AuditLog`. Solo INSERT.
Es la prueba legal del Clickwrap Agreement.

### Decimales en precios
`Property.price`, `Contract.monthlyRent`, `Contract.deposit`, `Payment.amount` son `Decimal` en Prisma.
Al pasar a componentes cliente, siempre convertir: `Number(property.price)`.
Nunca pasar un `Decimal` directamente a un componente `'use client'` (no es serializable).

### Fechas y timezone
El servidor opera en UTC. La presentación al usuario debe ser UTC-5 (Lima).
Usar `Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima" })` para formatear fechas en la UI.
El `contract-engine.ts` ya hace esto con `formatDateLima`.

### Paginación
Ninguna lista tiene paginación actualmente. Al conectar datos reales, agregar:
- `take` / `skip` en las queries de Prisma
- Cursor-based pagination para listas muy largas (AuditLog, payments)

### Imágenes de propiedad
`Property.images` es `Json?`. En las vistas se usa como `string[]`.
Al guardar: `JSON.stringify(urls)`.
Al leer: `Array.isArray(property.images) ? property.images as string[] : []`.

### `publicar` vs `landlord/properties/new`
La ruta `/[locale]/publicar` es la **landing page de marketing** para arrendadores.
El **formulario real** de publicación debería estar en `/landlord/properties/new` (dentro del panel
del arrendador, ya autenticado) para no mezclar flujo de marketing con flujo autenticado.

---

## 14. Checklist de prioridades

### Alta (bloquean el MVP)
- [x] Conectar `tenant/dashboard` a datos reales (no hardcodeados) (hecho)
- [x] Corregir bug de `kycStatus` en `landlord/dashboard/page.tsx` (arreglado)
- [x] Corregir bug de PaymentStatus (`PENDING` → `PENDIENTE`, `OVERDUE` → `VENCIDO`) (arreglado)
- [x] Implementar página de firma de contrato `/contracts/[id]` (Clickwrap) (hecho)
- [x] Implementar `/landlord/contracts` con flujo de creación + firma (hecho)
- [x] Guards de autenticación por rol en middleware (hecho)
- [x] Formulario de publicación de propiedad (`/landlord/properties/new`) (hecho)

### Media (completan el producto)
- [x] `/tenant/contract` — ver y firmar contrato activo (hecho)
- [x] `/tenant/payments` — historial + subir comprobante (hecho)
- [x] `/tenant/kyc` — subir documentos (hecho)
- [x] `/landlord/properties` — CRUD de propiedades (hecho)
- [x] `/landlord/payments` — gestión de pagos con semáforo (hecho)
- [x] `/admin/kyc` — revisión de verificaciones (hecho)
- [x] Notificaciones (modelo DB → bell en header → dropdown) (hecho)
- [x] Storage de imágenes (Cloudflare R2 o Cloudinary) (hecho)

### Baja (mejoras)
- [ ] Email transaccional (Resend)
- [x] Integración WhatsApp en property detail (hecho)
- [ ] OAuth Google/Facebook
- [x] 2FA (campo `twoFactorEnabled` ya existe en User) (hecho)
- [ ] Paginación en todos los listings
- [x] `/admin/audit` — Audit Trail global (hecho)
- [x] Búsqueda avanzada con filtros en `/propiedades` (hecho)
- [x] Reviews reales (post-contrato) (hecho)
- [ ] Pasarela de pagos (Culqi o Niubiz)
