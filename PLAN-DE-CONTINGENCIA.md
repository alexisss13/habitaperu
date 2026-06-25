PLAN DE CONTINGENCIA — HABITA PERÚ

Empresa: Qori Dev · Producto: Habita Perú
Ciudad de lanzamiento: Trujillo, Perú
Periodo reportado: 23 de abril de 2026 — 18 de junio de 2026


1. DESCRIPCIÓN GENERAL DE LA STARTUP


1.1 Nombre de la startup

Habita Perú, desarrollada bajo la empresa Qori Dev. Habita Perú es una plataforma PropTech y LegalTech que formaliza el alquiler de cuartos, habitaciones y mini departamentos en ciudades universitarias del Perú, con lanzamiento inicial en Trujillo.


1.2 Integrantes y funciones

La distribución de roles de este equipo no sigue la separación clásica de "un front-end, un back-end, un UX/UI" en partes iguales, porque la naturaleza del trabajo se organizó distinto: un integrante asumió el desarrollo técnico completo de la plataforma de extremo a extremo, mientras los otros dos integrantes se concentraron en la investigación, el análisis de mercado, el modelo de costos y la documentación del negocio. Esta tabla refleja la distribución real de trabajo, no una distribución formal de roles técnicos separados.

| Integrante | Rol | Responsabilidades |
|---|---|---|
| Alexis Levano | CEO y Desarrollador Full-stack | Coordinación general del proyecto. Desarrollo completo de la plataforma: frontend, backend, modelado de base de datos, autenticación, motor de contratos legales, integración de pagos y seguridad. |
| Carlos Carrascal | Análisis Financiero y Modelo de Negocio | Modelo de costos del proyecto, proyecciones financieras, evaluación de viabilidad económica por etapas, estructuración del Business Model Canvas. |
| Ruth Aquino | Investigación y Análisis de Mercado | Investigación del problema, análisis de la competencia (portales inmobiliarios y canales informales), segmentación de clientes, validación de la propuesta de valor. |

> Nota: esta distribución de roles es modificable según el formato que la docente requiera. Se documenta así porque refleja con precisión cómo se trabajó realmente.


1.3 Problema que buscan resolver

Situación actual: el mercado de alquiler de vivienda en el Perú creció de manera sostenida en la última década, pero una parte significativa de ese mercado —particularmente el segmento de cuartos, habitaciones y mini departamentos— sigue operando de manera informal. Arrendadores y candidatos a inquilinos se conectan a través de redes sociales, avisos físicos, portales de anuncios y referencias personales, sin contratos formales, sin verificación de identidad y sin ningún mecanismo de respaldo legal para ninguna de las dos partes.

A quién afecta: dos perfiles concretos. Primero, el arrendador urbano —típicamente entre 40 y 70 años— que alquila uno o dos espacios como ingreso complementario y no tiene herramientas confiables para verificar a un inquilino antes de entregarle las llaves. Segundo, el estudiante universitario que cada inicio de semestre necesita encontrar dónde vivir, generalmente lejos de su ciudad de origen, sin garantías ni referencias que ofrecer.

Consecuencias del problema: para el arrendador, la falta de verificación se traduce en impagos, daños a la propiedad y procesos de desalojo que, sin un contrato con respaldo legal claro, pueden demorar muchos meses en la vía ordinaria. Para el inquilino, la informalidad significa pérdida de depósitos sin ningún recurso, ausencia de comprobante de domicilio formal y exposición a estafas de propiedades que no existen o que ya fueron alquiladas a otra persona. El resultado es un mercado grande, activo, pero estructuralmente desconfiado.


1.4 Propuesta de valor

Habita Perú no es un portal de anuncios más. La mayoría de alternativas que existen hoy —grupos de redes sociales, portales generalistas de inmuebles, avisos en línea— resuelven solo la parte de "encontrar" una propiedad, pero ninguna resuelve la parte de "confiar" en la persona del otro lado. Habita Perú está diseñada específicamente para ese vacío: verificación de identidad del inquilino antes de que pueda contactar a un arrendador, generación de contratos legales digitales con firma electrónica y hash criptográfico, y un panel de gestión para que el arrendador controle pagos, documentos y vacancia desde un solo lugar.

