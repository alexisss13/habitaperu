/**
 * lib/exceptions/contract-errors.ts
 *
 * Clases de error personalizadas para el Motor LegalTech de Habita Perú.
 * Extienden Error nativo para ser capturables con instanceof en Server Actions
 * sin exponer detalles internos de la base de datos al cliente.
 *
 * Ley 29733 — los mensajes de error nunca incluyen datos personales del usuario.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Tipos auxiliares
// ─────────────────────────────────────────────────────────────────────────────

export interface SerializedError {
  code: string
  message: string
  statusHint: number
}

// ─────────────────────────────────────────────────────────────────────────────
// ContractConcurrencyError
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Se lanza cuando el campo `version` de una Property no coincide con el valor
 * leído antes de la transacción (Optimistic Concurrency Control).
 *
 * Escenario: dos arrendadores intentan contrafirmar contratos sobre la misma
 * propiedad en el mismo milisegundo. El segundo en llegar recibe este error.
 */
export class ContractConcurrencyError extends Error {
  public readonly code = "CONTRACT_CONCURRENCY_ERROR" as const
  public readonly statusHint = 409

  constructor(
    public readonly propertyId: string,
    public readonly expectedVersion: number,
    public readonly actualVersion: number,
  ) {
    super(
      `La propiedad fue modificada por otra operación concurrente. ` +
        `Versión esperada: ${expectedVersion}, versión actual: ${actualVersion}. ` +
        `Reintente la operación.`,
    )
    this.name = "ContractConcurrencyError"
    // Mantiene el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContractConcurrencyError)
    }
  }

  public serialize(): SerializedError {
    return {
      code: this.code,
      message:
        "La propiedad ya no está disponible. Otro contrato fue activado primero.",
      statusHint: this.statusHint,
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// InvalidSignatureError
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Se lanza cuando el hash SHA-256 del documento presentado al usuario no
 * coincide con el `documentHash` almacenado en el contrato.
 *
 * Garantiza la integridad del Clickwrap Agreement (Ley 30201 — Audit Trail).
 */
export class InvalidSignatureError extends Error {
  public readonly code = "INVALID_SIGNATURE_ERROR" as const
  public readonly statusHint = 422

  constructor(
    public readonly contractId: string,
    public readonly reason: "HASH_MISMATCH" | "DOCUMENT_NOT_FOUND" | "ALREADY_SIGNED",
  ) {
    const messages: Record<typeof reason, string> = {
      HASH_MISMATCH:
        "El hash del documento no coincide con el registrado. El contrato pudo haber sido alterado.",
      DOCUMENT_NOT_FOUND:
        "No se encontró el documento asociado al contrato para verificar la firma.",
      ALREADY_SIGNED:
        "Este contrato ya fue firmado por esta parte. No se puede firmar dos veces.",
    }
    super(messages[reason])
    this.name = "InvalidSignatureError"
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidSignatureError)
    }
  }

  public serialize(): SerializedError {
    return {
      code: this.code,
      message: this.message,
      statusHint: this.statusHint,
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UnauthorizedLegalActionError
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Se lanza cuando un usuario autenticado intenta ejecutar una acción legal
 * para la que no tiene el rol o la titularidad requerida.
 *
 * Ejemplos:
 *  - Un TENANT intenta contrafirmar como LANDLORD.
 *  - Un LANDLORD intenta firmar un contrato que pertenece a otro arrendador.
 *  - Un usuario sin sesión intenta acceder a una Server Action protegida.
 */
export class UnauthorizedLegalActionError extends Error {
  public readonly code = "UNAUTHORIZED_LEGAL_ACTION" as const
  public readonly statusHint = 403

  constructor(
    public readonly userId: string | null,
    public readonly action: string,
    public readonly requiredRole?: string,
  ) {
    const roleMsg = requiredRole ? ` Se requiere rol: ${requiredRole}.` : ""
    super(
      `Acción no autorizada: "${action}" para el usuario ${userId ?? "anónimo"}.${roleMsg}`,
    )
    this.name = "UnauthorizedLegalActionError"
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedLegalActionError)
    }
  }

  public serialize(): SerializedError {
    return {
      code: this.code,
      message: "No tienes permisos para realizar esta acción legal.",
      statusHint: this.statusHint,
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ContractStateError
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Se lanza cuando se intenta ejecutar una transición de estado inválida
 * en la máquina de estados del contrato.
 *
 * Ejemplo: intentar firmar un contrato que ya está ACTIVE o FINISHED.
 */
export class ContractStateError extends Error {
  public readonly code = "CONTRACT_STATE_ERROR" as const
  public readonly statusHint = 409

  constructor(
    public readonly contractId: string,
    public readonly currentStatus: string,
    public readonly attemptedAction: string,
  ) {
    super(
      `No se puede ejecutar "${attemptedAction}" sobre el contrato ${contractId} ` +
        `porque su estado actual es "${currentStatus}".`,
    )
    this.name = "ContractStateError"
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContractStateError)
    }
  }

  public serialize(): SerializedError {
    return {
      code: this.code,
      message: `El contrato no puede ser modificado en su estado actual: ${this.currentStatus}.`,
      statusHint: this.statusHint,
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilidad: isKnownLegalError
// ─────────────────────────────────────────────────────────────────────────────

type KnownLegalError =
  | ContractConcurrencyError
  | InvalidSignatureError
  | UnauthorizedLegalActionError
  | ContractStateError

/**
 * Type guard que determina si un error capturado en un catch es uno de los
 * errores legales conocidos del sistema, permitiendo serialización segura.
 */
export function isKnownLegalError(error: unknown): error is KnownLegalError {
  return (
    error instanceof ContractConcurrencyError ||
    error instanceof InvalidSignatureError ||
    error instanceof UnauthorizedLegalActionError ||
    error instanceof ContractStateError
  )
}
