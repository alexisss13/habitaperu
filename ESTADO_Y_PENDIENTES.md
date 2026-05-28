# HabitaPeru — Estado actual y roadmap completo

> Documento de referencia técnica para continuar el desarrollo.
> Actualizado: junio 2026.

---

## 1. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15+ (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Base de datos | PostgreSQL vía Prisma ORM |
| Autenticación | NextAuth v5 (auth.js) + SessionProvider |
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

### Patrón A — rutas sin datos de servidor (login, register)

```
app/[locale]/login/
├── page.tsx              ← 'use client', usa useResponsive, renderiza Mobile o Desktop
├── login-desktop.tsx
└── login-mobile.tsx
```

### Patrón B — rutas con datos de servidor (home, admin/*, landlord, tenant, propiedades)

```
app/admin/dashboard/
├── page.tsx              ← Server Component, hace fetch a DB
├── dashboard-view.tsx    ← 'use client', usa useResponsive → renderiza Mobile o Desktop
├── dashboard-desktop.tsx
└── dashboard-mobile.tsx
```

**Regla:** Los server components (`page.tsx`) nunca importan `useResponsive`. Solo los `*-view.tsx` lo hacen.

---

## 3. Convenciones de estilos (Tailwind v4)

### Regla general: siempre Tailwind, salvo estas excepciones

| Caso | Qué usar |
|---|---|
| Layout, spacing, colores | `className="..."` Tailwind |
| Gradientes de marca y decorativos | `style={{ background: 'linear-gradient(...)' }}` |
| Color de texto sobre gradiente | `style={{ color: '#ffffff' }}` — NUNCA solo Tailwind para esto |
| Valores dinámicos en runtime | `style={{}}` |
| Gradiente text (`-webkit-background-clip`) | `style={{}}` |

> **IMPORTANTE:** El texto blanco sobre botones con gradiente DEBE setearse via `style={{ color: '#ffffff' }}`,
> no via Tailwind `text-white`. El motivo: CSS Cascade Level 5 hace que reglas no-layered (globals.css, browser reset)
> ganen sobre `@layer utilities` de Tailwind. Usar `components/ui/button.tsx` que maneja esto correctamente.

### Offset de contenido en páginas públicas con Header

| Contexto | Valor | Por qué |
|---|---|---|
| Desktop público (`/es`, `/propiedades`, etc.) | `pt-[112px]` | 72px header + ~40px announcement bar |
| Mobile público | `pt-14` (56px) | Solo el header — announcement bar es `hidden md:block` |
| Admin / Landlord / Tenant | Su propio valor | Layouts propios sin el Header global |

### Tokens Tailwind disponibles

```
bg-accent / text-accent / border-accent
bg-accent-secondary / text-accent-secondary  ← color: #EA4227 (naranja-rojo) — usar con cuidado
bg-green / text-green
bg-red / text-red
bg-bg / bg-bg-2 / bg-bg-card / bg-border
text-text / text-text-muted / text-text-dim
bg-admin-bg / bg-admin-sidebar-bg / bg-admin-card-bg
border-admin-border / text-admin-text / text-admin-text-muted
text-admin-accent / text-admin-success / text-admin-warning / text-admin-error
shadow-sm / shadow-base / shadow-lg / shadow-card
```

### Hover — nunca `onMouseEnter/Leave`, siempre Tailwind `hover:`

---

## 4. Componentes UI reutilizables

| Componente | Ruta | Descripción |
|---|---|---|
| `Button` | `components/ui/button.tsx` | Botón con variantes primary/secondary/ghost/danger/success/whatsapp/outline. Maneja color de texto via inline style para garantizar correcta aplicación |
| `Pagination` / `AdminPagination` | `components/ui/pagination.tsx` | Paginación con prop `compact` para mobile |
| `LoadingScreen` | `components/ui/loading-screen.tsx` | Pantalla de carga para orquestadores |
| `NotificationBell` | `components/notification-bell.tsx` | Campanita con badge de notificaciones |

### Uso de Button

```tsx
import { Button } from "@/components/ui/button"

<Button variant="primary" size="md">Guardar</Button>
<Button variant="primary" loading={saving} leftIcon={<Icon size={16} />}>Enviar</Button>
<Button variant="whatsapp" href="https://wa.me/..." external>WhatsApp</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="danger">Eliminar</Button>
<Button variant="primary" fullWidth href="/dashboard">Ir al panel</Button>
```

