# Habita Perú — Análisis de Viabilidad por Etapas
> Documento técnico-comercial adaptado para equipo de 3 estudiantes
> con lanzamiento en **Trujillo** y sin capital inicial.
> Incluye justificación de viabilidad, riesgos reales y casos de falla.

---

## Índice
1. [Etapa 0 — Estado actual del producto](#etapa-0--estado-actual-del-producto)
2. [Etapa 1 — Adquisición sin monetización (meses 0–3)](#etapa-1--adquisición-sin-monetización-meses-0-3)
3. [Etapa 2 — Primera monetización (meses 3–6)](#etapa-2--primera-monetización-meses-3-6)
4. [Etapa 3 — Escala y retención (meses 6–12)](#etapa-3--escala-y-retención-meses-6-12)
5. [Etapa 4 — Expansión regional (mes 12+)](#etapa-4--expansión-regional-mes-12)
6. [Casos de falla críticos](#casos-de-falla-críticos)
7. [Matriz de riesgo consolidada](#matriz-de-riesgo-consolidada)

---

## Etapa 0 — Estado actual del producto

### Qué existe hoy
- Plataforma web funcional con dashboards para landlord, tenant y admin
- KYC básico implementado (pendiente de validar con matching facial real)
- Motor de contratos legales con firma digital y hash SHA-256
- Sistema de pagos (registro manual, sin cobro real integrado aún)
- Autenticación completa
- Equipo: 3 estudiantes de diseño y desarrollo en Trujillo

### Veredicto de viabilidad: ✅ Base técnica sólida, trabajo de mercado por delante

La base técnica es superior a la mayoría de startups peruanos en etapa
similar. El diferenciador legal (contratos con Ley 30201 + Ley 30933)
es genuinamente difícil de replicar rápidamente por un competidor.
Esto da una ventana de 6–9 meses antes de que alguien pueda alcanzar
la misma profundidad legal.

El mayor riesgo ahora no es técnico. Es que el equipo siga construyendo
features sin salir a hablar con usuarios reales en Trujillo.

### Riesgos de esta etapa

**Riesgo 1 — Seguir programando en lugar de vender.**
Es la trampa más común de equipos técnicos. El producto ya es suficiente
para los primeros usuarios. Cada semana adicional de desarrollo sin
usuarios reales es tiempo perdido que no genera aprendizaje.

**Riesgo 2 — Deuda técnica de framework.**
Turbopack + Next.js 15 en versión temprana puede generar breaking changes
en actualizaciones. Los errores de Zod que ya aparecieron son síntoma de
validaciones estrictas que necesitan datos perfectos. En producción con
usuarios reales, los datos nunca son perfectos.
**Mitigación inmediata:** Repasar todos los schemas Zod y agregar
`.optional()` o fallbacks defensivos en campos que pueden llegar nulos
desde la DB.

---

## Etapa 1 — Adquisición sin monetización (meses 0–3)

### Objetivo
Conseguir **50 propiedades activas en Trujillo** y **100 tenants
registrados con KYC iniciado**.

> Nota: Las métricas son menores que el análisis anterior (que era
> para Lima). 50 propiedades en Trujillo representan el mismo esfuerzo
> relativo que 200 en Lima, dado el tamaño del mercado. Con 50
> propiedades bien ubicadas cerca de UNT, UCV y UPAO, la plataforma
> ya tiene inventario visible y útil para los primeros tenants.

**No cobrar nada. Aprender. Crecer.**

### Por qué es viable en Trujillo

**1. El fundador es local — ventaja que el dinero no puede comprar.**
Conoces los barrios donde viven los estudiantes, sabes cuánto cuesta
un cuarto en Urb. California vs La Esperanza, tienes contactos directos
en las universidades, y cuando llames a un landlord podrás decir
"soy trujillano" — eso abre puertas que un equipo de Lima no puede abrir
de forma remota.

**2. El dolor es más agudo porque hay menos soluciones.**
En Lima existen Urbania, Adondevivir, múltiples agencias digitales.
En Trujillo el mercado está cubierto por OLX, grupos de Facebook
y agencias informales con comisiones altas. El landlord de Trujillo
no tiene una alternativa buena. Habita llega a un mercado hambriento.

**3. La concentración universitaria reduce el costo de adquisición.**
UNT, UCV, UPAO y UPN están en zonas específicas y conocidas.
Un volante en el campus, un post en el grupo de Facebook de la facultad,
o una conversación con el encargado de Bienestar Estudiantil puede
llegar a decenas de tenants potenciales en un solo movimiento.

**4. El corredor agroindustrial es un segundo mercado dentro del mismo.**
Virú, Chao y el parque industrial de La Libertad generan demanda
de alquiler de trabajadores relocalizados. Son inquilinos con más
estabilidad económica que los estudiantes y contratos más largos.
Este segmento no está bien cubierto por ninguna plataforma digital.

### Por qué puede fallar en Trujillo

**Falla técnica 1 — KYC con DNI prestado.**
Si el KYC solo valida que el DNI existe en RENIEC sin hacer matching
facial real, el sistema ofrece falsa seguridad. En Trujillo, donde
las redes sociales son más estrechas, esto es aún más probable.

```
Caso real en Trujillo:
  Estudiante A tiene deuda de pensión universitaria y antecedentes
  → Pide a su primo el DNI
  → Primo sube foto de su propio DNI + selfie del primo
  → KYC aprueba: el DNI existe y la foto coincide con el DNI
  → Pero quien realmente alquila es el estudiante A
  → No paga en mes 2, landlord pierde
  → "Habita Perú me estafó" en el grupo de Facebook de La Libertad
```

**Mitigación:** El KYC necesita biometría facial: comparar la selfie
del usuario contra la foto del DNI usando un servicio como AWS Rekognition
(tiene free tier de 5,000 imágenes/mes) o Treli/Truora (servicios
latinoamericanos de KYC). Sin esto, el badge "Verificado" es marketing,
no una garantía real.

**Falla técnica 2 — Contrato digital no ejecutable en juzgado de Trujillo.**
Los juzgados de paz y juzgados civiles de Trujillo siguen manejando
mucho papel. Un contrato digital con hash SHA-256 puede ser impecable
técnicamente pero el juez del 3er Juzgado Civil de Trujillo puede
pedir documento con firma manuscrita o notariado.

```
Caso real:
  Landlord en Urb. El Golf tiene inquilino que no paga desde mes 4
  → Lleva el PDF del contrato Habita Perú al juzgado de paz de Trujillo
  → Juez pregunta: "¿Está notariado?"
  → No está notariado
  → El desalojo express de Ley 30933 no aplica
  → Proceso ordinario: 12–24 meses
  → Landlord publica en grupos de Trujillo: "No sirve Habita Perú"
```

**Mitigación obligatoria antes del primer contrato real:**
- Clínica jurídica de UNT o UPAO (gratuita para proyectos estudiantiles)
  debe revisar el contrato generado y confirmar qué protección real ofrece
- Agregar disclaimer honesto y claro: *"Este contrato tiene validez como
  instrumento privado digital. Para activar el mecanismo de desalojo
  express de la Ley 30933, necesitas legalizarlo ante notario."*
- Contactar notarías de Trujillo para explorar legalización digital
  (algunas ya aceptan firmas electrónicas)

**Falla de negocio 1 — Cold start: nadie quiere llegar primero.**
Este es el problema estructural de todos los marketplaces. En Trujillo
es más fácil de resolver porque el equipo puede hacer outreach presencial,
pero requiere disciplina: no lanzar la plataforma pública con menos de
50 propiedades.

```
Flujo de falla que hay que evitar:
  Semana 1: 5 landlords publican propiedades
  → 0 tenants encuentran la plataforma
  → Landlords no reciben consultas en 2 semanas
  → Semana 3: los landlords se desactivan y vuelven a OLX
  → La plataforma queda con 5 propiedades fantasma
  → El siguiente landlord que entra ve la plataforma vacía → no se queda
```

**Regla de oro:** La plataforma se lanza públicamente solo cuando haya
mínimo 50 propiedades activas y reales. Esas 50 se consiguen con
outreach manual antes del lanzamiento, no esperando que lleguen solos.

**Falla de negocio 2 — El landlord trujillano no confía en plataformas digitales.**
El arrendador promedio en Trujillo tiene 45–65 años, alquila 1–3 cuartos
como ingreso complementario, y ha tenido experiencias malas con "esas
páginas de internet". La confianza no se genera con una web bonita,
se genera con una persona real que lo atiende.

```
Caso real:
  Doña Rosa, 62 años, alquila 2 cuartos en La Esperanza
  → Su hijo le dice que pruebe Habita Perú
  → Entra al sitio, ve el formulario de 6 pasos
  → "¿Para qué me registran si solo quiero alquilar mi cuarto?"
  → Cierra el tab y sigue publicando en OLX como siempre
```

**Mitigación:**
- Los primeros 50 landlords se onboardean en persona o por videollamada
- El formulario de publicación debe ser de máximo 4 pasos con lenguaje
  simple (no "tipo de inmueble: DEPARTAMENTO/HABITACION", sino
  "¿Qué alquilas?: Mi cuarto / Mi departamento / Mi casa completa")
- Video tutorial de 90 segundos grabado por el equipo en español peruano
  (no el español neutro de las plataformas genéricas)
- Número de WhatsApp del equipo visible en la página: los primeros
  landlords deben poder llamar a alguien si tienen dudas

### Métricas para avanzar a Etapa 2
- ≥ 50 propiedades activas publicadas en Trujillo
- ≥ 100 tenants con KYC iniciado (no necesariamente completado)
- ≥ 5 contratos firmados (aunque sea gratis, para validar el flujo)
- Al menos 3 landlords que digan "me funcionó" (cualitativo)

---

## Etapa 2 — Primera monetización (meses 3–6)

### Objetivo
Cobrar los primeros success fees y KYC fees. Activar Culqi en producción.
**Meta: 20 cobros reales procesados sin errores.**

> La meta no es el monto, es la calidad. 20 transacciones exitosas
> sin chargebacks ni errores de webhook vale más que 50 transacciones
> con problemas. Es el momento de validar que el sistema de pagos
> funciona correctamente antes de escalar.

### Por qué es viable

**1. El comportamiento de pagar ya está validado en el mercado local.**
OLX tiene anuncios destacados en Trujillo y los landlords los usan.
Significa que pagar por visibilidad digital no es un concepto extraño.
Solo hay que ofrecerlo en un contexto más confiable (con KYC y contratos).

**2. S/ 29 y S/ 9.90 son montos psicológicamente accesibles en Trujillo.**
S/ 29 es el precio de una cena para dos en un restaurante de Trujillo.
S/ 9.90 es un taxi del centro a la UNT. Son montos que no requieren
deliberación prolongada. La conversión será más alta que con precios
de Lima (donde S/29 también es accesible pero el costo de vida es mayor
y el escepticismo hacia plataformas nuevas también).

**3. Yape es el método de pago dominante en Trujillo.**
No tarjeta, no transferencia bancaria. Yape. El 70%+ de las
transacciones informales entre personas en Trujillo se hacen por Yape.
Culqi acepta Yape. Esto elimina la fricción del pago casi por completo.

### Por qué puede fallar

**Falla técnica 1 — Webhook de Culqi cae durante un deploy.**
El equipo usa Vercel, que hace deploys automáticos en cada push a main.
Si un webhook de pago llega exactamente durante un deploy (que tarda
30–60 segundos), el servidor responde 503 y el webhook se pierde.

```
Flujo de falla:
  Tenant paga S/9.90 para verificar su KYC
  → Culqi cobra la tarjeta exitosamente
  → El equipo hizo un push a main hace 30 segundos
  → Vercel está en medio de un deploy
  → Webhook llega, servidor responde 503
  → Culqi reintenta 3 veces en las próximas horas
  → Si el servidor sigue en deploy (no, pero si hay bug nuevo)...
  → El KYC nunca se activa
  → Tenant furioso: "Me cobraron y sigo sin verificación"
```

**Mitigaciones concretas:**
```typescript
// 1. No hacer deploys a main en horario pico (12pm–10pm)
// 2. Usar ramas de staging, nunca pushear directo a main en producción
// 3. Implementar reconciliación cada 2 horas:

// cron: cada 2 horas
async function reconcilePayments() {
  // Obtener pagos de Culqi de las últimas 3 horas
  const culqiPayments = await culqi.charges.list({ last: 50 })
  
  for (const charge of culqiPayments) {
    const localPayment = await prisma.payment.findFirst({
      where: { culqiChargeId: charge.id }
    })
    // Si el pago existe en Culqi pero no en DB → procesar
    if (!localPayment && charge.outcome.type === 'authorized') {
      await processPaymentFromCulqi(charge)
    }
  }
}
```

**Falla técnica 2 — Doble cobro por doble clic.**
El usuario hace clic en "Pagar", la respuesta tarda 2 segundos (Culqi
tiene latencia), y el usuario vuelve a hacer clic pensando que no funcionó.
Resultado: dos cobros del mismo monto.

```typescript
// Mitigación en UI (deshabilitar botón al primer clic):
const [paying, setPaying] = useState(false)

const handlePay = async () => {
  if (paying) return  // guard contra doble clic
  setPaying(true)
  try {
    await processPayment()
  } finally {
    setPaying(false)
  }
}

// Mitigación en backend (idempotency key):
const idempotencyKey = `${userId}-${paymentType}-${contractId}`
// Si llega el mismo key dos veces, Culqi ignora el segundo
```

**Falla de negocio 1 — Featured listing no genera ROI visible.**
Un landlord de Trujillo paga S/25 para destacar su propiedad 15 días.
Si no recibe más consultas, pedirá reembolso. Sin política clara,
el conflicto escala y daña la reputación local.

```
Escenario concreto:
  Landlord destaca propiedad en La Esperanza por S/25
  → La Esperanza tiene poca demanda relativa a Urb. California
  → 15 días: 2 consultas (vs 1 sin featured) — diferencia mínima
  → Landlord: "Pagué S/25 y no sirvió de nada"
  → Pide reembolso por WhatsApp al equipo
  → El equipo no tiene política definida → improvisan → mal resultado
```

**Mitigación:**
- Mostrar estadísticas de vistas en los 15 días previos antes de
  ofrecer el featured (si tiene 0 vistas, el problema no es el featured)
- Política de reembolso escrita y visible: "Si no recibes al menos
  3 vistas adicionales en 7 días, te devolvemos el 100%"
- Esta garantía es barata (pocas propiedades van a tener 0 vistas
  adicionales con el featured) y genera confianza

**Falla de negocio 2 — Culqi rechaza la cuenta por falta de RUC.**
Culqi en modo producción requiere RUC activo. Si el equipo no ha
tramitado el RUC, no pueden cobrar realmente.

```
Trámite RUC persona natural con negocio (el más simple):
  → sunat.gob.pe → Operaciones en Línea → Inscripción RUC
  → Tiempo: 1 día hábil
  → Costo: S/ 0
  → Actividad económica a declarar: "Actividades de portales web"
    (código CIIU 6312)
  → Régimen: RUS (Régimen Único Simplificado) si ventas < S/5,000/mes
    o Régimen MYPE Tributario si anticipan crecer más rápido

Hacer esto en la Semana 1, no cuando ya quieran cobrar.
```

### Métricas para avanzar a Etapa 3
- ≥ 20 cobros procesados sin errores ni chargebacks
- ≥ 15 success fees cobrados
- ≥ 5 KYC fees de tenants cobrados
- 0 dobles cobros registrados
- Tasa de éxito de webhooks ≥ 95%
- Al menos 1 landlord que renovó su featured listing (señal de ROI percibido)

---

## Etapa 3 — Escala y retención (meses 6–12)

### Objetivo
- Activar suscripciones Plan Pro
- Sistema de reseñas verificadas en producción
- WhatsApp Business API con notificaciones transaccionales
- Preparar expansión a Chiclayo
- **Meta: MRR ≥ S/ 1,500 en Trujillo**

> Meta ajustada vs análisis anterior (era S/8,000). S/1,500 MRR
> es lo realista para Trujillo con un equipo de 3 personas sin
> inversión en marketing pagado. Es suficiente para cubrir los
> costos operativos (que en esta etapa empiezan a aparecer) y
> demostrar tracción real ante una incubadora o fondo seed.

### Por qué es viable

**1. Para este punto el modelo ya está validado con datos reales.**
Si llegaron a 20 cobros en Etapa 2, tienen prueba de que los
usuarios pagan. La transición a suscripción mensual tiene base
empírica: "Los landlords con 4+ propiedades pagaron S/29 por contrato.
Con plan Pro a S/49/mes, ese mismo landlord con 2 contratos/mes
ahorra S/9." Es matemática, no promesa.

**2. Las reseñas verificadas crean ventaja acumulativa.**
Cada contrato que se firma deja la posibilidad de una reseña verificada.
Después de 100 contratos firmados, hay potencialmente 100 reseñas
reales. Ese activo no puede ser clonado por un competidor en semanas.
Las reseñas verificadas son el moat (foso competitivo) más barato de
construir y el más difícil de replicar.

**3. El corredor Trujillo–Chiclayo es natural y de bajo costo.**
Chiclayo está a 3 horas de Trujillo y tiene un perfil similar:
Universidad Nacional Pedro Ruiz Gallo, Universidad Señor de Sipán,
Universidad Privada Juan Mejía Baca. El mismo playbook de outreach
funciona. No hay que reinventar nada, solo replicar.

### Por qué puede fallar

**Falla técnica 1 — WhatsApp suspende el número de Habita.**
Meta es estricto con el uso de su API Business. Si los usuarios
marcan mensajes como spam, el número puede ser suspendido por 7 días
o permanentemente.

```
Escenario de suspensión:
  Habita tiene 300 usuarios en Trujillo
  → Se envía recordatorio de pago a todos el día 1 de cada mes
  → 15 usuarios (5%) marcan como spam (no querían el recordatorio)
  → Meta detecta tasa > 2% de spam
  → Número suspendido 7 días
  → Contratos pendientes de firma no reciben notificación
  → Landlords y tenants no saben qué pasó
  → Algunos contratos se pierden por falta de seguimiento
```

**Mitigación obligatoria:**
- Opt-in explícito para WhatsApp (no activar por default)
- Máximo 2 mensajes transaccionales por semana por usuario
- Solo mensajes de alta relevancia (nunca marketing ni promociones)
- Siempre incluir instrucción de opt-out: "Responde STOP para no recibir más"
- Tener email como canal de respaldo activo y funcional siempre

**Falla de negocio 1 — Churn de suscripciones en meses bajos.**
El mercado de alquileres universitarios en Trujillo tiene estacionalidad
clara: pico en marzo (inicio UNT/UCV/UPAO) y agosto (inicio segundo
semestre). En mayo–julio y noviembre–febrero la demanda cae.

```
Proyección realista de churn estacional en Trujillo:
  Marzo: 20 suscriptores Pro (temporada alta)
  Mayo: 13 suscriptores (35% churn, temporada baja)
  Agosto: 18 suscriptores (reactivación)
  Noviembre: 12 suscriptores (churn nuevamente)
```

**Mitigación:**
- Plan anual con descuento: S/450/año (equivale a 9 meses, 3 meses gratis)
- Los landlords con plan anual no cancelan en temporada baja porque
  ya pagaron y tienen 3 meses gratis esperándoles en temporada alta
- El corredor agroindustrial (Virú, Chao) tiene menor estacionalidad
  — trabajadores industriales alquilan todo el año

**Falla de negocio 2 — Expansión prematura a Chiclayo antes de consolidar Trujillo.**
Si el equipo sale a Chiclayo antes de que Trujillo esté sólido,
ninguna ciudad alcanza masa crítica.

```
Señal de alerta:
  Mes 7: Trujillo tiene 80 propiedades (no los 200 ideales)
  → El equipo siente presión de "expandir para crecer"
  → Se lanza Chiclayo con 10 propiedades
  → Atención del equipo se divide
  → Trujillo baja a 65 propiedades activas por falta de mantenimiento
  → Chiclayo no despega por falta de masa crítica
  → Dos mercados mediocres en lugar de uno sólido
```

**Regla de expansión:** No lanzar Chiclayo hasta que Trujillo tenga
≥ 150 propiedades activas y MRR ≥ S/ 800 sostenidos por 2 meses consecutivos.

### Métricas para avanzar a Etapa 4
- MRR ≥ S/ 1,500 sostenido por 2 meses
- Churn mensual de suscripciones < 15%
- ≥ 50 reseñas verificadas publicadas
- Tasa de contratos completados vs iniciados ≥ 50%
- WhatsApp tasa de spam < 1.5%
- Trujillo: ≥ 150 propiedades activas

---

## Etapa 4 — Expansión regional (mes 12+)

### Objetivo
- Lanzar Chiclayo (mes 12–15)
- Lanzar Piura (mes 15–18)
- Preparar Lima (mes 18–24)
- Postular a Startup Perú con métricas de 3 ciudades
- MRR combinado ≥ S/ 5,000

### Por qué es viable

**El modelo probado en Trujillo se replica, no se reinventa.**
Después de 12 meses operando en Trujillo, el equipo sabe exactamente:
- Cuánto tarda en conseguir los primeros 50 landlords (referencia real)
- Cuál es el mensaje que convierte en WhatsApp (probado con datos)
- Qué objeciones tienen los landlords y cómo resolverlas (experiencia)
- Cuándo ocurren los picos de demanda (estacionalidad documentada)

Ese conocimiento operativo no tiene precio y no puede ser copiado
por un competidor que nunca ha operado en ciudades intermedias peruanas.

**Con 3 ciudades validadas, la narrativa para inversión es sólida.**
"Habita Perú opera en Trujillo, Chiclayo y Piura con X contratos firmados,
Y soles en MRR y Z% de retención mensual" es una historia que un fondo
seed o Startup Perú puede financiar con confianza. Es diferente a
"somos una startup de Lima que quiere hacer proptech".

### Por qué puede fallar

**Falla crítica — Lima antes de tiempo.**
Lima tiene Urbania, Adondevivir, y agencias con presupuesto real
de marketing. Si el equipo llega a Lima antes de tener modelo
y capital probado, competirán con recursos muy inferiores en el
mercado más difícil.

**Regla para Lima:** No lanzar hasta tener:
- ≥ 2 ciudades operando con MRR positivo
- Capital suficiente (de ingresos o de Startup Perú) para marketing pagado
- Al menos 1 integrante del equipo que pueda operar en Lima

**Falla crítica — Competidor bien financiado entra al mercado.**
Si Habita valida el modelo, puede aparecer una startup con funding
que copie el concepto. La defensa no puede ser solo el producto.

```
Defensas reales que se construyen con tiempo:
  1. Reseñas verificadas acumuladas — no se pueden falsificar
  2. Contratos firmados = historial en Habita = switching cost real
  3. Marca = "el referente legal del alquiler en La Libertad"
     (reputación regional que tarda años en construirse y días en destruirse)
  4. Red de landlords confiables = comunidad, no solo plataforma
```

El diferenciador sostenible no es la tecnología (que se puede copiar),
sino la confianza acumulada en el mercado local. Eso requiere tiempo
y presencia, no solo dinero.

---

## Casos de falla críticos

### Caso 1 — Contrato rechazado en juzgado de Trujillo

**Probabilidad:** Media–Alta en Trujillo (juzgados más conservadores que Lima)
**Impacto:** Crítico

Un landlord de Trujillo usa el contrato de Habita Perú para iniciar
proceso de desalojo. El juzgado local no lo reconoce sin notariado.
La noticia se propaga en grupos de Facebook de La Libertad.

**Por qué es más probable en Trujillo:**
Los juzgados de paz y civiles en ciudades intermedias peruanas tienen
menos experiencia con contratos digitales que los de Lima. Un juez
en el Juzgado Civil de Trujillo puede simplemente no estar familiarizado
con la validez de la firma electrónica bajo la Ley 27269.

**Acción obligatoria antes del primer contrato real:**
Llevar el contrato generado a la Clínica Jurídica de UNT o UPAO y
preguntar específicamente: *"¿Este contrato activa el mecanismo de
desalojo de la Ley 30933 en el Poder Judicial de La Libertad?"*

Si la respuesta es no, agregar disclaimer claro en el contrato y
en la plataforma. No sobre-vender la protección legal.

---

### Caso 2 — Brecha de seguridad de datos personales

**Probabilidad:** Baja
**Impacto:** Catastrófico (legal + reputacional)

Los DNIs, fotos de documentos y datos de contratos de los usuarios
son datos sensibles bajo la Ley 29733 de Perú. Una brecha puede
resultar en multas de hasta 100 UIT (S/ 515,000) y destrucción
de reputación en el mercado local.

**Checklist de seguridad mínima antes de producción:**
```
□ .env.production NO está en el repositorio de Git
  → Verificar con: git log --all --full-history -- .env
  → Si aparece: rotar TODAS las credenciales inmediatamente

□ Variables de entorno en Vercel Dashboard, no en código

□ Cloudflare activado como proxy (protección DDoS gratuita)

□ Rate limiting en endpoints de auth y KYC
  → Máximo 5 intentos de login por IP en 15 minutos
  → Máximo 3 intentos de KYC por usuario en 24 horas

□ Campos sensibles (dni) no se loggean en Sentry ni en console.log

□ PostgreSQL: habilitar SSL en la conexión (Neon lo activa por default)

□ Política de privacidad publicada en el sitio (requisito Ley 29733)
```

---

### Caso 3 — Landlord y tenant cierran trato fuera de la plataforma

**Probabilidad:** Alta (especialmente en Trujillo donde las redes son cercanas)
**Impacto:** Alto (pérdida de ingreso y de datos de contrato)

En Trujillo, es muy probable que el landlord y el tenant se conozcan
indirectamente ("el hijo de la señora de la esquina", "el primo de un
compañero de trabajo"). Cuando hay confianza previa, el incentivo para
usar el sistema de contratos es menor.

```
Escenario real:
  Landlord publica en Habita Perú
  → Tenant lo contacta por WhatsApp (número visible tras KYC)
  → Landlord reconoce que es el sobrino de un conocido
  → "Mira, nos ahorramos el sistema ese, te doy el cuarto
     y firmamos un papel nomás"
  → Habita Perú pierde el success fee y el registro del contrato
```

**Por qué nunca se eliminará completamente:**
Es el equivalente de comprar sin boleta. En Perú, donde la economía
informal es estructural, ocurrirá con frecuencia especialmente al inicio.

**Lo que SÍ se puede hacer:**
- El valor del sistema debe superar el "costo" de usarlo. Si firmar
  en Habita tarda menos de 5 minutos, la excusa de "es muy complicado"
  desaparece
- El historial verificado del tenant (reseñas + pagos) es un activo
  que el tenant pierde si no usa la plataforma. Comunicarlo claramente
- A largo plazo, el landlord que no usa contratos de Habita no puede
  recibir reseñas ni aparecer como "Arrendador Verificado"

---

### Caso 4 — Abandono masivo en el proceso KYC

**Probabilidad:** Alta sin optimización del flujo
**Impacto:** Medio (frena el crecimiento de tenants verificados)

El KYC requiere foto del DNI + selfie. En la práctica, muchos usuarios
lo inician y no lo terminan porque:
- No tienen el DNI a mano en ese momento
- La cámara del celular no toma la foto bien (luz, ángulo)
- El proceso tarda más de lo esperado y se impacientan

**Tasa de abandono esperada sin optimización:** 40–60%

**Optimizaciones obligatorias:**
```
1. Guardar progreso: si el usuario cierra la app a mitad del KYC,
   al volver debe continuar desde donde quedó, no reiniciar

2. Instrucciones visuales claras con ejemplos:
   ✓ "Foto correcta: DNI plano, sin reflejo, fondo oscuro"
   ✗ "Foto incorrecta: reflejo de luz en el DNI"

3. Separar el KYC de la búsqueda:
   → El usuario puede buscar propiedades sin KYC
   → Solo cuando quiere CONTACTAR al landlord se le pide el KYC
   → Esta separación reduce el abandono porque hay motivación real

4. Mensaje de confirmación inmediato:
   "Tu verificación está siendo procesada. Te avisamos en menos
   de 5 minutos por WhatsApp." (genera expectativa manejable)
```

---

### Caso 5 — La plataforma colapsa en inicio de semestre (enero/agosto)

**Probabilidad:** Media si no se prepara la infraestructura
**Impacto:** Alto (el peor momento posible para perder usuarios)

Enero y agosto son los picos de demanda. Exactamente cuando la plataforma
más importa, puede colapsar si no está preparada para el tráfico.

Con Vercel Hobby (free tier), el auto-scaling es limitado. Con muchas
conexiones simultáneas a Neon (free tier: máximo 20 conexiones concurrentes),
la base de datos puede llegar al límite.

```
Escenario de colapso:
  15 de enero, 9am — inicio de clases en UNT y UCV
  → 200 estudiantes buscan cuarto al mismo tiempo
  → Neon free tier: 20 conexiones concurrentes saturadas
  → Las queries de búsqueda empiezan a fallar con "connection timeout"
  → Usuarios ven pantalla de error
  → Se van a OLX que siempre funciona
  → El momento más importante del año se pierde
```

**Mitigación antes de enero:**
- Implementar connection pooling con PgBouncer (Neon lo incluye)
- Queries de búsqueda cacheadas por 5 minutos (los resultados no cambian
  en 5 minutos, pero el servidor aguanta 10x más carga)
- Load test básico en diciembre con una herramienta gratuita como k6.io
- Si el free tier de Neon no alcanza → upgrade a plan $19/mes (60 conexiones)
  justo antes de enero, no después

---

## Matriz de riesgo consolidada

| Riesgo | Probabilidad | Impacto | Prioridad |
|---|---|---|---|
| Contrato rechazado en juzgado de Trujillo | Media-Alta | Crítico | **Urgente — antes del 1er contrato** |
| Brecha de datos personales | Baja | Catastrófico | **Urgente — antes de producción** |
| KYC con DNI prestado (falsa seguridad) | Media | Alto | **Alta — antes del lanzamiento** |
| Cold start sin inventario mínimo | Alta | Alto | **Alta — primeras 8 semanas** |
| Abandono en proceso KYC | Alta | Medio | Alta |
| Landlord cierra trato fuera de plataforma | Alta | Medio | Media (reducir fricción) |
| Webhook de Culqi fallido | Media | Medio | Media (reconciliación automática) |
| Colapso en enero/agosto | Media | Alto | Media (preparar en diciembre/julio) |
| Churn estacional de suscripciones | Media | Medio | Baja (Etapa 3, plan anual) |
| Expansión prematura a Chiclayo/Lima | Media | Alto | Baja (respetar métricas de expansión) |
| Competidor bien financiado | Baja-Media | Alto | Baja (construir reputación local) |
| WhatsApp suspendido por spam | Baja | Alto | Baja (buenas prácticas desde el inicio) |

---

## Conclusión ejecutiva

Habita Perú **es viable** para un equipo de 3 estudiantes en Trujillo
**si se respetan estas cinco reglas no negociables:**

```
1. No lanzar públicamente con menos de 50 propiedades activas
   → Conseguirlas primero con outreach manual, luego lanzar

2. Revisar el contrato con un abogado antes del primer contrato real
   → Clínica jurídica universitaria, sin costo

3. Tramitar el RUC en la Semana 1 (no cuando quieran cobrar)
   → sunat.gob.pe, gratis, 1 día hábil

4. No expandir a Chiclayo hasta que Trujillo tenga MRR ≥ S/800
   sostenido por 2 meses consecutivos

5. Salir a hablar con landlords reales esta semana
   → No la próxima semana. Esta semana.
   → El código ya es suficiente. Los usuarios son lo que falta.
```

El mayor peligro para este proyecto no es técnico ni financiero.
Es quedarse construyendo features en lugar de salir a conseguir
los primeros 50 landlords de Trujillo.

---

*Actualizado el 2026-06-04. Adaptado para equipo de 3 estudiantes,*
*lanzamiento en Trujillo, sin capital inicial.*