La diferenciación frente a la competencia es de enfoque, no de tamaño: mientras los portales generalistas atienden venta y alquiler de alto valor en las grandes ciudades, Habita Perú se concentra exclusivamente en el alquiler de largo plazo de cuartos, habitaciones y mini departamentos en ciudades universitarias intermedias, un nicho desatendido por estar fragmentado en canales informales. El modelo de cobro —el arrendador paga solo cuando el contrato se concreta— elimina la principal objeción de adopción: nadie paga por publicar ni por buscar, solo por un resultado real.

[INSERTAR AQUÍ: capturas del prototipo en Figma o de las pantallas principales de la plataforma ya construida, mostrando el flujo de búsqueda de propiedad → contacto verificado → contrato digital]


2. AVANCES DEL PROYECTO


2.1 Cronología del trabajo realizado

| Actividad | Fecha | Estado |
|---|---|---|
| Investigación del problema y validación inicial con arrendadores de Trujillo | Semana 1 (23–29 abril) | Completado |
| Diseño de wireframes y definición del Business Model Canvas | Semana 2 (30 abril–6 mayo) | Completado |
| Modelado de base de datos (Prisma) y configuración de autenticación (NextAuth) | Semana 3 (7–13 mayo) | Completado |
| Desarrollo Front-end: dashboards de arrendador, inquilino y administrador | Semana 4 (14–20 mayo) | Completado |
| Desarrollo Back-end: motor de contratos, server actions y lógica de roles | Semana 4 (14–20 mayo) | Completado |
| Sprint 1 — corrección de errores críticos, soporte en vivo, filtro cerca de universidades | Semana 5 (21–27 mayo) | Completado |
| Sprint 2 — integración de pasarela de pagos (Culqi, modo simulado) y verificación de identidad (KYC) | Semana 6 (28 mayo–3 junio) | Completado |
| Sprint 3 — sistema de reseñas verificadas y notificaciones internas | Semana 7 (4–10 junio) | Completado |
| Sprint 4 — planes de suscripción, control de descarga de contratos en PDF, vista previa para redes sociales | Semana 8 (11–17 junio) | Completado |
| Corrección de errores de tipado, ajustes de experiencia de usuario, preparación de documentación final | Semana 9 (desde 18 junio) | En proceso |


2.2 Evidencias del avance

a) Prototipos

[INSERTAR CAPTURA: pantalla de inicio, registro, login, dashboard de arrendador, dashboard de inquilino, contrato digital y verificación KYC de la plataforma ya construida]

Figura 1. Diseño de las interfaces.

Análisis:

¿Qué funcionalidades se observan? En la pantalla de inicio se observa un buscador por distrito, universidad o dirección, filtros rápidos por tipo de propiedad (habitación, departamento, WiFi, amoblado), el precio mínimo disponible y el contador de propiedades activas, junto con sellos de confianza (propiedades verificadas, contratos seguros, soporte 24/7) y un widget de chat en vivo. En el registro, el usuario elige explícitamente su tipo de cuenta —inquilino o arrendador— antes de completar el formulario, lo que separa los dos flujos desde el primer paso. El dashboard del arrendador muestra métricas reales de gestión: ingresos del mes, propiedades ocupadas, contratos por vencer, tasa de ocupación, un semáforo de estado de pagos y las solicitudes de verificación KYC pendientes. El dashboard del inquilino resume su propiedad actual, el estado de su próximo pago, sus favoritos y su historial de pagos. La pantalla de contrato muestra el documento legal completo, con referencias explícitas a las leyes peruanas que lo respaldan, los datos de ambas partes y el estado de firma de cada una con fecha y hora. La pantalla de verificación KYC confirma cuando el perfil del inquilino queda activo y habilitado para contactar arrendadores.

¿Qué mejoras se realizaron respecto al diseño inicial? El flujo de registro se simplificó para que la elección entre inquilino y arrendador ocurra en el primer paso, evitando un formulario único que mezclara campos innecesarios para cada tipo de usuario. El panel del arrendador evolucionó de mostrar solo el listado de propiedades a incluir indicadores de gestión real (ocupación, ingresos, pagos por vencer), pensados para que el arrendador tome decisiones sin salir del panel. El proceso de verificación de identidad (KYC) se simplificó para que, una vez aprobado, el perfil quede activo de inmediato sin pasos adicionales, reduciendo la fricción de adopción en esta etapa inicial del proyecto. La pantalla de contrato se diseñó para mostrar la base legal de forma visible y directa, en lugar de dejarla solo como texto al pie, como respuesta directa a la desconfianza identificada en la investigación de mercado.