---

## 5. Estructura de rutas — estado actual

### Rutas públicas / i18n

| Ruta | Estado | Desktop | Mobile |
|---|---|---|---|
| `/[locale]/` (home) | ✅ Completo | `home-client-desktop.tsx` | `home-client-mobile.tsx` |
| `/[locale]/login` | ✅ Completo | `login-desktop.tsx` | `login-mobile.tsx` |
| `/[locale]/register` | ✅ Completo | `register-desktop.tsx` | `register-mobile.tsx` |
| `/[locale]/publicar` | ✅ Landing page | `publish-client.tsx` | `publish-mobile.tsx` |
| `/[locale]/publicar/formulario` | ❌ **Pendiente** | — | — |
| `/[locale]/propiedades` | ✅ Completo | `propiedades-desktop.tsx` | `propiedades-mobile.tsx` |
| `/[locale]/propiedades/[id]` | ✅ Completo | `property-detail-desktop.tsx` | `property-detail-mobile.tsx` |

> Las rutas `/propiedades` y `/propiedades/[id]` existen también en `app/propiedades/` (origen).
> Las versiones con locale en `app/[locale]/propiedades/` son wrappers que importan los mismos views.

### Panel Admin (`/admin/*`)

| Ruta | Estado | Desktop | Mobile |
|---|---|---|---|
| `/admin/dashboard` | ✅ Completo | `dashboard-desktop.tsx` | `dashboard-mobile.tsx` |
| `/admin/users` | ✅ Completo | `users-desktop.tsx` | `users-mobile.tsx` |
| `/admin/contracts` | ✅ Completo | `contracts-desktop.tsx` | `contracts-mobile.tsx` |
| `/admin/payments` | ✅ Completo | `payments-desktop.tsx` | `payments-mobile.tsx` |
| `/admin/properties` | ✅ Completo | `properties-desktop.tsx` | `properties-mobile.tsx` |
| `/admin/settings` | ✅ Completo | `settings-desktop.tsx` | `settings-mobile.tsx` |
| `/admin/kyc` | ✅ Completo | `kyc-desktop.tsx` | `kyc-mobile.tsx` |
| `/admin/audit` | ✅ Completo | `audit-desktop.tsx` | `audit-mobile.tsx` |

### Panel Arrendador (`/landlord/*`)

| Ruta | Estado | Desktop | Mobile |
|---|---|---|---|
| `/landlord/dashboard` | ✅ Completo | `dashboard-desktop.tsx` | `dashboard-mobile.tsx` |
| `/landlord/tenants` | ✅ Completo | `tenants-desktop.tsx` | `tenants-mobile.tsx` |
| `/landlord/contracts` | ✅ Completo | `contracts-desktop.tsx` | `contracts-mobile.tsx` |
| `/landlord/payments` | ✅ Completo | `payments-desktop.tsx` | `payments-mobile.tsx` |
| `/landlord/settings` | ✅ Completo | usa `UserSettingsView` | — |
| `/landlord/properties` | ✅ Completo | `properties-desktop.tsx` | `properties-mobile.tsx` |
| `/landlord/properties/new` | ✅ Completo | multi-step form | responsive |
| `/landlord/properties/[id]/edit` | ✅ Completo | `edit-property-form.tsx` | responsive |
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
| `/tenant/settings` | ✅ Completo | usa `UserSettingsView` | — |

> El panel tenant usa sidebar (desktop) + bottom tabs 5 items (mobile) vía `components/tenant-layout-client.tsx`.

### Flujo de contrato (rutas transversales)

| Ruta | Estado | Descripción |
|---|---|---|
| `/contracts/[id]` | ✅ Completo | Clickwrap: visualiza contrato, registra AuditLog, firma |
| `/contracts/[id]/audit` | ✅ Completo | Página dedicada al Audit Trail con timeline inmutable |
| `/contracts/[id]/download` | ✅ API existe | `app/api/contracts/[id]/download/route.ts` |

---

## 6. API Routes — estado actual

