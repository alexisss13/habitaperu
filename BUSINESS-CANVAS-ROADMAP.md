# Habita Perú — Roadmap del Business Model Canvas
> Plan de implementación definitivo. Las recomendaciones ya están incorporadas
> como decisiones tomadas, no como opciones. Adaptado para equipo de 3 estudiantes
> con lanzamiento inicial en **Trujillo**.

---

## Índice
1. [Fuentes de Ingreso](#1-fuentes-de-ingreso)
2. [Relación con Clientes](#2-relación-con-clientes)
3. [Canales](#3-canales)
4. [Socios Clave](#4-socios-clave)
5. [Flujo de adquisición y expansión](#5-flujo-de-adquisición-y-expansión)

---

## 1. Fuentes de Ingreso

### 1.1 — Success Fee por Contrato Firmado ⭐ PRIMERA FUENTE DE INGRESO

**Decisión tomada:** No se cobra suscripción mensual al inicio. Se cobra
una tarifa única por cada contrato que se completa exitosamente (ambas
partes firman). El landlord solo paga cuando consiguió inquilino.

**Precio:** S/ 29 por contrato completado

**Por qué este modelo y no la suscripción:**
- El arrendador peruano promedio desconfía de compromisos mensuales
  por software que aún no conoce
- La suscripción crea presión de "tengo que recuperar lo que pagué"
  antes de haber usado el producto
- El success fee alinea el incentivo de Habita con el del landlord:
  ambos ganan cuando se concreta el alquiler
- Menor fricción para el primer pago = mayor conversión

**Flujo técnico:**
```
Contrato llega a estado ACTIVE (ambas partes firmaron)
  → Sistema genera cobro automático al landlord vía Culqi
  → Landlord recibe notificación: "Tu contrato está activo. S/29 cobrados."
  → Si el pago falla → 3 reintentos automáticos en 24h
  → Si sigue fallando → contrato queda activo pero landlord en estado
    "pago pendiente" (no se bloquea el contrato, se gestiona offline)
```

**Tablas DB necesarias:**
- `Payment` ya existe → añadir `type: SUCCESS_FEE | FEATURED | SUBSCRIPTION`
- `contract.successFeePaid Boolean @default(false)`
- `contract.successFeePaidAt DateTime?`

**Copy que se usará (no mencionar "comisión"):**
> *"Tu contrato legal verificado, con firma digital, hash criptográfico y
> registro ante Habita Perú: S/ 29 una sola vez."*

---

### 1.2 — Tarifa de Verificación KYC al Tenant ⭐ SEGUNDA FUENTE DE INGRESO

**Decisión tomada:** El tenant paga S/ 9.90 una sola vez para completar
su verificación de identidad. Este cobro cumple dos funciones:
1. Filtra inquilinos no serios (quien paga S/9.90 está comprometido)
2. Financia el costo del proceso KYC

**Importante:** Este pago es por verificación de identidad, no por usar
la plataforma. Una vez verificado, el tenant puede postular a todas las
propiedades que quiera sin pagar nada más.

**Flujo técnico:**
```
Tenant completa el formulario KYC (DNI + selfie)
  → Sistema procesa la verificación
  → Si aprobado → modal de pago: "Tu identidad fue verificada.
    Activa tu perfil por S/ 9.90"
  → Pago con Culqi (Yape, Plin o tarjeta)
  → user.kycVerified = true
  → Badge "Verificado" visible para landlords
  → Acceso desbloqueado para contactar arrendadores
```

**Tablas DB necesarias:**
- `user.kycVerified Boolean @default(false)`
- `user.kycVerifiedAt DateTime?`
- `user.kycFeePaid Boolean @default(false)`

---

### 1.3 — Anuncios Destacados (Featured Listings) ⭐ TERCERA FUENTE DE INGRESO

**Decisión tomada:** Esta es la primera feature de pago visible para el
landlord. Se implementa antes que las suscripciones porque es pago único,
sin compromiso, y el beneficio es inmediato y medible.

**Precios:**
| Duración | Precio | Equivale a... |
|---|---|---|
| 7 días | S/ 15 | Una llamada a un agente inmobiliario |
| 15 días | S/ 25 | Un café diario |
| 30 días | S/ 45 | Un tanque de gas |

**Flujo técnico:**
```
Landlord entra al detalle de su propiedad
  → Ve estadísticas de vistas de los últimos 7 días
  → Botón "Destacar esta propiedad" con comparativa de vistas
    promedio: normal vs destacada
  → Selecciona duración → pago con Culqi
  → property.featuredUntil = ahora + duración elegida
  → Query de búsqueda: ORDER BY featuredUntil DESC NULLS LAST
  → Badge "Destacado" visible en tarjeta de propiedad
  → Al vencer: notificación "Tu destacado venció, ¿renovar?"
```

**Regla de negocio importante:**
No ofrecer featured en zonas con menos de 5 búsquedas en los últimos
7 días. Si no hay demanda en esa zona, el featured no servirá y el
landlord pedirá reembolso. Mejor no venderlo que venderlo mal.

**Tablas DB necesarias:**
- `property.featuredUntil DateTime?`
- `property.featuredPaidAt DateTime?`
- `property.totalViews Int @default(0)` (para mostrar estadísticas)

---

### 1.4 — Planes de Suscripción (desde mes 6 en adelante)

**Decisión tomada:** Las suscripciones se introducen DESPUÉS de que el
landlord ya experimentó el valor del producto. No antes. El trigger para
presentar el plan es cuando el landlord tiene su segunda propiedad activa.

**Estructura de planes:**
| Plan | Propiedades | Precio | Diferenciador real |
|---|---|---|---|
| **Gratis** | Hasta 3 | S/ 0 | Contratos + KYC básico |
| **Pro** | Hasta 10 | S/ 49/mes | Analytics, descarga PDF, soporte prioritario, featured mensual incluido |
| **Business** | Ilimitadas | S/ 129/mes | Todo Pro + onboarding asistido, badge "Arrendador Verificado" |

**Por qué el límite gratis es 3 y no 1 o 2:**
La mayoría de arrendadores en Trujillo tienen 1–3 cuartos o propiedades.
Si el límite gratis es 1, casi nadie necesita pagar porque la mayoría
tiene 1 sola propiedad. Con límite en 3, se captura suficiente valor
gratis para generar adopción, y el landlord que crece naturalmente
supera ese límite y tiene razón orgánica para pagar.

**Flujo técnico:**
```
Landlord intenta publicar la 4ª propiedad
  → Modal: "Has llegado al límite del plan Gratis (3 propiedades).
    Pasa a Pro por S/49/mes y gestiona hasta 10."
  → Comparativa visual de planes
  → Pago con Culqi Subscriptions (recurrente mensual)
  → user.subscriptionPlan = PRO
  → user.subscriptionEndsAt = ahora + 30 días
  → Cron job diario revisa vencimientos y notifica 5 días antes
```

**Tablas DB necesarias:**
- `user.subscriptionPlan String @default("FREE")`
- `user.subscriptionEndsAt DateTime?`
- `user.subscriptionCulqiId String?` (ID del cliente en Culqi para recurrencia)

---

### 1.5 — Descarga PDF del Contrato (incluida en planes, no cobro aislado)

**Decisión tomada:** El PDF NO se cobra por separado. Hacerlo generaría
sensación de abuso ("ya firmé y ahora me cobran por descargarlo"). En
cambio, la descarga PDF es el beneficiador más tangible del plan Pro.

**Flujo:**
```
Contrato en estado ACTIVE
  → Plan Gratis: puede ver el contrato en pantalla, no puede descargar PDF
    → Banner: "Descarga el PDF legal de tu contrato con el plan Pro"
  → Plan Pro/Business: botón "Descargar PDF" disponible directamente
    → Backend genera PDF (react-pdf o Puppeteer)
    → PDF incluye: hash SHA-256, timestamps de firma, QR de verificación
    → Se envía por email a ambas partes automáticamente
```

**Nota técnica:** El endpoint `app/api/contracts/[id]/download/route.ts`
ya existe en el codebase. Solo falta implementar la generación real del PDF
y la verificación del plan del usuario.

---

### 1.6 — Directorio de Servicios (sin cobro, sin marketplace complejo)

**Decisión tomada:** NO se implementa marketplace de servicios con pagos
integrados. Es un negocio dentro de otro negocio que requiere operación
offline y resolución de disputas.

**Lo que SÍ se implementa:** Un directorio simple de proveedores
recomendados en Trujillo (mudanza, limpieza, mantenimiento, internet)
con botón "Contactar por WhatsApp". Sin cobro, sin intermediación de pago.

**Valor para el usuario:** El tenant que firma su primer contrato
recibe en su dashboard una sección "Para tu mudanza" con contactos
locales verificados manualmente por el equipo de Habita.

**Valor para Habita:** Genera goodwill y diferenciación sin complejidad.
Cuando haya tráfico suficiente (mes 12+), estos proveedores pagarán
por aparecer primero en el directorio. Eso es la monetización futura.

---

### 1.7 — Publicidad Especializada (postergada a año 2)

**Decisión tomada:** No se implementa hasta tener ≥ 50,000 visitas/mes
demostrables. Sin esa métrica, ninguna empresa pagará por publicidad.

**Acción inmediata en su lugar:** Acuerdos de intercambio con empresas
locales de Trujillo (tiendas de muebles, proveedores de internet como
Claro/Movistar) para ofrecer descuentos exclusivos a los tenants de
Habita. Sin cobro. Genera valor al usuario sin requerir tráfico masivo.

---

## 2. Relación con Clientes

### 2.1 — Sistema de Reseñas Verificadas

**Estado:** Implementar en Sprint 3 (meses 4–6)

**Reglas definitivas:**
- Solo contratos en estado `ACTIVE` con ≥ 30 días de antigüedad, o `FINISHED`
- Ambas partes califican: tenant califica propiedad + landlord, landlord califica tenant
- Publicación después de 48h (tiempo para que la otra parte responda si quiere)
- Las reseñas del tenant son visibles solo para landlords (no públicas)
- Las reseñas de propiedades son públicas en el listing

**Flujo:**
```
Contrato cumple 30 días en ACTIVE
  → Notificación automática a ambas partes (email + WhatsApp)
  → Tenant: "¿Cómo fue tu experiencia con [propiedad]? Califica ahora"
  → Landlord: "¿Cómo fue [nombre tenant] como inquilino?"
  → Formulario: 1–5 estrellas + texto libre (mín. 20 caracteres)
  → Ambas reseñas se publican juntas después de 48h
  → Rating promedio impacta posición en búsqueda
```

**Protección anti-manipulación:**
- Reseña solo desde IP diferente a la del landlord de esa propiedad
- Máximo 1 reseña por contrato
- Contratos DRAFT o sin pago de success fee no generan reseñas

---

### 2.2 — Contacto Landlord ↔ Tenant

**Decisión tomada:** NO se construye chat interno en esta etapa.
WhatsApp es el estándar en Perú y construir un chat propio tardaría
3–4 semanas que se invierten mejor en features que generan ingreso.

**Lo que se implementa (1 día de trabajo):**
```
Tenant interesado en propiedad
  → Botón "Consultar al arrendador"
  → Se abre WhatsApp con mensaje predefinido:
    "Hola, vi tu propiedad en Habita Perú: [título propiedad].
     ¿Sigue disponible? Me gustaría coordinar una visita."
  → El número del landlord nunca se muestra en el listado público
    (se revela solo cuando el tenant tiene KYC verificado)
```

**Por qué revelar el número solo con KYC verificado:**
Esto obliga al tenant a completar el KYC (y pagar los S/9.90) antes de
poder contactar al landlord. Es el gate de monetización correcto: el
tenant ve la propiedad, se interesa, y para dar el siguiente paso debe
verificar su identidad. Natural, no forzado.

---

### 2.3 — Soporte al Usuario

**Decisión tomada:** Usar **Tawk.to** (100% gratuito, sin límite de
conversaciones). Se integra en 30 minutos con un script en el layout.

**Flujo de soporte:**
```
Usuario tiene problema → ícono de chat en esquina inferior derecha
  → FAQ automático cubre: ¿Cómo funciona el contrato?, ¿Cómo verifico
    mi identidad?, ¿Cómo firmo digitalmente?, ¿Es legal este contrato?
  → Si no resuelve → chat en vivo con el equipo (horario: 9am–9pm)
  → Fuera de horario → mensaje queda guardado, respuesta en < 12h
```

**Recursos legales gratuitos a enlazar:**
- Texto de Ley 30201 (disponible en leyes.congreso.gob.pe)
- Texto de Ley 30933 (desalojo express)
- Guía "¿Qué hacer si mi inquilino no paga?" (redactarla en el equipo)

---

## 3. Canales

### 3.1 — WhatsApp Business para Notificaciones

**Estado:** Implementar en Sprint 2 (mes 3–4). Alta prioridad.

**Mensajes a implementar (en orden de prioridad):**

| Evento | Mensaje | Para quién |
|---|---|---|
| Contrato enviado al tenant | "Tienes un contrato pendiente de firma en Habita Perú. Revísalo aquí: [link]" | Tenant |
| Tenant firmó | "El inquilino firmó el contrato. Tu contrafirma lo activa. Firma aquí: [link]" | Landlord |
| Contrato activo | "Tu contrato de alquiler está activo desde hoy. Ver detalles: [link]" | Ambos |
| Pago de renta registrado | "Tu pago de [mes] fue registrado ✓. Ver comprobante: [link]" | Tenant |
| Recordatorio de pago (3 días antes) | "Tu pago de alquiler vence en 3 días. Monto: S/[X]" | Tenant |
| KYC aprobado | "Tu identidad fue verificada ✓. Ya puedes contactar arrendadores." | Tenant |

**Reglas para no ser marcado como spam:**
- Máximo 2 mensajes/semana por usuario
- Siempre con opción de responder "STOP" para opt-out
- Solo mensajes transaccionales (no marketing)
- Templates pre-aprobados por Meta antes de usar en producción

---

### 3.2 — Open Graph + Social Sharing

**Estado:** Implementar en Sprint 1 (semana 1–2). Es 1–2 días de trabajo.

**Qué se implementa:**
```
Cada propiedad tiene su propia URL pública:
  habitaperu.pe/propiedades/[id]

Meta tags Open Graph en esa página:
  og:title    → "Cuarto en Urb. California, Trujillo - S/450/mes"
  og:description → "2 hab, 1 baño, amoblado. Arrendador verificado."
  og:image    → Primera foto de la propiedad (optimizada para preview)
  og:url      → URL canónica de la propiedad

Botones en la página de detalle:
  → "Compartir en WhatsApp" (abre wa.me con link + descripción)
  → "Compartir en Facebook" (abre sharer con link)
  → "Copiar enlace" (clipboard API)
  → UTM: ?utm_source=whatsapp&utm_medium=share&utm_campaign=property
```

**Por qué es importante para Trujillo:**
Los grupos de Facebook de alquileres en Trujillo tienen decenas de miles
de miembros. Cuando un landlord comparte su propiedad desde Habita, el
preview rico (imagen + precio + ubicación) es mucho más efectivo que
solo pegar el link en texto plano.

---

## 4. Socios Clave

### 4.1 — Culqi (Pagos)

**Decisión tomada:** Culqi es el único procesador de pagos a integrar
en la primera etapa. Niubiz e Izipay se evalúan en año 2.

**Plan de activación:**
```
Semana 1: Registrar cuenta en culqi.com (modo test, sin empresa requerida)
Semana 2–6: Desarrollo e integración con API de test
Semana 6–8: Registrar RUC en SUNAT (persona natural con negocio)
Semana 8: Solicitar activación de cuenta Culqi en modo producción
Semana 10: Primer cobro real en producción
```

**Métodos de pago a activar (en orden de prioridad):**
1. **Yape** — el más usado en Trujillo, especialmente estudiantes
2. **Plin** — segundo más usado, BCP/BBVA/Interbank/Scotiabank
3. **Tarjeta débito** — para arrendadores que no usan billeteras digitales
4. **Tarjeta crédito** — para plan Business y pagos de mayor monto

**Implementación técnica (idempotencia obligatoria):**
```typescript
// Cada intento de pago genera una key única
const idempotencyKey = `${userId}-${conceptType}-${Date.now()}`

// Se envía en el header de cada request a Culqi
headers: { 'Idempotency-Key': idempotencyKey }

// Si el mismo request llega dos veces (doble clic, retry)
// Culqi retorna el resultado del primero sin cobrar dos veces
```

---

### 4.2 — Universidades de Trujillo (sin convenio formal al inicio)

**Decisión tomada:** No esperar convenios formales. Implementar
filtro de búsqueda "Cerca de mi universidad" sin necesidad de
acuerdo institucional.

**Lo que se implementa ahora:**
```
En el buscador de propiedades:
  → Selector: "Buscar cerca de..." con opciones:
    UNT, UCV, UPAO, UPN, ULADECH, UTELESUP
  → Radio configurable: 500m, 1km, 2km, 5km
  → Geolocalización de propiedades vs coordenadas de campus
  → Resultados ordenados por distancia al campus seleccionado
```

**Lo que se hace offline en paralelo:**
- Presentar el producto en ferias de emprendimiento de UNT/UCV/UPAO
- Hablar directamente con la Oficina de Bienestar Universitario
  (son ellos quienes reciben consultas de estudiantes sobre alojamiento)
- Ofrecer que recomienden Habita Perú a estudiantes que buscan cuarto
- No requiere convenio formal: solo una recomendación informal

**Cuándo buscar el convenio formal:**
Cuando haya ≥ 20 contratos firmados por estudiantes de esa universidad.
Con datos reales, la conversación con la universidad es diferente:
"Tenemos 20 estudiantes tuyos que alquilaron a través de nuestra plataforma"
tiene mucho más peso que "queremos hacer un convenio".

---

### 4.3 — Incubadora Universitaria (recurso gratuito)

**Acción inmediata:** Inscribirse en el programa de la incubadora
de la universidad de alguno de los tres integrantes del equipo.

**Qué se obtiene gratis:**
- Revisión del contrato generado por abogados de la clínica jurídica
- Mentoría de emprendedores con experiencia en el mercado local
- Acceso a red de contactos (posibles landlords early adopters)
- Espacio de trabajo y reuniones si lo necesitan
- Credibilidad ante primeros usuarios ("proyecto de la universidad")

---

## 5. Flujo de Adquisición y Expansión

### Secuencia definitiva de ciudades

```
Meses 0–6   → Trujillo (validar modelo con ventaja de fundador local)
Meses 6–9   → Chiclayo (mismo perfil universitario/industrial, cerca)
Meses 9–12  → Piura (tercer mercado antes de Lima)
Mes 12–18   → Lima (con modelo probado en 3 ciudades)
Mes 18–24   → Arequipa + consolidación nacional
```

**Por qué este orden:**
Chiclayo y Piura tienen el mismo perfil que Trujillo: ciudades
universitarias con mercado de alquiler informal y sin plataforma dominante.
El equipo ya sabe cómo adquirir usuarios en ese tipo de ciudad. Lima
requiere más recursos y tiene más competencia. Llegar a Lima con 3 ciudades
validadas es una narrativa mucho más fuerte que llegar directo.

### Flujo de adquisición de los primeros 50 landlords en Trujillo

**Esta es la tarea más importante de los primeros 2 meses. Sin este paso,
todo lo demás no tiene sentido.**

```
Semana 1–2: Identificar landlords en OLX Trujillo
  → Buscar propiedades activas en OLX con anuncios de cuartos/depas
  → Crear lista de 50 contactos (nombre, teléfono, zona, precio)
  → Contactar por WhatsApp con mensaje específico:

  "Hola [nombre], vi tu anuncio en OLX. Soy [nombre] de Habita Perú,
   una plataforma de Trujillo para alquileres seguros. Te ofrecemos
   publicar tu propiedad gratis + verificamos la identidad de los
   inquilinos antes de que te contacten. ¿Te interesa que te ayude
   a cargar tu propiedad esta semana? Sin costo."

Semana 3–4: Onboarding asistido de los primeros 10
  → Hacer videollamada o visita presencial
  → Cargar la propiedad juntos (no mandarlos solos)
  → El primer landlord satisfecho recomienda a otro
  → Meta: 10 propiedades publicadas en semana 4

Semana 5–8: Conseguir los primeros tenants
  → Publicar en grupos de Facebook universitarios de Trujillo
  → Volantes QR en campus de UNT, UCV, UPAO
  → Mensaje en grupos de WhatsApp de estudiantes

Meta mes 3: 50 propiedades publicadas + 100 tenants registrados
```

### Métricas por etapa para decidir si continuar o pivotar

| Etapa | Métrica mínima | Si no se cumple... |
|---|---|---|
| Mes 3 | 50 propiedades + 100 tenants | Revisar propuesta de valor, no escalar |
| Mes 6 | 10 success fees cobrados | Revisar el proceso de contrato, simplificar |
| Mes 9 | MRR ≥ S/ 500 | Evaluar si el mercado de Trujillo es suficiente |
| Mes 12 | MRR ≥ S/ 2,000 | Evaluar expansión vs profundizar en Trujillo |

---

## Sprint de implementación técnica (orden definitivo)

```
Sprint 1 — Semanas 1–3 (base funcional)
  ├── Corregir todos los bugs actuales (errores Zod, modales, contratos)
  ├── Open Graph en páginas de propiedades
  ├── Botón "Contactar por WhatsApp" en listings (con KYC gate)
  └── Tawk.to integrado en el layout

Sprint 2 — Semanas 4–6 (monetización inicial)
  ├── Integración Culqi (success fee + KYC fee tenant)
  ├── Featured listings con estadísticas de vistas
  └── Activar Culqi en producción (RUC + cuenta bancaria)

Sprint 3 — Semanas 7–10 (retención y confianza)
  ├── WhatsApp Business API (notificaciones clave)
  ├── Sistema de reseñas verificadas
  └── Filtro "Cerca de universidad" con geolocalizción

Sprint 4 — Semanas 11–14 (monetización avanzada)
  ├── Planes Pro y Business con Culqi Subscriptions
  ├── Descarga PDF de contratos (solo plan Pro+)
  └── Analytics básico de vistas por propiedad

Sprint 5 — Mes 4+ (escala)
  ├── Directorio de servicios locales (sin pago integrado)
  ├── Preparación para lanzamiento en Chiclayo
  └── Postulación a Startup Perú con métricas reales
```

---

*Actualizado el 2026-06-04. Decisiones incorporadas como plan definitivo.*
*Equipo: 3 estudiantes. Ciudad inicial: Trujillo. Capital inicial: S/ 0.*