b) Desarrollo del aplicativo

[INSERTAR CAPTURA: pantalla de inicio (home) en /]
[INSERTAR CAPTURA: pantalla de login en /login]
[INSERTAR CAPTURA: pantalla de registro en /register]
[INSERTAR CAPTURA: menú/dashboard del arrendador en /landlord/dashboard]
[INSERTAR CAPTURA: menú/dashboard del inquilino en /tenant/dashboard]
[INSERTAR CAPTURA: módulo de contratos en /contracts/[id]]
[INSERTAR CAPTURA: módulo de verificación KYC en /tenant/kyc]

Figura 2. Avance del aplicativo web.

Funcionalidades desarrolladas:
- Autenticación con roles (arrendador, inquilino, administrador) y verificación en dos pasos (2FA con TOTP)
- Publicación y edición de propiedades con galería de imágenes
- Motor de contratos legales con firma digital, contrafirma y registro de auditoría inmutable
- Verificación de identidad (KYC) con carga de documento y revisión administrativa
- Pasarela de pagos en modo simulado (success fee, anuncios destacados, planes de suscripción)
- Panel administrativo completo (usuarios, propiedades, contratos, pagos, auditoría)
- Diseño responsive con experiencias dedicadas para escritorio y móvil

Herramientas utilizadas: Visual Studio Code, GitHub, Figma, Vercel (despliegue), Neon (base de datos PostgreSQL en la nube).

Tecnologías empleadas: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Prisma ORM, PostgreSQL, NextAuth v5, Zod para validaciones, hugeicons-react para iconografía, Culqi como pasarela de pagos peruana.

c) Base de datos

[INSERTAR IMAGEN 1 — Modelo entidad-relación: diagrama Mermaid generado desde prisma/schema.prisma]
[INSERTAR IMAGEN 2 — Tablas creadas: capturas del panel de Neon mostrando las tablas reales con datos]
[INSERTAR IMAGEN 3 — Diagrama de base de datos: generar en dbdiagram.io con el código DBML construido desde el schema real, mostrando cada tabla con sus columnas, tipos y líneas de relación]

Figura 3. Estructura de la base de datos.

El modelo de datos está compuesto por 9 entidades principales: User (usuarios con rol arrendador/inquilino/administrador), Property (propiedades publicadas), Contract (contratos con su ciclo de vida legal completo), Payment (pagos asociados a contratos), KYCVerification (estado de verificación de identidad), Review (reseñas verificadas post-contrato), Notification (notificaciones internas), AuditLog (registro inmutable de evidencia legal) y Session (sesiones de autenticación). Las relaciones principales son: un usuario arrendador tiene muchas propiedades; un contrato conecta una propiedad, un arrendador y un inquilino; cada contrato puede tener múltiples pagos y, como máximo, una reseña por parte.

d) Código fuente

[INSERTAR CAPTURA 1: github.com/alexisss13/habitaperu — vista raíz del repositorio mostrando la estructura de carpetas]
[INSERTAR CAPTURA 2: github.com/alexisss13/habitaperu — pestaña "Commits" mostrando el historial de cambios]

Figura 4. Organización del proyecto.

Estructura principal de carpetas:
```
app/          → rutas de Next.js (App Router): páginas públicas, paneles por rol, server actions, API routes
components/   → componentes UI reutilizables (botones, modales, paginación)
hooks/        → hooks personalizados (useResponsive para diseño adaptativo)
lib/          → lógica de negocio compartida (auth, base de datos, pagos, notificaciones)
prisma/       → esquema de base de datos y migraciones
public/       → assets estáticos (logos, imágenes)
i18n/, messages/ → internacionalización
```


3. DOCUMENTACIÓN ELABORADA


Modelo de negocio

El modelo de ingresos de Habita Perú combina varias fuentes activadas progresivamente. La primera y principal es un success fee que paga el arrendador únicamente cuando un contrato se activa (ambas partes firman) — esto alinea el incentivo de la plataforma con el resultado real, no con la simple publicación. La segunda fuente es la opción de anuncios destacados (featured listings) para que el arrendador gane visibilidad por un periodo determinado. La tercera, planes de suscripción mensual (Gratis, Pro y Business) que se introducen una vez que el arrendador ya experimentó el valor del producto con su primera propiedad.

