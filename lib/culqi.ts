/**
 * lib/culqi.ts
 *
 * Cliente de Culqi para procesamiento de pagos en Habita Perú.
 * Cuando CULQI_SECRET_KEY no está configurado, opera en modo
 * simulación (MOCK) para permitir desarrollo sin API keys.
 *
 * Para activar Culqi real:
 * CULQI_PUBLIC_KEY=pk_live_...
 * CULQI_SECRET_KEY=sk_live_...
 * CULQI_MOCK=false
 */

export const CULQI_IS_MOCK =
  !process.env.CULQI_SECRET_KEY ||
  process.env.CULQI_SECRET_KEY === "" ||
  process.env.CULQI_MOCK === "true"

export const CULQI_PUBLIC_KEY = process.env.CULQI_PUBLIC_KEY ?? ""

interface ChargeParams {
  token: string
  amountCents: number  // monto en centavos: S/29 → 2900
  description: string
  email: string
  metadata?: Record<string, string>
}

interface ChargeResult {
  success: boolean
  chargeId?: string
  error?: string
}

/**
 * Crea un cobro en Culqi.
 * En modo MOCK devuelve éxito inmediato sin llamar a la API.
 */
export async function createCulqiCharge(params: ChargeParams): Promise<ChargeResult> {
  if (CULQI_IS_MOCK) {
    await new Promise(r => setTimeout(r, 800)) // simula latencia de red
    return {
      success: true,
      chargeId: `mock_charge_${Date.now()}`,
    }
  }

  try {
    const res = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CULQI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: params.amountCents,
        currency_code: "PEN",
        email: params.email,
        source_id: params.token,
        description: params.description,
        metadata: params.metadata ?? {},
      }),
    })

    const data = await res.json()

    if (data.object === "error") {
      return {
        success: false,
        error: data.user_message ?? "Error al procesar el pago con Culqi.",
      }
    }

    return { success: true, chargeId: data.id }
  } catch (err) {
    console.error("[Culqi] Error de red:", err)
    return { success: false, error: "No se pudo conectar con el procesador de pagos." }
  }
}

/** Precios en centavos */
export const PRICES = {
  SUCCESS_FEE:    2900,   // S/ 29.00
  KYC_FEE:         990,   // S/  9.90
  FEATURED_7D:    1500,   // S/ 15.00
  FEATURED_15D:   2500,   // S/ 25.00
  FEATURED_30D:   4500,   // S/ 45.00
  PRO_MONTHLY:    4900,   // S/ 49.00
  BUSINESS_MONTHLY: 12900, // S/ 129.00
} as const

export type PaymentType =
  | "SUCCESS_FEE"
  | "KYC_FEE"
  | "FEATURED_7D"
  | "FEATURED_15D"
  | "FEATURED_30D"
  | "PRO_MONTHLY"
  | "BUSINESS_MONTHLY"

export const PAYMENT_LABELS: Record<PaymentType, string> = {
  SUCCESS_FEE:      "Contrato legal verificado con firma digital",
  KYC_FEE:          "Activación de perfil verificado",
  FEATURED_7D:      "Propiedad destacada por 7 días",
  FEATURED_15D:     "Propiedad destacada por 15 días",
  FEATURED_30D:     "Propiedad destacada por 30 días",
  PRO_MONTHLY:      "Plan Pro — Habita Perú",
  BUSINESS_MONTHLY: "Plan Business — Habita Perú",
}
