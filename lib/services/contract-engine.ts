/**
 * lib/services/contract-engine.ts
 *
 * Motor Legal Criptográfico — Habita Perú
 * Genera contratos de arrendamiento con validez jurídica peruana,
 * interpola cláusulas de Ley 30201 y Ley 30933, y produce el hash
 * SHA-256 del documento para el Audit Trail (Clickwrap Agreement).
 *
 * Ley 29733 — los datos del DNI se reciben ya desencriptados en esta capa
 * de servicio; la encriptación en reposo es responsabilidad de la capa de DB.
 */

import { createHash } from "crypto"
import { z } from "zod"

// ─────────────────────────────────────────────────────────────────────────────
// Schemas de validación Zod (modo estricto)
// ─────────────────────────────────────────────────────────────────────────────

const PartySchema = z.object({
  fullName: z.string().min(3, "Nombre completo requerido"),
  dni: z.string().regex(/^\d{8}$/, "DNI debe tener exactamente 8 dígitos"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  address: z.string().min(5, "Dirección requerida"),
  district: z.string().min(2, "Distrito requerido"),
})

const PropertyDataSchema = z.object({
  id: z.string().cuid("ID de propiedad inválido"),
  address: z.string().min(5, "Dirección de propiedad requerida"),
  district: z.string().min(2, "Distrito requerido"),
  type: z.enum(["HABITACION", "DEPARTAMENTO", "CASA", "OFICINA", "LOCAL"]),
  area: z.number().positive("Área debe ser positiva").optional(),
  rooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
})

export const ContractDataSchema = z.object({
  contractId: z.string().cuid("ID de contrato inválido"),
  landlord: PartySchema,
  tenant: PartySchema,
  property: PropertyDataSchema,
  monthlyRent: z.number().positive("Renta mensual debe ser positiva"),
  currency: z.enum(["PEN", "USD"]).default("PEN"),
  deposit: z.number().positive("Depósito debe ser positivo"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  paymentDay: z.number().int().min(1).max(31),
  paymentAccount: z.object({
    provider: z.enum(["Niubiz", "Culqi", "Izipay", "BCP", "Interbank", "BBVA"]),
    accountNumber: z.string().min(4, "Número de cuenta requerido"),
    accountHolder: z.string().min(3, "Titular de cuenta requerido"),
  }),
})

export type ContractData = z.infer<typeof ContractDataSchema>

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades de formato
// ─────────────────────────────────────────────────────────────────────────────

function formatDateLima(date: Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

function formatCurrency(amount: number, currency: "PEN" | "USD"): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function ordinalDay(day: number): string {
  if (day === 1) return "primer"
  if (day === 2) return "segundo"
  if (day === 3) return "tercer"
  return `${day}°`
}

// ─────────────────────────────────────────────────────────────────────────────
// generatePeruvianLeaseAgreement
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Genera el HTML completo del contrato de arrendamiento con validez jurídica
 * peruana. Incluye cláusulas obligatorias de:
 *  - Ley N° 30201 (Allanamiento Futuro)
 *  - Ley N° 30933 (Desalojo Notarial Exprés)
 *  - Ley N° 29733 (Protección de Datos Personales)
 *
 * El HTML resultante es el documento exacto que se hashea y se muestra al
 * usuario antes de firmar (Clickwrap Agreement).
 */
export function generatePeruvianLeaseAgreement(data: ContractData): string {
  const validated = ContractDataSchema.parse(data)

  const {
    contractId,
    landlord,
    tenant,
    property,
    monthlyRent,
    currency,
    deposit,
    startDate,
    endDate,
    paymentDay,
    paymentAccount,
  } = validated

  const rentFormatted = formatCurrency(monthlyRent, currency)
  const depositFormatted = formatCurrency(deposit, currency)
  const startFormatted = formatDateLima(startDate)
  const endFormatted = formatDateLima(endDate)
  const todayFormatted = formatDateLima(new Date())
  const paymentDayOrdinal = ordinalDay(paymentDay)

  const propertyTypeLabels: Record<string, string> = {
    HABITACION: "habitación",
    DEPARTAMENTO: "departamento",
    CASA: "casa",
    OFICINA: "oficina",
    LOCAL: "local comercial",
  }
  const propertyTypeLabel = propertyTypeLabels[property.type] ?? property.type

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contrato de Arrendamiento — Habita Perú — ${contractId}</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; color: #1a1a1a; margin: 40px; }
    h1 { text-align: center; font-size: 16pt; text-transform: uppercase; letter-spacing: 1px; }
    h2 { font-size: 13pt; text-transform: uppercase; margin-top: 24px; border-bottom: 1px solid #333; padding-bottom: 4px; }
    .clause { margin: 16px 0; text-align: justify; }
    .clause-number { font-weight: bold; }
    .parties-table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    .parties-table td { padding: 6px 10px; border: 1px solid #ccc; vertical-align: top; }
    .parties-table th { background: #f0f0f0; padding: 6px 10px; border: 1px solid #ccc; text-align: left; }
    .legal-notice { background: #fff8e1; border-left: 4px solid #f59e0b; padding: 10px 14px; margin: 16px 0; font-size: 10pt; }
    .signature-block { margin-top: 48px; display: flex; justify-content: space-between; }
    .signature-line { border-top: 1px solid #333; width: 220px; text-align: center; padding-top: 6px; font-size: 10pt; }
    .footer { margin-top: 32px; font-size: 9pt; color: #666; text-align: center; border-top: 1px solid #ccc; padding-top: 8px; }
    .hash-block { font-family: monospace; font-size: 9pt; background: #f5f5f5; padding: 8px; word-break: break-all; margin-top: 8px; }
  </style>
</head>
<body>

<h1>Contrato de Arrendamiento de Inmueble</h1>
<p style="text-align:center; font-size:10pt;">
  Documento N° <strong>${contractId}</strong> — Generado el ${todayFormatted}<br/>
  Plataforma: <strong>Habita Perú</strong> — Motor LegalTech v1.0
</p>

<div class="legal-notice">
  <strong>AVISO LEGAL:</strong> El presente contrato ha sido generado electrónicamente por la plataforma Habita Perú
  y tiene plena validez jurídica conforme a la Ley N° 27269 (Firmas y Certificados Digitales),
  Ley N° 30201 (Allanamiento Futuro), Ley N° 30933 (Desalojo Notarial Exprés) y
  Ley N° 29733 (Protección de Datos Personales). El hash SHA-256 de este documento
  constituye prueba de integridad e inmutabilidad del Audit Trail digital.
</div>

<h2>I. Partes Contratantes</h2>

<table class="parties-table">
  <tr>
    <th>Rol</th>
    <th>Datos del Arrendador (PROPIETARIO)</th>
  </tr>
  <tr>
    <td><strong>Arrendador</strong></td>
    <td>
      <strong>Nombre completo:</strong> ${landlord.fullName}<br/>
      <strong>DNI:</strong> ${landlord.dni}<br/>
      <strong>Email:</strong> ${landlord.email}<br/>
      <strong>Teléfono:</strong> ${landlord.phone}<br/>
      <strong>Domicilio:</strong> ${landlord.address}, ${landlord.district}
    </td>
  </tr>
  <tr>
    <th>Rol</th>
    <th>Datos del Arrendatario (INQUILINO)</th>
  </tr>
  <tr>
    <td><strong>Arrendatario</strong></td>
    <td>
      <strong>Nombre completo:</strong> ${tenant.fullName}<br/>
      <strong>DNI:</strong> ${tenant.dni}<br/>
      <strong>Email:</strong> ${tenant.email}<br/>
      <strong>Teléfono:</strong> ${tenant.phone}<br/>
      <strong>Domicilio:</strong> ${tenant.address}, ${tenant.district}
    </td>
  </tr>
</table>

<h2>II. Objeto del Contrato</h2>

<div class="clause">
  <span class="clause-number">CLÁUSULA 2.1.</span> El ARRENDADOR da en arrendamiento al ARRENDATARIO
  el inmueble de tipo <strong>${propertyTypeLabel}</strong> ubicado en
  <strong>${property.address}, ${property.district}</strong>
  ${property.area ? `, con un área aproximada de <strong>${property.area} m²</strong>` : ""},
  compuesto por <strong>${property.rooms} habitación(es)</strong> y
  <strong>${property.bathrooms} baño(s)</strong>,
  identificado en la plataforma Habita Perú con el código <strong>${property.id}</strong>.
</div>

<div class="clause">
  <span class="clause-number">CLÁUSULA 2.2.</span> El inmueble se destinará exclusivamente al uso
  <strong>residencial/habitacional</strong>, quedando expresamente prohibido su uso para actividades
  comerciales, industriales o contrarias a las leyes peruanas vigentes.
</div>

<h2>III. Plazo del Arrendamiento</h2>

<div class="clause">
  <span class="clause-number">CLÁUSULA 3.1.</span> El presente contrato tendrá una vigencia desde el
  <strong>${startFormatted}</strong> hasta el <strong>${endFormatted}</strong>, ambas fechas inclusive.
  Al vencimiento del plazo, el contrato no se renovará automáticamente salvo acuerdo escrito entre las partes.
</div>

<h2>IV. Renta Mensual y Condiciones de Pago</h2>

<div class="clause">
  <span class="clause-number">CLÁUSULA 4.1.</span> La renta mensual pactada es de
  <strong>${rentFormatted} (${currency})</strong>, pagadera por adelantado a más tardar el
  <strong>${paymentDayOrdinal} día calendario de cada mes</strong>.
</div>

<div class="clause">
  <span class="clause-number">CLÁUSULA 4.2.</span> El pago deberá realizarse mediante transferencia
  electrónica a través del proveedor <strong>${paymentAccount.provider}</strong>,
  a la cuenta N° <strong>${paymentAccount.accountNumber}</strong>
  a nombre de <strong>${paymentAccount.accountHolder}</strong>.
  El comprobante de pago deberá ser cargado en la plataforma Habita Perú dentro de las
  24 horas siguientes al pago.
</div>

<div class="clause">
  <span class="clause-number">CLÁUSULA 4.3. — GARANTÍA:</span> El ARRENDATARIO entrega en este acto
  la suma de <strong>${depositFormatted} (${currency})</strong> como depósito de garantía,
  equivalente a la renta mensual pactada. Dicho depósito será devuelto al término del contrato,
  previa inspección del inmueble y deducción de los daños que correspondan.
</div>

<h2>V. Cláusula de Allanamiento Futuro — Ley N° 30201</h2>

<div class="legal-notice">
  <strong>CLÁUSULA OBLIGATORIA — LEY N° 30201:</strong> Conforme a lo establecido en la
  Ley N° 30201, Ley que crea el Registro de Deudores Judiciales Morosos, y sus modificatorias,
  las partes acuerdan expresamente la cláusula de allanamiento futuro a efectos de facilitar
  la recuperación del inmueble en caso de incumplimiento.
</div>

<div class="clause">
  <span class="clause-number">CLÁUSULA 5.1.</span> El ARRENDATARIO, en pleno ejercicio de su
  capacidad jurídica y sin mediar coacción alguna, se somete expresamente al proceso de
  <strong>desalojo express</strong> previsto en la Ley N° 30201 y la Ley N° 30933,
  reconociendo que ante el incumplimiento de las obligaciones establecidas en el presente
  contrato, el ARRENDADOR podrá iniciar el procedimiento de desalojo notarial sin necesidad
  de proceso judicial ordinario.
</div>

<div class="clause">
  <span class="clause-number">CLÁUSULA 5.2.</span> El ARRENDATARIO declara conocer y aceptar que
  el presente contrato, junto con el Audit Trail digital generado por la plataforma Habita Perú
  (que incluye dirección IP, User-Agent, timestamp ISO 8601 en UTC-5 Lima, ID de sesión y
  hash SHA-256 del documento), constituye prueba suficiente de la existencia y términos del
  arrendamiento para los efectos de la Ley N° 30201.
</div>

<div class="clause">
  <span class="clause-number">CLÁUSULA 5.3.</span> Las partes acuerdan que el presente instrumento
  tiene mérito ejecutivo y que la firma digital registrada en la plataforma Habita Perú,
  conforme a la Ley N° 27269 (Ley de Firmas y Certificados Digitales), equivale a la firma
  manuscrita para todos los efectos legales.
</div>

<h2>VI. Desalojo Notarial Exprés — Ley N° 30933</h2>

<div class="clause">
  <span class="clause-number">CLÁUSULA 6.1.</span> Conforme a la <strong>Ley N° 30933</strong>
  (Ley que regula el Procedimiento Especial de Desalojo con Intervención Notarial), las partes
  acuerdan que ante el incumplimiento del pago de la renta por
  <strong>dos (2) meses consecutivos</strong>, el ARRENDADOR queda facultado para iniciar
  el procedimiento de desalojo notarial exprés sin necesidad de proceso judicial.
</div>

<div class="clause">
  <span class="clause-number">CLÁUSULA 6.2.</span> El cómputo del incumplimiento se realizará
  conforme a los registros de pago de la plataforma Habita Perú, los cuales constituyen
  prueba fehaciente del estado de los pagos. La cuenta de abono designada para verificar
  los pagos es la indicada en la Cláusula 4.2 del presente contrato
  (${paymentAccount.provider} — N° ${paymentAccount.accountNumber}).
</div>

<div class="clause">
  <span class="clause-number">CLÁUSULA 6.3.</span> Ante el segundo mes de impago, el ARRENDADOR
  notificará al ARRENDATARIO mediante carta notarial al domicilio consignado en el presente
  contrato y al correo electrónico registrado en la plataforma Habita Perú
  (${tenant.email}), otorgándole un plazo de <strong>quince (15) días calendario</strong>
  para regularizar los pagos o desocupar el inmueble.
</div>

<h2>VII. Obligaciones del Arrendatario</h2>

<div class="clause">
  <span class="clause-number">CLÁUSULA 7.1.</span> El ARRENDATARIO se obliga a:
  <ol>
    <li>Pagar puntualmente la renta mensual en la fecha y forma pactadas.</li>
    <li>Conservar el inmueble en buen estado, respondiendo por los daños causados por su culpa o negligencia.</li>
    <li>No subarrendar ni ceder el uso del inmueble sin autorización escrita del ARRENDADOR.</li>
    <li>Permitir al ARRENDADOR inspeccionar el inmueble con previo aviso de 48 horas.</li>
    <li>Restituir el inmueble al término del contrato en las mismas condiciones en que lo recibió.</li>
    <li>Pagar los servicios de agua, luz, gas e internet a su cargo.</li>
  </ol>
</div>

<h2>VIII. Obligaciones del Arrendador</h2>

<div class="clause">
  <span class="clause-number">CLÁUSULA 8.1.</span> El ARRENDADOR se obliga a:
  <ol>
    <li>Entregar el inmueble en condiciones habitables y con todos los servicios operativos.</li>
    <li>Garantizar el uso pacífico del inmueble durante la vigencia del contrato.</li>
    <li>Realizar las reparaciones estructurales que no sean responsabilidad del ARRENDATARIO.</li>
    <li>Devolver el depósito de garantía dentro de los 30 días siguientes a la restitución del inmueble.</li>
  </ol>
</div>

<h2>IX. Protección de Datos Personales — Ley N° 29733</h2>

<div class="clause">
  <span class="clause-number">CLÁUSULA 9.1.</span> Conforme a la <strong>Ley N° 29733</strong>
  (Ley de Protección de Datos Personales) y su Reglamento (D.S. N° 003-2013-JUS), las partes
  autorizan expresamente a la plataforma Habita Perú a tratar sus datos personales
  (incluyendo DNI, datos de contacto y biométricos) exclusivamente para los fines del
  presente contrato y la gestión de la relación arrendaticia.
</div>

<div class="clause">
  <span class="clause-number">CLÁUSULA 9.2.</span> Los datos personales serán almacenados con
  encriptación en reposo y en tránsito, y no serán cedidos a terceros sin consentimiento
  expreso, salvo requerimiento de autoridad competente.
</div>

<h2>X. Jurisdicción y Ley Aplicable</h2>

<div class="clause">
  <span class="clause-number">CLÁUSULA 10.1.</span> Para cualquier controversia derivada del
  presente contrato, las partes se someten a la jurisdicción de los Juzgados y Tribunales
  de la ciudad de <strong>Lima, Perú</strong>, renunciando expresamente a cualquier otro
  fuero que pudiera corresponderles.
</div>

<div class="clause">
  <span class="clause-number">CLÁUSULA 10.2.</span> El presente contrato se rige por las leyes
  de la República del Perú, en particular por el Código Civil (artículos 1666 al 1712),
  la Ley N° 30201, la Ley N° 30933 y la Ley N° 29733.
</div>

<h2>XI. Firmas Digitales y Audit Trail</h2>

<div class="clause">
  <span class="clause-number">CLÁUSULA 11.1.</span> Las firmas digitales de las partes,
  registradas en la plataforma Habita Perú con los metadatos de Audit Trail
  (IP, User-Agent, Timestamp UTC-5, Session ID, Hash SHA-256), tienen plena validez
  jurídica conforme a la Ley N° 27269 y constituyen prueba de la aceptación libre,
  voluntaria e informada de todos los términos del presente contrato.
</div>

<div class="footer">
  <p>Contrato generado electrónicamente por <strong>Habita Perú</strong> — Motor LegalTech v1.0</p>
  <p>ID de Contrato: ${contractId} | Fecha de generación: ${todayFormatted}</p>
  <p>Este documento tiene validez jurídica conforme a Ley N° 27269, Ley N° 30201, Ley N° 30933 y Ley N° 29733.</p>
  <p>El bloque de firmas electrónicas y el sello de integridad SHA-256 se muestran a continuación de este documento.</p>
</div>

</body>
</html>`
}

// ─────────────────────────────────────────────────────────────────────────────
// createDocumentHash
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Genera el sello criptográfico SHA-256 del HTML del contrato.
 *
 * El hash se calcula sobre el contenido HTML normalizado (sin BOM, sin CRLF).
 * Este hash es el que se almacena en `Contract.documentHash` y en cada
 * `AuditLog.cryptoHash`, garantizando que el documento no fue alterado
 * entre la visualización y la firma.
 *
 * @param htmlContent - HTML completo generado por generatePeruvianLeaseAgreement
 * @returns Hash SHA-256 en formato hexadecimal (64 caracteres)
 */
export function createDocumentHash(htmlContent: string): string {
  // Normalizar: eliminar BOM y convertir CRLF a LF para consistencia cross-platform
  const normalized = htmlContent
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .trim()

  return createHash("sha256").update(normalized, "utf8").digest("hex")
}

// ─────────────────────────────────────────────────────────────────────────────
// generateAndHashContract
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Función de conveniencia que genera el HTML del contrato y calcula su hash
 * en una sola operación atómica, garantizando que el hash corresponde
 * exactamente al HTML retornado.
 *
 * @returns { html, hash } — el HTML del contrato y su hash SHA-256
 */
export function generateAndHashContract(data: ContractData): {
  html: string
  hash: string
} {
  const html = generatePeruvianLeaseAgreement(data)
  const hash = createDocumentHash(html)
  return { html, hash }
}
