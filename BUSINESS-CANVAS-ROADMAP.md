# Habita Perú — Roadmap del Business Model Canvas
> Análisis técnico + opinión de flujo de negocio por cada componente pendiente.

---

## Índice
1. [Fuentes de Ingreso](#1-fuentes-de-ingreso)
2. [Relación con Clientes](#2-relación-con-clientes)
3. [Canales](#3-canales)
4. [Socios Clave](#4-socios-clave)
5. [Opinión general del flujo de negocio](#5-opinión-general-del-flujo-de-negocio)

---

## 1. Fuentes de Ingreso

### 1.1 — Planes de Suscripción / Membresía para Arrendadores

#### ¿Cómo se trabajará?
Se creará un sistema de planes con tres niveles:

| Plan | Propiedades | Precio | Beneficios |
|---|---|---|---|
| **Gratis** | 1 propiedad | S/ 0 | Contrato básico, KYC básico |
| **Pro** | Hasta 5 propiedades | S/ 49/mes | Contratos ilimitados, analytics, soporte prioritario |
| **Business** | Ilimitadas | S/ 129/mes | Todo Pro + anuncios destacados incluidos, API access |

**Flujo técnico:**
```
Landlord se registra
  → Inicia en plan Gratis (sin tarjeta requerida)
  → Al intentar agregar la 2ª propiedad → modal de upgrade
  → Selecciona plan → pago con Culqi (tarjeta/Yape/Plin)
  → Webhook de Culqi confirma pago
  → DB actualiza user.subscriptionPlan + subscriptionEndsAt
  → Cron job diario revisa vencimientos y degrada/notifica
```

**Tablas DB necesarias:**
- `SubscriptionPlan` (enum: FREE, PRO, BUSINESS)
- `Payment` ya existe → añadir campo `type: SUBSCRIPTION | RENT | FEATURED`
- `user.subscriptionPlan`, `user.subscriptionEndsAt`

#### ¿Es correcto este flujo?
⚠️ **Observación importante:** El canvas dice "planes para quienes gestionan múltiples habitaciones o edificios". En Perú, la mayoría de arrendadores tienen 1 o 2 cuartos. Si el plan gratis solo permite 1 propiedad, la conversión a pago será muy baja al inicio.

**Recomendación:** Empezar con gratis ilimitado los primeros 6 meses (growth hacking), luego introducir el límite cuando ya haya base de usuarios. El umbral correcto para cobrar debería ser a partir de 3 propiedades, no 2.

---

### 1.2 — Anuncios Destacados (Featured Listings)

#### ¿Cómo se trabajará?
Los arrendadores podrán pagar para que su propiedad aparezca en los primeros resultados de búsqueda con una etiqueta "Destacado".

**Flujo:**
```
Landlord entra a su propiedad
  → Botón "Destacar propiedad" → modal de duración
  → Elige: 7 días (S/15), 15 días (S/25), 30 días (S/45)
  → Pago con Culqi
  → DB: property.featuredUntil = Date.now() + duración
  → Query de búsqueda ordena: ORDER BY featuredUntil DESC NULLS LAST, createdAt DESC
  → Frontend muestra badge "Destacado" en tarjeta
  → Cron job diario limpia propiedades cuyo featuredUntil expiró
```

**Tablas DB necesarias:**
- `property.featuredUntil DateTime?`
- `property.featuredPaidAt DateTime?`

#### ¿Es correcto este flujo?
✅ **Flujo correcto y probado en el mercado.** Airbnb, Mercado Libre, OLX usan exactamente este modelo. Es la fuente de ingreso más rápida de implementar y la que genera conversión más inmediata porque el landlord ve el beneficio directo (más visitas a su propiedad).

**Recomendación:** Implementar esto PRIMERO antes que las suscripciones. Menor fricción, pago único sin compromiso mensual.

---

### 1.3 — Venta de Contratos (Descarga en PDF)

#### ¿Cómo se trabajará?
Actualmente el contrato se genera en HTML y se visualiza en el browser. Se añadirá descarga en PDF como feature premium.

**Flujo:**
```
Ambas partes firman el contrato digitalmente
  → Estado pasa a ACTIVE
  → Botón "Descargar PDF" aparece en la vista del contrato
  → Si landlord es plan Gratis → modal de pago único (S/ 9.90)
  → Si landlord es plan Pro/Business → descarga directa sin costo adicional
  → Backend genera PDF con Puppeteer o react-pdf
  → PDF incluye: hash SHA-256, timestamps de firma, QR de verificación
  → Se guarda en Cloudinary/S3 y se envía por email a ambas partes
```

**Dependencias técnicas:**
- `@react-pdf/renderer` o Puppeteer para generación
- Cloudinary/S3 para almacenamiento
- Endpoint API: `GET /api/contracts/[id]/download`
  *(este endpoint ya existe en el codebase: `app/api/contracts/[id]/download/route.ts`)*

#### ¿Es correcto este flujo?
⚠️ **Flujo parcialmente correcto, pero con un problema de percepción.** Si el contrato ya se puede leer en pantalla y ambas partes ya firmaron, cobrar por descargarlo puede generar fricción y sensación de abuso. Los usuarios en Perú son sensibles a "cobros inesperados" post-firma.

**Recomendación:** No cobrar el PDF individualmente. En su lugar, incluirlo como diferenciador del plan Pro ("contratos con descarga PDF + QR de verificación legal"). El PDF se convierte en argumento de venta del plan, no en cobro aislado.

---

### 1.4 — Comisiones por Servicios (Mudanza, Limpieza, Mantenimiento)

#### ¿Cómo se trabajará?
Marketplace de servicios complementarios al alquiler. Proveedores verificados ofrecen servicios; Habita Perú cobra comisión por cada contratación.

**Flujo:**
```
Tenant firma contrato activo
  → Dashboard muestra sección "Servicios para tu mudanza"
  → Listado de proveedores verificados por categoría
  → Tenant contacta/contrata proveedor desde la plataforma
  → Pago procesado por Culqi (Habita retiene 10-15% de comisión)
  → Proveedor recibe pago neto + notificación
  → Tenant puede dejar reseña del servicio
```

**Modelo de comisión:**
- Mudanza: 12% sobre precio del servicio
- Limpieza: 15% (ticket pequeño, más frecuente)
- Mantenimiento: 10%

**Tablas DB necesarias:**
- `ServiceProvider` (nombre, categoría, teléfono, precio base, rating)
- `ServiceBooking` (tenantId, providerId, precio, comisión, estado)
- `ServiceCategory` (enum: MUDANZA, LIMPIEZA, MANTENIMIENTO, INTERNET)

#### ¿Es correcto este flujo?
❌ **No es conveniente implementarlo en esta etapa.** Este es un negocio dentro de otro negocio. Requiere:
- Conseguir proveedores verificados (operación offline)
- Sistema de calificaciones propio
- Resolución de disputas entre usuarios y proveedores
- Capital operativo para garantías

**Recomendación:** Posponer para la versión 2.0 cuando la plataforma ya tenga tracción. En su lugar, iniciar con una versión simple: mostrar directorio de proveedores recomendados con link externo (WhatsApp del proveedor), sin sistema de pago integrado. Genera goodwill sin la complejidad operativa.

---

### 1.5 — Publicidad Especializada (Muebles, Seguros, Internet)

#### ¿Cómo se trabajará?
Banners y espacios publicitarios dentro del dashboard del tenant, orientados a empresas relacionadas con el hogar.

**Flujo:**
```
Empresa anunciante contacta a Habita Perú (proceso offline)
  → Acuerdo de CPM (costo por mil impresiones) o CPC (clic)
  → Admin sube creativo + URL destino desde panel admin
  → Sistema muestra ad en slots definidos del dashboard
  → Analytics de impresiones/clics exportable para el anunciante
```

**Slots sugeridos:**
- Banner lateral en dashboard del tenant (después de firmar contrato)
- Email transaccional: footer de emails con "Servicios recomendados"
- Página de confirmación de contrato activo

#### ¿Es correcto este flujo?
⚠️ **Viable a largo plazo, prematuro ahora.** Para que los anunciantes paguen CPM/CPC necesitas tráfico demostrable (mínimo 50,000 visitas/mes). Con una plataforma nueva, ninguna empresa de muebles o seguros pagará por publicidad sin data de audiencia.

**Recomendación:** Comenzar con "acuerdos de intercambio": descuentos exclusivos de empresas aliadas para los tenants de Habita (partnership, no cobro). Genera valor percibido al usuario sin requerir tráfico masivo. Convertir a publicidad paga cuando tengas las métricas.

---

## 2. Relación con Clientes

### 2.1 — Sistema de Reseñas Verificadas

#### ¿Cómo se trabajará?
Solo usuarios con contratos ACTIVE o FINISHED podrán dejar reseñas. Elimina reviews falsos.

**Flujo:**
```
Contrato pasa a estado FINISHED (o después de 30 días en ACTIVE)
  → Notificación automática a tenant: "¿Cómo fue tu experiencia?"
  → Tenant califica: propiedad (1-5 estrellas) + texto
  → Landlord califica: tenant (puntualidad de pago, cuidado del inmueble)
  → Reviews se publican después de 48h (ambas partes pueden responder)
  → Rating promedio aparece en:
      - Perfil público de la propiedad
      - Perfil del landlord
      - Perfil del tenant (visible solo para landlords)
```

**Tablas DB necesarias:**
- `Review` ya existe en el schema → revisar si tiene los campos completos
- `tenantRating` en perfil de usuario para landlords que evalúan tenants

#### ¿Es correcto este flujo?
✅ **Flujo correcto y crítico para el negocio.** La "Comunidad confiable con reseñas reales" es un diferenciador clave del canvas. Sin reviews verificados, Habita Perú es indistinguible de OLX o Facebook Marketplace.

**Recomendación:** Implementar junto con los anuncios destacados (prioridad media-alta). El rating de propiedades debería impactar directamente en el algoritmo de búsqueda.

---

### 2.2 — Chat Interno Landlord ↔ Tenant

#### ¿Cómo se trabajará?
Mensajería interna para coordinar visitas y resolver dudas antes y durante el contrato.

**Flujo:**
```
Tenant encuentra propiedad → botón "Consultar al arrendador"
  → Se abre hilo de chat vinculado a la propiedad
  → Mensajes en tiempo real (WebSocket con Pusher o Ably)
  → Notificación push/email cuando hay mensaje nuevo
  → Chat se archiva automáticamente si el contrato termina
  → Landlord puede bloquear usuarios
```

**Stack técnico:**
- Pusher / Ably para WebSockets (más simple que implementar propio)
- `Message` model en DB (senderId, receiverId, propertyId, content, readAt)

#### ¿Es correcto este flujo?
⚠️ **Correcto en concepto, pero evaluar si es necesario en etapa temprana.** WhatsApp es omnipresente en Perú y la mayoría de coordinaciones ya ocurren ahí. Un chat interno solo agrega valor si tiene funciones que WhatsApp no tiene (como mostrar el historial de mensajes vinculado al contrato para efectos legales).

**Recomendación:** Versión 1.0: botón "Contactar por WhatsApp" que abre wa.me con mensaje predefinido. Versión 2.0: chat interno propio con historial legal. Esto ahorra 3-4 semanas de desarrollo en esta etapa.

---

### 2.3 — Soporte Técnico / Asesoría Legal Automatizada

#### ¿Cómo se trabajará?
Widget de soporte con FAQ inteligente + escalado a humano.

**Flujo:**
```
Usuario hace clic en ícono de soporte
  → Chatbot responde preguntas frecuentes (FAQ estático con búsqueda)
  → Si no resuelve → formulario de ticket (email a soporte@habitaperu.com)
  → SLA: respuesta en 24h laborables
  → Para preguntas legales: link a recursos PDF (Ley 30201, Ley 30933)
```

**Implementación simple:** Crisp.chat o Tawk.to (gratuitos), se integran en 1 día.

#### ¿Es correcto este flujo?
✅ **Correcto. No construir chatbot propio en esta etapa.** Usar herramienta externa es la decisión correcta para un MVP. Construir un chatbot de IA legal requiere entrenamiento con jurisprudencia peruana, validación legal, y mantenimiento continuo — demasiado costo para el valor que agrega ahora.

---

## 3. Canales

### 3.1 — Integración WhatsApp Business

#### ¿Cómo se trabajará?
Notificaciones clave enviadas por WhatsApp además de email.

**Flujo:**
```
Evento ocurre en plataforma (contrato enviado, pago registrado, firma pendiente)
  → Backend llama a WhatsApp Business API (Meta Cloud API)
  → Mensaje de template aprobado enviado al número del usuario
  → Usuario puede responder "1" para confirmar o hacer preguntas básicas
```

**Mensajes clave:**
- "Tienes un contrato pendiente de firma. Ver aquí: [link]"
- "Tu pago de alquiler de [mes] fue registrado ✓"
- "El inquilino firmó el contrato. Tu contrafirma activa el contrato."

**Costo:** Meta Cloud API — primeras 1,000 conversaciones/mes gratis, luego ~$0.04/conversación.

#### ¿Es correcto este flujo?
✅ **Muy correcto y alta prioridad para Perú.** La tasa de apertura de WhatsApp es 98% vs 20% del email. Para un mercado como Perú donde WhatsApp es el canal principal de comunicación, esto no es opcional, es casi obligatorio para buena experiencia de usuario.

**Recomendación:** Implementar antes del sistema de suscripciones. ROI inmediato en retención de usuarios.

---

### 3.2 — Social Sharing de Propiedades

#### ¿Cómo se trabajará?
Botones para compartir propiedades en redes sociales + Open Graph para preview rico.

**Flujo:**
```
Landlord publica propiedad
  → Página de detalle tiene meta tags OG (título, imagen, precio, distrito)
  → Botones: "Compartir en Facebook", "Compartir en WhatsApp", copiar link
  → Al compartir en grupos de Facebook → preview con imagen y precio
  → UTM params en links para rastrear conversiones por canal
```

**Implementación técnica:** Solo meta tags OG en `layout.tsx` de cada propiedad + botones de share nativos (Web Share API). 1-2 días de trabajo.

#### ¿Es correcto este flujo?
✅ **Correcto y fácil de implementar.** El canvas menciona grupos de Facebook e Instagram como canal de captación. El OG correcto hace que cada propiedad compartida sea en sí misma un anuncio gratuito en redes sociales.

---

## 4. Socios Clave

### 4.1 — Integración Real de Pagos (Culqi / Niubiz / Izipay)

#### ¿Cómo se trabajará?
Actualmente los pagos de arrendamiento se registran manualmente. Se integrará Culqi para pagos reales dentro de la plataforma.

**Flujo de pago de arrendamiento:**
```
Tenant entra a su dashboard de pagos
  → Ve cuota del mes con estado PENDIENTE
  → Botón "Pagar ahora" → modal de pago
  → Ingresa tarjeta / elige Yape o Plin (Culqi lo soporta)
  → Culqi tokeniza la tarjeta (nunca pasa por nuestros servidores)
  → Backend recibe token → llama a Culqi API para cobrar
  → Culqi confirma → webhook actualiza Payment.status = PAID
  → Email + WhatsApp de confirmación a landlord y tenant
```

**Flujo de pago de suscripción/featured:**
```
(Mismo flujo, diferente concepto de pago)
  → Culqi Subscriptions API para pagos recurrentes
```

**Credenciales necesarias:**
- Culqi API Key (modo test ya disponible en culqi.com)
- Webhook secret para validar eventos
- Variables de entorno: CULQI_PUBLIC_KEY, CULQI_SECRET_KEY

#### ¿Es correcto este flujo?
✅ **Es la integración más crítica de toda la plataforma.** Sin pagos reales integrados, Habita Perú no puede cobrar por ninguna de sus fuentes de ingreso. Todo lo demás depende de esto.

**Recomendación:** Culqi primero (es peruano, soporte local, acepta Yape/Plin que es clave para el mercado). Niubiz e Izipay como alternativas secundarias. No intentar integrar los tres al mismo tiempo.

---

### 4.2 — Convenios con Universidades

#### ¿Cómo se trabajará?
Página de landing especializada por universidad + código de acceso para estudiantes verificados.

**Flujo:**
```
Universidad firma convenio con Habita Perú (proceso offline/legal)
  → Se crea página: habitaperu.com/universidad/pucp
  → Estudiante ingresa con email institucional (@pucp.edu.pe)
  → Verificación automática del dominio → badge "Estudiante verificado"
  → Acceso a propiedades filtradas por cercanía a esa universidad
  → Landlords que quieren llegar a esa universidad pueden pagar featured en esa landing
```

**DB necesaria:**
- `University` (nombre, dominio email, ubicación lat/lng)
- `user.universityId` (FK opcional)
- `user.studentVerified Boolean`

#### ¿Es correcto este flujo?
⚠️ **Correcto en concepto pero los convenios universitarios son lentos en Perú.** Los procesos administrativos de universidades pueden tomar 3-6 meses. 

**Recomendación:** Versión 1.0 sin convenio: simplemente un filtro de búsqueda "Cerca de mi universidad" con selector de universidad y radio de distancia. No requiere convenio, genera el mismo valor al estudiante, y cuando venga el convenio la base técnica ya está. La verificación de email institucional puede implementarse en paralelo sin depender del convenio.

---

## 5. Opinión General del Flujo de Negocio

### Lo que está bien planteado ✅

**El core del producto es sólido.** KYC + contratos legales + firma digital es un diferenciador real en el mercado peruano donde el 80% de alquileres se hacen "de palabra" o con contratos informales. Eso resuelve un dolor real.

**La secuencia lógica es correcta:** Primero formalizar el mercado (contratos + KYC), luego monetizar sobre la confianza generada.

---

### Lo que cambiaría del flujo ⚠️

**Problema 1 — Dos clientes, una sola experiencia de monetización.**
El canvas apunta a cobrarle principalmente al landlord (suscripciones, featured). Pero el tenant también se beneficia (contratos seguros, KYC como garantía). Actualmente el tenant no paga nada. Considerar: cobrar al tenant una pequeña tarifa de "verificación de identidad" (S/ 9.90 única vez) que financia el KYC y filtra inquilinos no serios.

**Problema 2 — Dependencia de pagos de suscripción en mercado con baja cultura de SaaS.**
En Perú, los arrendadores pequeños son reacios a pagar suscripciones mensuales por software. El modelo de pago por uso (pay-per-use) puede funcionar mejor: cobrar S/ 29 por cada contrato firmado exitosamente (success fee) en lugar de S/ 49/mes fijo. Alineación de incentivos: Habita solo cobra cuando el arrendador consigue inquilino.

**Problema 3 — Sin estrategia de red bidireccional.**
La plataforma necesita landlords Y tenants simultáneamente para funcionar. Si hay propiedades pero no tenants, o tenants pero no propiedades, el marketplace muere. El canvas no define claramente cómo romper el "cold start problem". 

**Recomendación de flujo de adquisición:**
```
Fase 1 (0-3 meses): Captar landlords con propiedades GRATIS
  → Conseguir inventario de propiedades sin cobrar nada
  → Meta: 200 propiedades activas en Lima
  
Fase 2 (3-6 meses): Atraer tenants con propiedades verificadas
  → El inventario verificado atrae tenants orgánicamente
  → Meta: 500 búsquedas activas/mes
  
Fase 3 (6-12 meses): Monetizar sobre base activa
  → Introducir featured listings (menor fricción)
  → Introducir planes cuando landlords ya ven el valor
```

---

### Prioridad de implementación recomendada

```
Sprint 1 (2-3 semanas)
  ├── Integración Culqi (pagos reales)
  └── Open Graph + Social sharing

Sprint 2 (2-3 semanas)
  ├── Anuncios destacados (featured listings)
  └── WhatsApp Business API (notificaciones clave)

Sprint 3 (3-4 semanas)
  ├── Sistema de reseñas verificadas
  └── Planes de suscripción (freemium)

Sprint 4 (4-5 semanas)
  ├── Descarga PDF de contratos
  ├── Filtro "Cerca de universidad"
  └── Soporte con Crisp/Tawk.to

Sprint 5 (futuro — v2.0)
  ├── Chat interno
  ├── Marketplace de servicios
  └── Publicidad especializada
```

---

*Generado el 2026-06-04 — Revisión pendiente con equipo legal y de producto.*
