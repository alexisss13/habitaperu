# Habita Perú — Flujo Financiero Real (Equipo Estudiante)
> Modelo financiero honesto para un equipo de 3 estudiantes sin capital inicial.
> El trabajo del equipo reemplaza el dinero. Esto es una ventaja, no una limitación.

---

## La realidad del equipo

**Composición:** 3 estudiantes de diseño y desarrollo de software  
**Capital disponible:** Mínimo o ninguno  
**Activo real:** Habilidades técnicas y de diseño que en el mercado costarían
S/ 8,000–15,000/mes si se contrataran externamente

```
Lo que un startup con dinero pagaría:
  → Desarrollador frontend:     S/ 3,000–4,000/mes
  → Desarrollador backend:      S/ 3,500–5,000/mes
  → Diseñador UI/UX:            S/ 2,000–3,500/mes
  → Total si contrataran todo:  S/ 8,500–12,500/mes

Lo que ustedes pagan por eso: S/ 0

Esa diferencia es su verdadera inversión — medida en horas, no en soles.
```

La pregunta correcta no es "¿cuánto dinero necesitamos?"  
sino **"¿qué podemos construir gastando lo menos posible hasta tener ingresos?"**

---

## Infraestructura a costo cero (plan real)

Todo lo siguiente existe en planes gratuitos y es suficiente para los
primeros 6–9 meses de operación real.

| Servicio | Plan gratuito | Límite gratuito | ¿Cuándo se acaba? |
|---|---|---|---|
| **Vercel** | Hobby (gratis) | 100GB bandwidth, deployments ilimitados | Cuando tengan >100k visitas/mes |
| **Neon** | Free tier | 0.5GB DB, 1 proyecto | ~500 usuarios con datos completos |
| **Cloudinary** | Free tier | 25GB storage + 25GB bandwidth | ~2,000 fotos de propiedades |
| **Resend** | Free tier | 3,000 emails/mes | ~1,000 usuarios activos |
| **Sentry** | Free tier | 5,000 errores/mes monitoreados | Suficiente para toda la Etapa 1 y 2 |
| **Cloudflare** | Free tier | CDN + protección DDoS básica | No tiene límite real |
| **GitHub** | Free (estudiantes) | Repositorios privados + Actions | Sin límite |

**Costo mensual de infraestructura en Etapa 1 y 2: S/ 0**

El único costo fijo real es el **dominio**:
- `habitaperu.pe` en NIC.pe: **S/ 60/año = S/ 5/mes**
- Alternativa temporal gratis: usar subdominio de Vercel (`habitaperu.vercel.app`)
  hasta tener el primer ingreso y comprar el dominio propio

---

## GitHub Student Developer Pack (usar esto YA)

Si tienen correo institucional universitario, tienen acceso gratuito a:

| Beneficio | Valor real |
|---|---|
| Namecheap: dominio .me gratis 1 año | $13 gratis |
| MongoDB Atlas: $200 en créditos | $200 gratis |
| DigitalOcean: $200 en créditos | $200 gratis |
| Notion: plan Plus gratis | $96/año gratis |
| Figma: plan Education gratis | $144/año gratis |
| Bootstrap Studio: licencia gratis | $29 gratis |

**Cómo acceder:** github.com/education/students  
Con correo `@upao.edu.pe`, `@unitru.edu.pe`, `@ucv.edu.pe`, etc., la aprobación
es casi inmediata.

---

## Startup Perú — financiamiento sin devolver dinero

El **Ministerio de la Producción de Perú** tiene convocatorias anuales
para emprendedores con proyectos tecnológicos:

| Programa | Monto | Requisito |
|---|---|---|
| **Startup Perú — 1ra Generación** | Hasta S/ 40,000 | Prototipo funcional + equipo |
| **Innóvate Perú** | Hasta S/ 100,000 | MVP con primeros usuarios |
| **CONCYTEC — Proyectos de Innovación** | Hasta S/ 50,000 | Proyecto universitario |

