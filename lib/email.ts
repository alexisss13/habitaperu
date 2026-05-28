import { Resend } from "resend"

// Requires RESEND_API_KEY in .env
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? "Habita Perú <noreply@habitaperu.com>"

// ── Helpers ─────────────────────────────────────────────────────────────────

function base(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background: #f9fafb; font-family: system-ui, -apple-system, sans-serif; }
    .wrap { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
    .header { background: linear-gradient(135deg, #0f3457 0%, #8f8272 100%); padding: 32px 40px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px; }
    .header p { margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.7); }
    .body { padding: 32px 40px; }
    .body p { font-size: 15px; color: #374151; line-height: 1.6; margin: 0 0 16px; }
    .body h2 { font-size: 17px; font-weight: 700; color: #151c26; margin: 0 0 12px; }
    .card { background: #f3f4f6; border-radius: 12px; padding: 16px 20px; margin: 16px 0; }
    .card p { margin: 4px 0; font-size: 14px; color: #6b7280; }
    .card strong { color: #151c26; }
    .btn { display: inline-block; margin: 20px 0 0; padding: 14px 28px; background: linear-gradient(135deg, #0f3457 0%, #8f8272 100%); color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 12px; }
    .footer { padding: 24px 40px; border-top: 1px solid #f3f4f6; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 0; }
    .badge-green { display: inline-block; background: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px; }
    .badge-amber { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px; }
    .badge-red   { display: inline-block; background: #fee2e2; color: #991b1b; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Habita Perú</h1>
      <p>La plataforma de arrendamiento más confiable del Perú</p>
    </div>
    <div class="body">${body}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Habita Perú · Este correo fue enviado automáticamente, no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>`
}

function safe(s: unknown) {
  return String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ── Send functions ───────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: "¡Bienvenido/a a Habita Perú!",
    html: base("Bienvenida", `
      <h2>Hola, ${safe(firstName)} 👋</h2>
      <p>Tu cuenta ha sido creada exitosamente. Ya puedes buscar, guardar y contactar propiedades en alquiler en todo el Perú.</p>
      <a class="btn" href="${process.env.NEXTAUTH_URL}/es/propiedades">Explorar propiedades</a>
    `),
  })
}

export async function sendContractSentEmail(
  to: string,
  tenantName: string,
  propertyTitle: string,
  contractId: string,
) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Tienes un contrato pendiente de firma — ${safe(propertyTitle)}`,
    html: base("Contrato pendiente de firma", `
      <h2>Hola, ${safe(tenantName)}</h2>
      <p>El arrendador ha generado un contrato para la siguiente propiedad:</p>
      <div class="card">
        <p><strong>${safe(propertyTitle)}</strong></p>
        <p>Estado: <span class="badge-amber">Pendiente de tu firma</span></p>
      </div>
      <p>Revisa el contrato, léelo con atención y fírmalo si estás de acuerdo con los términos.</p>
      <a class="btn" href="${process.env.NEXTAUTH_URL}/contracts/${safe(contractId)}">Ver y firmar contrato</a>
    `),
  })
}

export async function sendContractSignedByTenantEmail(
  to: string,
  landlordName: string,
  propertyTitle: string,
  contractId: string,
) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: `El inquilino firmó el contrato — ${safe(propertyTitle)}`,
    html: base("El inquilino firmó el contrato", `
      <h2>Hola, ${safe(landlordName)}</h2>
      <p>El inquilino ha firmado el contrato para:</p>
      <div class="card">
        <p><strong>${safe(propertyTitle)}</strong></p>
        <p>Estado: <span class="badge-amber">Esperando tu contrafirma</span></p>
      </div>
      <p>Ahora necesitas revisar y contrafirmar para activar el contrato.</p>
      <a class="btn" href="${process.env.NEXTAUTH_URL}/contracts/${safe(contractId)}">Contrafirmar contrato</a>
    `),
  })
}

export async function sendContractActiveEmail(
  toLandlord: string,
  toTenant: string,
  landlordName: string,
  tenantName: string,
  propertyTitle: string,
  contractId: string,
) {
  if (!process.env.RESEND_API_KEY) return
  const body = (recipientName: string) => base("Contrato activo", `
    <h2>Hola, ${safe(recipientName)}</h2>
    <p>El contrato ha sido firmado por ambas partes y está ahora <strong>activo</strong>.</p>
    <div class="card">
      <p><strong>${safe(propertyTitle)}</strong></p>
      <p>Estado: <span class="badge-green">Activo</span></p>
    </div>
    <p>Puedes descargar el contrato firmado en cualquier momento desde tu panel.</p>
    <a class="btn" href="${process.env.NEXTAUTH_URL}/contracts/${safe(contractId)}">Ver contrato</a>
  `)
  await Promise.all([
    resend.emails.send({ from: FROM, to: toLandlord, subject: `Contrato activo — ${safe(propertyTitle)}`, html: body(landlordName) }),
    resend.emails.send({ from: FROM, to: toTenant,   subject: `Contrato activo — ${safe(propertyTitle)}`, html: body(tenantName) }),
  ])
}

export async function sendPaymentOverdueEmail(
  to: string,
  tenantName: string,
  propertyTitle: string,
  amount: number,
  dueDate: string,
) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Pago vencido — ${safe(propertyTitle)}`,
    html: base("Pago vencido", `
      <h2>Hola, ${safe(tenantName)}</h2>
      <p>Tienes un pago <strong>vencido</strong> correspondiente a:</p>
      <div class="card">
        <p><strong>${safe(propertyTitle)}</strong></p>
        <p>Monto: <strong>S/ ${Number(amount).toLocaleString('es-PE')}</strong></p>
        <p>Vencimiento: <strong>${safe(dueDate)}</strong></p>
        <p>Estado: <span class="badge-red">Vencido</span></p>
      </div>
      <p>Por favor, regulariza tu situación para evitar la aplicación de la <strong>Ley 30933</strong> (desalojo notarial exprés).</p>
      <a class="btn" href="${process.env.NEXTAUTH_URL}/tenant/payments">Ver mis pagos</a>
    `),
  })
}

export async function sendKycApprovedEmail(to: string, firstName: string) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Tu verificación KYC fue aprobada",
    html: base("KYC Aprobado", `
      <h2>¡Felicidades, ${safe(firstName)}!</h2>
      <p>Tu identidad ha sido verificada exitosamente. Tu perfil ahora muestra el badge <span class="badge-green">Verificado</span>.</p>
      <p>Esto genera mayor confianza con los arrendadores y te ayuda a acceder a las mejores propiedades.</p>
      <a class="btn" href="${process.env.NEXTAUTH_URL}/tenant/dashboard">Ir a mi panel</a>
    `),
  })
}

export async function sendKycRejectedEmail(
  to: string,
  firstName: string,
  reason: string,
) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Tu verificación KYC fue rechazada",
    html: base("KYC Rechazado", `
      <h2>Hola, ${safe(firstName)}</h2>
      <p>Lamentablemente, tu solicitud de verificación de identidad no pudo ser aprobada.</p>
      <div class="card">
        <p><strong>Motivo:</strong> ${safe(reason)}</p>
      </div>
      <p>Puedes volver a enviar tus documentos desde tu panel.</p>
      <a class="btn" href="${process.env.NEXTAUTH_URL}/tenant/kyc">Reintentar verificación</a>
    `),
  })
}