[INSERTAR CAPTURA: tabla o diagrama del Business Model Canvas elaborado]

Segmentación de clientes

Dos segmentos primarios: el arrendador urbano de niveles socioeconómicos B y C, generalmente entre 40 y 70 años, que alquila uno o dos espacios como ingreso complementario; y el estudiante universitario que busca alojamiento cerca de su universidad cada inicio de semestre. Un segmento secundario identificado es el trabajador del corredor agroindustrial cercano a Trujillo, con contratos de alquiler más largos y estables.

Propuesta de valor

Detallada en la sección 1.4: verificación de identidad antes del contacto, contratos legales digitales con respaldo criptográfico, y un modelo de cobro que solo se activa cuando el alquiler se concreta.

Competidores

El análisis de competencia se organiza en tres categorías, ninguna de las cuales resuelve el problema central de confianza y formalización: (1) portales inmobiliarios generalistas, orientados a inmuebles de alto valor en venta y alquiler, sin foco en el segmento de cuartos y habitaciones; (2) portales de anuncios de uso general, que ofrecen alcance pero ninguna gestión del proceso posterior al contacto; (3) grupos de redes sociales y canales informales, que son hoy el canal dominante en ciudades como Trujillo pero no ofrecen ningún mecanismo de verificación, contrato ni trazabilidad.

[INSERTAR CAPTURA: tabla comparativa de competidores elaborada en la investigación de mercado]

MVP

El producto mínimo viable construido incluye: autenticación por roles, publicación y búsqueda de propiedades con filtros (incluyendo cercanía a universidades), motor completo de contratos legales digitales con firma electrónica y auditoría, verificación de identidad (KYC), sistema de pagos en modo simulado, reseñas verificadas, notificaciones y paneles administrativos para los tres roles del sistema.

Arquitectura del sistema

[INSERTAR CAPTURA: diagrama de arquitectura elaborado en la documentación técnica]

La plataforma está construida sobre Next.js 15 con App Router, TypeScript y Tailwind CSS v4 en el frontend; Prisma ORM sobre PostgreSQL (alojado en Neon) como capa de datos; NextAuth v5 para autenticación con sesiones JWT extendidas por rol; y Culqi como pasarela de pagos peruana, integrada en modo simulado mientras se completa la activación comercial. El despliegue se realiza en Vercel. La arquitectura responsive separa explícitamente la experiencia de escritorio y móvil mediante un hook de detección de ancho de pantalla, lo que permite layouts optimizados para cada contexto sin duplicar lógica de negocio.


4. DIFICULTADES PRESENTADAS


1. ¿Qué problemas encontraron?

El principal problema fue de organización del equipo: con un solo integrante a cargo de todo el desarrollo técnico y dos integrantes enfocados en investigación y análisis, el avance del producto dependía de una sola persona, mientras que las decisiones de negocio (segmentación, costos, modelo de ingresos) avanzaban en paralelo a un ritmo distinto. Esto generó momentos en los que el equipo de análisis proponía decisiones que aún no podían reflejarse en la plataforma por falta de tiempo de desarrollo, y viceversa: funcionalidades ya construidas que todavía no tenían un respaldo de investigación que confirmara que eran la prioridad correcta.

También fue un reto compatibilizar los tiempos del proyecto con la carga académica regular de cada integrante, lo que en algunas semanas obligó a replantear qué actividades eran realmente indispensables para esa etapa y cuáles podían postergarse sin afectar el avance general.

Adicionalmente, al no contar con usuarios reales en esta etapa, fue difícil validar con certeza si las decisiones tomadas en el modelo de negocio (por ejemplo, qué cobrar y cuándo) coincidían con lo que un arrendador o un inquilino real de Trujillo estarían dispuestos a aceptar.

2. ¿Qué parte del proyecto ha sido más compleja?

La parte más compleja no fue construir una funcionalidad puntual, sino mantener alineados el avance técnico y el avance de negocio durante todas las semanas del proyecto. Tomar una decisión de modelo de negocio y, en la misma semana, traducirla en un cambio real dentro de la plataforma exigió coordinación constante entre quien desarrollaba y quienes investigaban, sobre todo cuando una decisión de negocio implicaba revisar algo que ya estaba construido.