> Habita Perú califica perfectamente para Startup Perú porque:
> - Es tecnología aplicada a un problema social real (informalidad del alquiler)
> - Tiene impacto regional (Trujillo / La Libertad)
> - El equipo es universitario (criterio favorecido por los jurados)
> - Ya tienen un MVP funcional con contratos legales y KYC

**¿Cuándo postular?** La convocatoria suele abrirse en Q1 (enero–marzo) y Q3
(julio–agosto). Con el producto actual, podrían postular en la próxima
convocatoria con alta probabilidad de aprobación.

**Enlace de referencia:** startupperu.pe y innovateperu.gob.pe

---

## Incubadoras universitarias en Trujillo (gratuitas)

Las siguientes instituciones ofrecen mentoría, espacio de trabajo y en
algunos casos financiamiento sin costo ni equity para estudiantes:

| Institución | Programa | Beneficio |
|---|---|---|
| **UPAO** | Centro de Emprendimiento e Innovación | Mentoría + espacio físico |
| **UNT** | CITE Tecnológico | Red de contactos empresariales locales |
| **UCV** | Incubadora de Empresas UCV | Acceso a red de alumni y empresas |
| **UPN** | Centro de Innovación y Emprendimiento | Mentores con experiencia real |

Cualquiera de estas puede dar acceso a abogados que revisen los contratos
sin costo, contadores para la declaración tributaria inicial, y mentores
con red de contactos en el sector inmobiliario de Trujillo.

---

## Costos reales por etapa (modelo estudiante)

### Etapa 1 — Meses 0 a 3: Costo casi cero

| Concepto | Costo |
|---|---|
| Infraestructura (free tiers) | S/ 0 |
| Dominio (opcional, pueden usar vercel.app) | S/ 0–60 |
| Marketing (Facebook groups, outreach manual) | S/ 0 |
| Legal (mediante incubadora universitaria) | S/ 0 |
| Culqi (sin transacciones aún) | S/ 0 |
| **Total Etapa 1** | **S/ 0–60 en 3 meses** |

**Inversión real de Etapa 1: su tiempo.**  
Estimado: 15–20 horas/semana por persona = 180–240 horas totales del equipo
en 3 meses. Eso es lo que se "invierte" en esta etapa.

---

### Etapa 2 — Meses 3 a 6: Primer dinero que entra

Los primeros ingresos cubren los primeros costos. El orden es:

```
Primer ingreso (success fee o featured) → comprar dominio propio
Segundo ingreso → formalizar RUC persona natural con negocio
Tercer mes con ingresos → evaluar Vercel Pro si el tráfico lo exige
```

| Concepto | Costo | Se paga con... |
|---|---|---|
| Dominio habitaperu.pe | S/ 60/año | Primer featured listing cobrado |
| RUC persona natural (SUNAT) | S/ 0 | Gratis, solo trámite online |
| Culqi (fees por transacción) | Solo cuando cobran | El mismo pago del usuario |
| **Total de bolsillo Etapa 2** | **S/ 60–100** | Cubierto por primeros ingresos |

**Importante sobre Culqi sin empresa formal:**  
Culqi acepta personas naturales con negocio (RUC 10xxxxxxxx) para cuentas
de bajo volumen. No necesitan constituir una empresa hasta que el volumen
lo justifique (generalmente cuando superen S/2,000–3,000/mes en cobros).

---

### Etapa 3 — Meses 6 a 12: Reinvertir lo que entra

En esta etapa los ingresos ya existen. La regla es simple:
**nunca gastar más de lo que entra ese mes.**

| Concepto | Costo mensual | Cuándo activar |
|---|---|---|
| Vercel Pro | S/ 75 | Solo si superan 100k visitas/mes |
| Neon paid | S/ 75 | Solo si la DB supera 0.5GB |
| Marketing en ads | S/ 200–400 | Solo cuando MRR > S/ 800 |
| Contador (declaración SUNAT) | S/ 150 | Cuando empiecen a tener ingresos regulares |
| WhatsApp Business API | S/ 0–65 | Free tier alcanza para los primeros 1,000 mensajes |
| **Total Etapa 3 (real)** | **S/ 0–765** | Activar gradualmente según ingresos |