### Implementadas

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/auth/register` | POST | Registro con Zod validation |
| `/api/properties` | GET/POST | Lista y crea propiedades |
| `/api/properties/[id]` | GET/PUT/DELETE | CRUD individual (PUT verifica ownership) |
| `/api/contracts/[id]/download` | GET | Descarga PDF/HTML del contrato |
| `/api/favorites` | GET | Devuelve propiedades por lista de IDs (localStorage) |

### Pendientes

```
POST   /api/contracts              → Crear contrato DRAFT (ya existe Server Action)
GET    /api/users/[id]             → Perfil público de usuario
POST   /api/kyc                    → Enviar documentos KYC
PATCH  /api/kyc/[userId]           → Aprobar/rechazar KYC (admin)
POST   /api/payments               → Registrar pago
PATCH  /api/payments/[id]          → Actualizar estado de pago
POST   /api/reviews                → Crear reseña post-contrato
GET    /api/audit/[contractId]     → Audit Trail completo
POST   /api/upload/kyc-docs        → Subir documentos KYC
```

---

## 7. Server Actions — estado actual

Archivo: `app/actions/contract-actions.ts`

| Acción | Estado |
|---|---|
| `createDraftContract` | ✅ |
| `recordContractView` | ✅ |
| `signContractAsTenant` | ✅ |
| `counterSignAsLandlord` | ✅ (con OCC) |

Archivo: `app/actions/user-actions.ts`

| Acción | Estado |
|---|---|
| `updateProfileAction` | ✅ |
| `checkTwoFactorRequiredAction` | ✅ |

Archivo: `app/actions/upload-actions.ts`

| Acción | Estado |
|---|---|
| `uploadImageAction` | ✅ (Cloudinary / mock) |

### Pendientes

```
createPayment(contractId, amount, dueDate)
markPaymentAsPaid(paymentId, receiptUrl)
breachContract(contractId, reason)
finishContract(contractId)
requestKYCReview(userId)
approveKYC(userId, notes)
rejectKYC(userId, reason)
createReview(propertyId, targetId, rating, comment)
```

---

## 8. Motor LegalTech — flujo implementado

```
DRAFT
  ↓ (landlord crea con createDraftContract)
PENDING_TENANT
  ↓ (tenant visualiza → recordContractView)
  ↓ (tenant firma → signContractAsTenant)
PENDING_LANDLORD
  ↓ (landlord contrafirma → counterSignAsLandlord + OCC)
  ↓ (propiedad → OCUPADA, version++)
ACTIVE
  ↓ (vencimiento natural)
FINISHED
  o
  ↓ (incumplimiento: 2 meses impago → Ley 30933)