3. ¿Cómo resolvieron esos inconvenientes?

Se establecieron puntos de sincronización periódicos entre el integrante a cargo del desarrollo y el equipo de investigación y análisis, de modo que cada avance de negocio se revisara junto con su viabilidad técnica antes de darlo por definitivo. Cuando una decisión de negocio no era viable de implementar a tiempo, se priorizó simplificarla en lugar de descartarla por completo, ajustando el alcance a lo que el cronograma permitía. La carga académica se manejó redistribuyendo actividades de investigación entre las semanas con menor exigencia del curso regular.

4. ¿Qué actividades aún están pendientes?

Validar el modelo con arrendadores e inquilinos reales fuera del entorno académico, completar la documentación final del proyecto, y activar las integraciones externas que dependen de trámites fuera del control directo del equipo (registro de RUC y cuenta bancaria para la pasarela de pagos, aprobación de plantillas de mensajería por parte del proveedor de WhatsApp Business).


5. PLAN DE CONTINGENCIA


5.1 Identificación de riesgos

| Riesgo | Probabilidad | Impacto |
|---|---|---|
| Retraso en el desarrollo | Alta | Medio |
| Errores de tipado o bugs funcionales en producción | Alta | Alto |
| Pérdida de información (código o base de datos) | Media | Alto |
| Integración fallida entre módulos (pagos, contratos, KYC) | Media | Alto |
| Falta de tiempo por carga académica del equipo | Alta | Medio |
| Ausencia de un integrante en una etapa crítica | Media | Medio |
| Fallas técnicas en servicios externos (pagos, hosting) | Media | Alto |


5.2 Medidas preventivas

Riesgo: Pérdida de información
Medidas:
- Control de versiones con GitHub en cada cambio del código
- Base de datos alojada en la nube (Neon) con respaldo automático
- Documentos de negocio y planificación almacenados en la nube, no solo en equipos locales

Riesgo: Retraso en el desarrollo
Medidas:
- Cronograma semanal de actividades (ver sección 2.1)
- Distribución clara de tareas entre desarrollo técnico e investigación de negocio
- Revisión periódica de avance entre los integrantes

Riesgo: Errores de tipado o fallas técnicas
Medidas:
- Verificación continua con el compilador de TypeScript antes de cada entrega (tsc --noEmit)
- Pruebas manuales del flujo completo (publicación → contacto → contrato → pago) antes de cada sprint
- Documentación de los bugs resueltos para evitar reincidencia

Riesgo: Integración fallida entre módulos
Medidas:
- Pruebas de extremo a extremo del flujo de contrato (firma, contrafirma, activación) en modo simulado antes de activar pagos reales
- Validación de control de concurrencia (versión de propiedad) antes de cada escritura crítica


5.3 Acciones de contingencia

| Problema | Acción inmediata | Responsable |
|---|---|---|
| Error crítico del sistema en producción | Revertir al último despliegue estable en Vercel | Desarrollador (Alexis Levano) |
| Ausencia de un integrante | Redistribuir las tareas de investigación o documentación entre el resto del equipo | Líder del equipo |
| Pérdida de archivos o código | Recuperar desde el repositorio de GitHub o el respaldo de la base de datos en Neon | Equipo técnico |
| Retraso en entregas | Reprogramar actividades priorizando los módulos esenciales para la presentación | Todos los integrantes |


Escenarios críticos

Escenario 1: El aplicativo deja de funcionar antes de la presentación
Acciones:
- Restaurar la versión anterior estable desde el historial de despliegues de Vercel
- Utilizar el prototipo de Figma como respaldo de la experiencia de usuario
- Tener preparado un video demostrativo grabado previamente del flujo completo

Escenario 2: El servidor o la base de datos presenta fallas
Acciones:
- Verificar el estado del servicio de base de datos (Neon) y de hosting (Vercel)
- Restaurar desde el respaldo automático de la base de datos
- Validar la integridad de los datos (contratos, pagos, usuarios) tras la restauración

Escenario 3: Un integrante abandona el proyecto
Acciones:
- Redistribuir las actividades pendientes entre los integrantes restantes
- Priorizar los módulos esenciales para la presentación final
- Actualizar el cronograma de actividades pendientes (sección 6)


