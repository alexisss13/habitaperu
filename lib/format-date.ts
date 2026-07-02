const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

const MONTHS_ES_SHORT = [
  "ene.", "feb.", "mar.", "abr.", "may.", "jun.",
  "jul.", "ago.", "sep.", "oct.", "nov.", "dic.",
]

/// Perú no observa horario de verano — UTC-5 todo el año.
const LIMA_OFFSET_MS = 5 * 60 * 60 * 1000

function toLima(isoString: string): Date {
  return new Date(new Date(isoString).getTime() - LIMA_OFFSET_MS)
}

function hour12Parts(lima: Date): { hour12: number; minutes: string; period: string } {
  const minutes = lima.getUTCMinutes().toString().padStart(2, "0")
  const period = lima.getUTCHours() >= 12 ? "p. m." : "a. m."
  const hour12 = lima.getUTCHours() % 12 || 12
  return { hour12, minutes, period }
}

/**
 * Formatea fecha + hora en horario de Lima de forma manual y determinista.
 * No usar `toLocaleDateString`/`toLocaleString` con opciones de hora para
 * es-PE: el patrón combinado fecha+hora que arma el motor de ICU difiere
 * entre Node (servidor) y el navegador (cliente) — mismo valor, separador
 * distinto ("25 de junio de 2026 a las 5:01 p. m." vs "..., 5:01 p. m.") —
 * lo que rompe la hidratación de React en componentes SSR-eados.
 */
export function formatDateTimeLima(isoString: string): string {
  const lima = toLima(isoString)
  const day = lima.getUTCDate()
  const month = MONTHS_ES[lima.getUTCMonth()]
  const year = lima.getUTCFullYear()
  const { hour12, minutes, period } = hour12Parts(lima)
  return `${day} de ${month} de ${year}, ${hour12}:${minutes} ${period}`
}

/** Ej: "02/07/2026, 5:01 p. m." */
export function formatDateTimeLimaNumeric(isoString: string): string {
  const lima = toLima(isoString)
  const day = lima.getUTCDate().toString().padStart(2, "0")
  const month = (lima.getUTCMonth() + 1).toString().padStart(2, "0")
  const year = lima.getUTCFullYear()
  const { hour12, minutes, period } = hour12Parts(lima)
  return `${day}/${month}/${year}, ${hour12}:${minutes} ${period}`
}

/** Ej: "02 jul. 2026, 5:01 p. m." */
export function formatDateTimeLimaShortMonth(isoString: string): string {
  const lima = toLima(isoString)
  const day = lima.getUTCDate().toString().padStart(2, "0")
  const month = MONTHS_ES_SHORT[lima.getUTCMonth()]
  const year = lima.getUTCFullYear()
  const { hour12, minutes, period } = hour12Parts(lima)
  return `${day} ${month} ${year}, ${hour12}:${minutes} ${period}`
}