**Regla de oro para equipo sin capital:**
```
No actives un servicio de pago hasta que los ingresos de ese mes
puedan cubrirlo con el 50% de lo recaudado.
Ejemplo: Si MRR es S/ 400, no gastes más de S/ 200 en infraestructura.
El otro S/ 200 queda como colchón.
```

---

## Proyección financiera ajustada (sin inversión inicial)

| Mes | Ingresos | Gastos reales | Flujo | Acumulado |
|---|---|---|---|---|
| 1 | S/ 0 | S/ 0 | S/ 0 | S/ 0 |
| 2 | S/ 0 | S/ 0 | S/ 0 | S/ 0 |
| 3 | S/ 0 | S/ 0 | S/ 0 | S/ 0 |
| 4 | S/ 150 | S/ 60 | +S/ 90 | +S/ 90 |
| 5 | S/ 300 | S/ 100 | +S/ 200 | +S/ 290 |
| 6 | S/ 500 | S/ 150 | +S/ 350 | +S/ 640 |
| 7 | S/ 800 | S/ 300 | +S/ 500 | +S/ 1,140 |
| 8 | S/ 1,100 | S/ 450 | +S/ 650 | +S/ 1,790 |
| 9 | S/ 1,500 | S/ 600 | +S/ 900 | +S/ 2,690 |
| 10 | S/ 2,000 | S/ 750 | +S/ 1,250 | +S/ 3,940 |
| 11 | S/ 2,500 | S/ 900 | +S/ 1,600 | +S/ 5,540 |
| 12 | S/ 3,200 | S/ 1,100 | +S/ 2,100 | +S/ 7,640 |

> **La diferencia clave con el modelo anterior:** no hay déficit.
> El modelo estudiante con free tiers y sin personal pagado
> es rentable desde el primer ingreso porque los costos son
> casi cero al inicio.

---

## Lo que sí cuesta dinero y no se puede evitar

Hay tres cosas que eventualmente requieren dinero real.
Ninguna es urgente en los primeros meses.

### 1. Revisión legal del contrato generado — S/ 300–600 (una sola vez)

Este es el único gasto que NO se puede postergar indefinitamente.
Si el contrato tiene un error legal que lo hace no ejecutable,
todo el valor del producto se cae.

**Cómo hacerlo sin pagar o pagando mínimo:**
- Clínica jurídica de UNT o UPAO — revisión gratuita para proyectos estudiantiles
- Abogado conocido o familiar que practique derecho civil — favor o costo mínimo
- Colegio de Abogados de La Libertad — tienen servicios de consulta a bajo costo

**Cuándo hacerlo:** Antes de firmar el primer contrato real con usuarios reales.
No antes — no tiene sentido pagar por revisar algo que aún pueden cambiar.

### 2. Constitución de empresa — S/ 500–800 (cuando MRR > S/ 2,000)

Hasta ese momento pueden operar como personas naturales con negocio (RUC 10).
La empresa formal (SAC, EIRL) solo es necesaria cuando:
- Culqi pide cuenta empresarial por volumen
- Quieren postular a Startup Perú (que sí requiere empresa)
- Los ingresos superan el umbral donde conviene tributar como empresa

**Cómo abaratar:** SUNARP tiene el proceso de constitución en línea
por S/ 40–80 en notaría digital. Mucho más barato que el proceso
tradicional con notaría física (S/ 500–1,500).

### 3. Registro de marca en Indecopi — S/ 580 (cuando tengan tracción)

No es urgente hasta que haya riesgo real de que alguien más use el nombre.
En Etapa 1 y 2, el riesgo es bajo. Postergarlo hasta el mes 8–10.

---

## Distribución del equipo (sin dinero, con roles)

Con 3 personas sin presupuesto, la distribución del trabajo
define la velocidad del proyecto.