BREACHED_CANCELLED
```

**Leyes implementadas en el contrato generado:**
- Ley 27269 — Firmas Digitales
- Ley 30201 — Allanamiento Futuro
- Ley 30933 — Desalojo Notarial Exprés
- Ley 29733 — Protección de Datos

**AuditLog:** Inmutable (solo INSERT). Campos: contractId, userId, action, ipAddress, userAgent, cryptoHash, timestamp.

---

## 9. Autenticación y sesión

- **JWT extendido:** campos `id`, `role`, `hasActiveContract`
- `hasActiveContract` se calcula al hacer login (query a DB una sola vez, queda en el token)
- `SessionProvider` configurado en `app/layout.tsx` vía `components/auth-provider.tsx`
- El `Header` público usa `useSession()` para mostrar UI personalizada según rol:
  - TENANT con contrato activo → botón **"Gestiona tu habitación"**
  - TENANT sin contrato → link "Buscar habitación"
  - LANDLORD → "Mis propiedades"
  - No logueado → "Publicar propiedad" + menú Login/Register
- OAuth (Google/Facebook): **desactivado** — botones reemplazados por "Próximamente"
- Login de TENANT redirige a `/${locale}` (home), no al dashboard

---

## 10. Bugs conocidos y resueltos

### Resueltos en esta sesión
- ✅ `img { width: 100%; object-fit: cover; }` en globals.css rompía todos los iconos/banderas — ahora solo `img { display: block; }`
- ✅ Botones con gradiente sin `text-white` visible — solucionado con `Button` component + inline styles
- ✅ `LocationPin01Icon`, `SearchIcon`, `Phone01Icon`, `Edit01Icon`, `BedDoubleIcon` no existen en hugeicons — reemplazados
- ✅ `/es/propiedades` daba 404 — creadas rutas locale en `app/[locale]/propiedades/`
- ✅ Offset incorrecto en páginas públicas (`pt-[72px]`) — corregido a `pt-[112px]` para desktop
- ✅ Filtro de propiedades solo aceptaba distritos exactos de Lima — cambiado a texto libre con búsqueda parcial
- ✅ Clicks en "Explora por ubicación" no aplicaban el filtro — ahora se pasan via `searchParams` del server

### Bugs aún abiertos
- ⚠️ `PaymentStatus` inconsistente en algunos archivos legacy (`PENDING`/`OVERDUE` vs `PENDIENTE`/`VENCIDO`)
- ⚠️ `Property.amenities` y `Property.images` son `Json?` — siempre castear a `string[]` al leer

---

## 11. Integraciones externas pendientes

| Integración | Estado | Notas |
|---|---|---|
| Storage de imágenes (Cloudinary/R2) | ⚠️ Mock | `uploadImageAction` usa mock si no hay config |
| Email transaccional (Resend) | ❌ Pendiente | Templates: bienvenida, contrato enviado/firmado, pago vencido |
| OAuth Google / Facebook | ❌ Pendiente | Proveedores no configurados en `lib/auth.ts` |
| Pasarela de pagos (Culqi / Niubiz) | ❌ Pendiente | MVP usa registro manual de pagos |

---

## 12. Consideraciones importantes

### Decimales
`Property.price`, `Contract.monthlyRent`, `Payment.amount` son `Decimal` en Prisma.
**Siempre** convertir: `Number(property.price)` antes de pasar a componentes cliente.

### Fechas
Almacenar en UTC, presentar en `America/Lima` (UTC-5):
```ts
new Date(iso).toLocaleDateString("es-PE", { timeZone: "America/Lima" })
```

### OCC en contratos
`counterSignAsLandlord` verifica `Property.version` antes de escribir. Si falla, mostrar:
"La propiedad ya fue arrendada. Actualice la página."

### AuditLog — nunca UPDATE ni DELETE
Es evidencia legal del Clickwrap. Solo INSERT.

### Iconos confirmados en hugeicons-react
Los siguientes NO existen: `LocationPin01Icon`, `SearchIcon` (usar `Search01Icon`), `Phone01Icon` (usar `SmartPhone02Icon`), `Edit01Icon`, `BedDoubleIcon` (usar `BedIcon`), `SlidersHorizontalIcon` (usar `FilterIcon`), `Home07Icon`, `Dashboard01Icon`.

---

## 13. Checklist de prioridades

### Alta — completadas ✅
- [x] Motor LegalTech: createDraftContract, sign, counterSign + OCC
- [x] Página Clickwrap `/contracts/[id]`
- [x] Guards de autenticación por rol en middleware
- [x] Formulario de publicación `/landlord/properties/new`
- [x] Formulario de edición `/landlord/properties/[id]/edit` ← **nuevo**
- [x] Panel inquilino rediseñado (sidebar + bottom tabs)
- [x] Header público auth-aware con "Gestiona tu habitación"
- [x] Rutas `/es/propiedades` y `/es/propiedades/[id]` funcionales
- [x] Filtro de propiedades por texto libre (no solo distritos de Lima)
- [x] `Button` component reutilizable con colores garantizados
- [x] KYC admin (`/admin/kyc`) implementado
- [x] Audit Trail admin (`/admin/audit`) implementado

### Media — completadas ✅
- [x] `/tenant/contract`, `/tenant/payments`, `/tenant/kyc`, `/tenant/favorites`, `/tenant/profile`
- [x] `/landlord/properties`, `/landlord/tenants`, `/landlord/payments`, `/landlord/contracts`
- [x] Notificaciones (modelo DB → bell → dropdown)
- [x] Storage de imágenes (mock funcional, Cloudinary configurable)
- [x] 2FA con TOTP

### Pendientes reales
- [x] `/contracts/[id]/audit` — página dedicada al Audit Trail (hecho)
- [x] `/[locale]/publicar/formulario` — página con lógica de auth: LANDLORD → form, TENANT → aviso, no auth → register (hecho)
- [x] Email transaccional (Resend) — welcome, contrato enviado/firmado/activo, KYC aprobado/rechazado (hecho — requiere `RESEND_API_KEY` en .env)
- [x] OAuth Google / Facebook — proveedores configurados en `lib/auth.ts`, activos si `GOOGLE_CLIENT_ID` / `FACEBOOK_CLIENT_ID` están en .env (hecho)
- [ ] Pasarela de pagos (Culqi o Niubiz) — requiere cuenta y credenciales de Culqi
- [x] Paginación en listings de admin y landlord (ya estaba implementada)
