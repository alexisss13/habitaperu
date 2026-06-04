/**
 * lib/whatsapp.ts
 *
 * Cliente de WhatsApp Business API (Meta Cloud API).
 * En modo MOCK (sin WHATSAPP_TOKEN), loggea el mensaje en consola
 * y retorna éxito para no bloquear el flujo de la app.
 *
 * Para activar en producción:
 *   WHATSAPP_TOKEN=EAA...   (Access Token de Meta for Developers)
 *   WHATSAPP_PHONE_ID=12345...  (Phone Number ID de Meta Business)
 *
 * Templates deben estar aprobados en:
 *   developers.facebook.com → WhatsApp → Message Templates
 */

export const WA_IS_MOCK =
  !process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_TOKEN === ""

interface SendTemplateParams {
  to: string          // número con código de país sin +: "51999888777"
  template: WaTemplate
  components?: WaComponent[]
}

type WaTemplate =
  | "contrato_enviado"
  | "contrato_activo"
  | "inquilino_firmo"
  | "recordatorio_pago"
  | "kyc_aprobado"

interface WaComponent {
  type: "body" | "header"
  parameters: Array<{ type: "text"; text: string }>
}

/**
 * Envía un mensaje de WhatsApp usando un template aprobado.
 * En modo MOCK: imprime en consola y retorna éxito.
 */
export async function sendWhatsAppTemplate({
  to,
  template,
  components = [],
}: SendTemplateParams): Promise<{ success: boolean; error?: string }> {
  const phone = to.replace(/\D/g, "")
  if (!phone) return { success: false, error: "Número de teléfono inválido." }

  if (WA_IS_MOCK) {
    const params = components
      .flatMap(c => c.parameters)
      .map(p => p.text)
      .join(", ")
    console.log(`[WhatsApp MOCK] → +${phone} | template: ${template} | params: ${params}`)
    return { success: true }
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "template",
          template: {
            name: template,
            language: { code: "es" },
            components:
              components.length > 0
                ? components.map(c => ({
                    type: c.type,
                    parameters: c.parameters,
                  }))
                : undefined,
          },
        }),
      }
    )

    const data = await res.json()

    if (data.error) {
      console.error("[WhatsApp] Error:", data.error)
      return { success: false, error: data.error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("[WhatsApp] Network error:", err)
    return { success: false, error: "No se pudo conectar con WhatsApp API." }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers tipados por evento — uso interno en server actions
// ─────────────────────────────────────────────────────────────────────────────

export function waSendContratoEnviado(phone: string, tenantName: string, propertyTitle: string, link: string) {
  return sendWhatsAppTemplate({
    to: phone,
    template: "contrato_enviado",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: tenantName },
        { type: "text", text: propertyTitle },
        { type: "text", text: link },
      ],
    }],
  })
}

export function waSendInquilinoFirmo(phone: string, landlordName: string, propertyTitle: string, link: string) {
  return sendWhatsAppTemplate({
    to: phone,
    template: "inquilino_firmo",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: landlordName },
        { type: "text", text: propertyTitle },
        { type: "text", text: link },
      ],
    }],
  })
}

export function waSendContratoActivo(phone: string, name: string, propertyTitle: string) {
  return sendWhatsAppTemplate({
    to: phone,
    template: "contrato_activo",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: name },
        { type: "text", text: propertyTitle },
      ],
    }],
  })
}

export function waSendRecordatorioPago(phone: string, tenantName: string, amount: string, daysLeft: string) {
  return sendWhatsAppTemplate({
    to: phone,
    template: "recordatorio_pago",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: tenantName },
        { type: "text", text: amount },
        { type: "text", text: daysLeft },
      ],
    }],
  })
}

export function waSendKycAprobado(phone: string, name: string) {
  return sendWhatsAppTemplate({
    to: phone,
    template: "kyc_aprobado",
    components: [{
      type: "body",
      parameters: [{ type: "text", text: name }],
    }],
  })
}