| Rol | Responsabilidad principal | Tiempo estimado |
|---|---|---|
| **Dev backend / fullstack** | API, base de datos, server actions, seguridad | 15–20 hrs/semana |
| **Dev frontend / UI** | Componentes, páginas, responsive, animaciones | 15–20 hrs/semana |
| **Diseño + Marketing** | UI/UX, contenido para redes, outreach a landlords, soporte inicial | 10–15 hrs/semana |

**El rol de "marketing y ventas" es igual de crítico que el técnico.**
Un producto perfecto sin usuarios es un hobby, no un negocio.
La persona de diseño debería dedicar al menos 40% de su tiempo a
conseguir los primeros 50 landlords en Trujillo — en persona, por
WhatsApp, en grupos de Facebook, en campus universitarios.

---

## Hoja de ruta financiera semana a semana (primeros 3 meses)

### Semana 1–2: Preparación gratuita
```
✓ Registrar cuenta en Vercel (Hobby, gratis)
✓ Crear base de datos en Neon (free tier)
✓ Activar GitHub Student Pack (correo universitario)
✓ Registrar RUC como persona natural en SUNAT (online, gratis)
✓ Crear cuenta en Culqi en modo TEST (gratis, sin necesidad de empresa)
✓ Acercarse a la incubadora de su universidad
```

### Semana 3–8: Construcción y primeros usuarios
```
✓ Corregir bugs críticos del producto actual (los errores Zod ya vistos)
✓ Conseguir los primeros 10 landlords en Trujillo manualmente
  → Buscar en grupos de Facebook "Alquiler Trujillo"
  → Contactar arrendadores en OLX Trujillo
  → Hablar con gente que conozcan que alquile
✓ Onboardear a esos 10 landlords en persona (WhatsApp + videollamada)
✓ Publicar sus primeras 10 propiedades en la plataforma
```

### Semana 9–12: Primeros contratos
```
✓ Conseguir los primeros tenants (estudiantes que buscan cuarto)
  → Grupos de Facebook universitarios
  → Volantes en campus de UNT/UCV/UPAO
✓ Acompañar de cerca el primer contrato completo (de principio a fin)
✓ Recoger feedback directo de landlord y tenant post-contrato
✓ Activar Culqi en modo PRODUCCIÓN cuando el primer contrato esté listo
✓ Cobrar el primer success fee
```

---

## El verdadero costo: el tiempo del equipo

La única "deuda" que están contrayendo es de tiempo, no de dinero.

```
Horas estimadas por persona en el primer año:
  → Año 1: ~800 horas/persona (15–20 hrs/semana × 52 semanas)
  → Total equipo: ~2,400 horas

Valorizado a tarifa de mercado junior en Perú (S/ 25–35/hora):
  → Valor económico del trabajo: S/ 60,000–84,000

Eso es lo que están "invirtiendo" — no dinero en efectivo.
Y si el negocio funciona, el retorno es muchas veces eso.
Si no funciona, tienen un proyecto de portfolio de nivel senior
que les abrirá puertas laborales de todas formas.
```

---

## Conclusión para equipo estudiante

**No necesitan dinero para empezar. Necesitan:**

1. **Una semana** para corregir los bugs actuales y dejar el producto estable
2. **Dos semanas** para conseguir los primeros 10 landlords en Trujillo
3. **Un mes** para cerrar los primeros 3 contratos reales
4. **Postular a Startup Perú** en la próxima convocatoria con el MVP funcionando

El modelo financiero anterior (S/ 10,000–12,000) era para un equipo
que necesita pagar desarrolladores, diseñadores y marketing. Ustedes
son ese equipo. Su ventaja competitiva no es el capital, es que pueden
construir, diseñar y vender al mismo tiempo sin pagarle a nadie.

La única regla financiera que importa ahora mismo:
**"No gasten un sol hasta que hayan cobrado el primero."**

---

*Actualizado el 2026-06-04 para equipo de 3 estudiantes sin capital inicial.*
*Los costos de infraestructura asumen uso exclusivo de free tiers hasta mes 6.*
