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
| Carlos Carrascal | Investigación y Análisis de Mercado | Investigación del problema, análisis de la competencia (portales inmobiliarios y canales informales), segmentación de clientes, validación de la propuesta de valor. |
| Ruth Aquino | Análisis Financiero y Modelo de Negocio | Modelo de costos del proyecto, proyecciones financieras, evaluación de viabilidad económica por etapas, estructuración del Business Model Canvas. |

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

| Semana | Periodo | Actividad | Estado |
|---|---|---|---|
| Semana 1 | 23–29 abril | Investigación del problema y validación inicial con arrendadores de Trujillo | Completado |
| Semana 2 | 30 abril–6 mayo | Diseño de wireframes y definición del Business Model Canvas | Completado |
| Semana 3 | 7–13 mayo | Modelado de base de datos (Prisma) y configuración de autenticación (NextAuth) | Completado |
| Semana 4 | 14–20 mayo | Desarrollo del MVP base: dashboards de arrendador, inquilino y administrador | Completado |
| Semana 5 | 21–27 mayo | Sprint 1 — corrección de errores críticos, integración de soporte en vivo, filtro de búsqueda cerca de universidades | Completado |
| Semana 6 | 28 mayo–3 junio | Sprint 2 — integración de pasarela de pagos (Culqi, modo simulado) y motor de verificación de identidad (KYC) | Completado |
| Semana 7 | 4–10 junio | Sprint 3 — sistema de reseñas verificadas y notificaciones internas | Completado |
| Semana 8 | 11–17 junio | Sprint 4 — planes de suscripción, control de descarga de contratos en PDF, datos de vista previa para redes sociales (Open Graph) | Completado |
| Semana 9 (actual) | 18 junio en adelante | Corrección de errores de tipado, ajustes de experiencia de usuario en la página principal, preparación de documentación final | En proceso |


2.2 Evidencias del avance

a) Prototipos

[INSERTAR CAPTURA: wireframes o diseños de Figma del flujo de búsqueda de propiedad, publicación de inmueble y firma de contrato]

Figura 1. Diseño de las interfaces.

Análisis (completar con la captura insertada):
- ¿Qué funcionalidades se observan? Describir el flujo visible: búsqueda con filtros, tarjeta de propiedad, formulario de publicación, pantalla de contrato.
- ¿Qué mejoras se realizaron respecto al diseño inicial? Por ejemplo: simplificación del formulario de publicación de 6 a 4 pasos, ajuste del flujo de verificación de identidad para reducir abandono.

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

[INSERTAR IMAGEN: diagrama entidad-relación generado desde prisma/schema.prisma, o captura de las tablas en el panel de Neon]

Figura 3. Estructura de la base de datos.

El modelo de datos está compuesto por 9 entidades principales: User (usuarios con rol arrendador/inquilino/administrador), Property (propiedades publicadas), Contract (contratos con su ciclo de vida legal completo), Payment (pagos asociados a contratos), KYCVerification (estado de verificación de identidad), Review (reseñas verificadas post-contrato), Notification (notificaciones internas), AuditLog (registro inmutable de evidencia legal) y Session (sesiones de autenticación). Las relaciones principales son: un usuario arrendador tiene muchas propiedades; un contrato conecta una propiedad, un arrendador y un inquilino; cada contrato puede tener múltiples pagos y, como máximo, una reseña por parte.

d) Código fuente

[INSERTAR CAPTURA: vista del repositorio en GitHub mostrando commits y estructura de carpetas]

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

Durante el desarrollo aparecieron errores de tipado en TypeScript en los módulos de contratos administrativos y de inquilino, generados por inconsistencias entre los tipos de fecha (Date vs string) al pasar datos del servidor al cliente. También se identificó un error funcional en el flujo de actualización de plan de suscripción: el enlace que debía abrir automáticamente el modal de mejora de plan (?upgrade=true) no funcionaba porque ningún componente intermedio leía ese parámetro de la URL, a pesar de que el enlace ya existía en la interfaz. Adicionalmente, la página de detalle de propiedad sin prefijo de idioma no generaba metadatos de vista previa (Open Graph), por lo que al compartir un enlace de propiedad en WhatsApp o redes sociales no se mostraba la imagen ni el precio.

A nivel de equipo, el principal reto fue de coordinación: con un solo integrante a cargo de todo el desarrollo técnico y tres integrantes enfocados en investigación y análisis, fue necesario sincronizar los tiempos para que los hallazgos de mercado (segmentación, costos, modelo de negocio) se tradujeran oportunamente en decisiones de producto concretas.

2. ¿Qué parte del proyecto ha sido más compleja?

El motor de contratos legales: gestionar el ciclo de vida completo de un contrato (borrador, firma del inquilino, contrafirma del arrendador, activación, posible incumplimiento) requiere control de concurrencia para evitar que una propiedad se arriende dos veces al mismo tiempo, además de un registro de auditoría inmutable que sirva como evidencia legal del proceso de firma. La integración de la pasarela de pagos también exigió cuidado adicional para evitar cobros duplicados ante doble clic o reintentos de red.

3. ¿Cómo resolvieron esos inconvenientes?

Los errores de tipado se resolvieron revisando sistemáticamente la salida del compilador de TypeScript (tsc --noEmit) y normalizando los tipos de fecha en la frontera entre servidor y cliente. El bug del flujo de actualización de plan se corrigió pasando el parámetro de la URL como prop a través de toda la cadena de componentes (página → vista → componente de escritorio/móvil) hasta el punto donde se controla la apertura del modal. El problema de control de concurrencia en contratos se resolvió con un campo de versión en la propiedad que se valida antes de cada escritura.

4. ¿Qué actividades aún están pendientes?

Activar la pasarela de pagos en modo producción (requiere RUC y cuenta bancaria registrados en Culqi), activar la API de WhatsApp Business para notificaciones automáticas (requiere aprobación de plantillas de mensaje por parte de Meta), corregir dos errores de tipado menores que persisten en módulos administrativos de contratos, y construir la aplicación móvil nativa contemplada en el roadmap de expansión.


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
- Documentación de los bugs resueltos para evitar reincidencia (ver sección 4)

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

[PLACEHOLDER — cada integrante debe completar su propia media página respondiendo, en primera persona, las siguientes preguntas. No reemplazar este contenido por texto genérico: debe reflejar la experiencia real de cada persona en el proyecto.]

Preguntas guía para cada integrante:
- ¿Cuál ha sido mi principal aporte al proyecto?
- ¿Qué competencias he desarrollado?
- ¿Qué aprendí durante el desarrollo de la startup?
- ¿Qué mejoraría para una siguiente versión?

[ESPACIO PARA: Alexis Levano — CEO y Desarrollador Full-stack]


[ESPACIO PARA: Carlos Carrascal — Investigación y Análisis de Mercado]


[ESPACIO PARA: Ruth Aquino — Análisis Financiero y Modelo de Negocio]