6. CRONOGRAMA DE ACTIVIDADES PENDIENTES

| Actividad | Semana 1 (18–24 jun) | Semana 2 (25 jun–1 jul) | Semana 3 (2–8 jul) | Semana 4 (9–15 jul) |
|---|---|---|---|---|
| Corrección de errores de tipado pendientes | X | | | |
| Activación de pagos en producción (Culqi) | X | X | | |
| Activación de WhatsApp Business API | | X | X | |
| Pruebas finales de extremo a extremo | | | X | |
| Corrección de errores detectados en pruebas | | | X | X |
| Preparación de la presentación final | | | | X |


7. REFLEXIÓN DEL EQUIPO

> Nota: los siguientes textos son un borrador redactado según el aporte real de cada integrante documentado en este informe. Cada persona debe revisarlos y ajustarlos con su propia voz y matices antes de la entrega final — en particular el tono personal y lo que realmente sintió o le costó, que solo cada uno puede responder con honestidad.

Alexis Levano — CEO y Desarrollador Full-stack

- ¿Cuál ha sido mi principal aporte al proyecto? El desarrollo completo de la plataforma de extremo a extremo: diseñé la arquitectura del sistema, modelé la base de datos, construí el motor de contratos legales con firma digital y auditoría, integré la verificación de identidad y la pasarela de pagos, y coordiné el avance general del equipo.
- ¿Qué competencias he desarrollado? Arquitectura full-stack (Next.js, TypeScript, Prisma, PostgreSQL), diseño de flujos con implicancia legal y de seguridad, y gestión de tiempos para sostener el desarrollo técnico mientras coordinaba las decisiones de negocio del resto del equipo.
- ¿Qué aprendí durante el desarrollo de la startup? Que mantener comunicación constante con el equipo de investigación es indispensable para no construir funcionalidades desalineadas del mercado real, y que un producto mínimo bien enfocado vale más que muchas funcionalidades a medias.
- ¿Qué mejoraría para una siguiente versión? Distribuiría parte de la carga técnica en tareas más simples (pruebas, documentación del código) con apoyo del resto del equipo, e iniciaría la validación con usuarios reales en paralelo al desarrollo desde las primeras semanas, no después de tener el producto construido.

Carlos Carrascal — Análisis Financiero y Modelo de Negocio

- ¿Cuál ha sido mi principal aporte al proyecto? La construcción del modelo de costos del proyecto, las proyecciones financieras y la estructuración del Business Model Canvas, incluyendo la definición de las fuentes de ingreso y la evaluación de la viabilidad económica del modelo por etapas.
- ¿Qué competencias he desarrollado? Modelado financiero para startups en etapa temprana y estructuración de modelos de negocio con información limitada.
- ¿Qué aprendí durante el desarrollo de la startup? Que las proyecciones financieras de un proyecto que recién se está construyendo deben ser conservadoras y ajustarse constantemente según lo que el desarrollo real permite entregar, y que cada decisión de modelo de negocio tiene una implicancia técnica directa que debe conversarse con quien desarrolla antes de darla por definitiva.
- ¿Qué mejoraría para una siguiente versión? Trabajaría con datos más cercanos al mercado real de Trujillo desde una etapa más temprana, en lugar de partir de supuestos generales.

Ruth Aquino — Investigación y Análisis de Mercado

- ¿Cuál ha sido mi principal aporte al proyecto? La investigación del problema real del mercado de alquiler informal, el análisis de la competencia existente y la validación de la propuesta de valor frente a las necesidades reales de arrendadores e inquilinos.
- ¿Qué competencias he desarrollado? Investigación de mercado, análisis competitivo y síntesis de hallazgos para que fueran útiles en decisiones de producto concretas.
- ¿Qué aprendí durante el desarrollo de la startup? Que una buena idea no es suficiente si no se valida con el mercado real, y que investigar un mercado tan informal como el del alquiler en Trujillo exige métodos distintos a los de un mercado formal.
- ¿Qué mejoraría para una siguiente versión? Iniciaría la validación con arrendadores e inquilinos reales desde semanas más tempranas del proyecto, en paralelo al desarrollo, en lugar de concentrar la investigación solo al inicio.
