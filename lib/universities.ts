/**
 * lib/universities.ts
 *
 * Coordenadas de universidades en ciudades donde opera Habita Perú.
 * Usar para el filtro "Cerca de mi universidad" en la búsqueda de propiedades.
 *
 * Fuente: coordenadas del campus principal de cada institución.
 */

export interface University {
  id: string
  name: string
  shortName: string
  city: string
  lat: number
  lng: number
}

export const UNIVERSITIES: University[] = [
  // ── Trujillo ──────────────────────────────────────────────────────────────
  {
    id: "unt",
    name: "Universidad Nacional de Trujillo",
    shortName: "UNT",
    city: "Trujillo",
    lat: -8.1093,
    lng: -79.0220,
  },
  {
    id: "ucv-trujillo",
    name: "Universidad César Vallejo — Trujillo",
    shortName: "UCV",
    city: "Trujillo",
    lat: -8.0996,
    lng: -79.0366,
  },
  {
    id: "upao",
    name: "Universidad Privada Antenor Orrego",
    shortName: "UPAO",
    city: "Trujillo",
    lat: -8.0879,
    lng: -79.0166,
  },
  {
    id: "upn-trujillo",
    name: "Universidad Privada del Norte — Trujillo",
    shortName: "UPN",
    city: "Trujillo",
    lat: -8.1061,
    lng: -79.0316,
  },
  {
    id: "uladech-trujillo",
    name: "Universidad Los Ángeles de Chimbote — Trujillo",
    shortName: "ULADECH",
    city: "Trujillo",
    lat: -8.1120,
    lng: -79.0270,
  },
  // ── Chiclayo ──────────────────────────────────────────────────────────────
  {
    id: "unprg",
    name: "Universidad Nacional Pedro Ruiz Gallo",
    shortName: "UNPRG",
    city: "Chiclayo",
    lat: -6.7697,
    lng: -79.8381,
  },
  {
    id: "uss",
    name: "Universidad Señor de Sipán",
    shortName: "USS",
    city: "Chiclayo",
    lat: -6.7420,
    lng: -79.8309,
  },
  // ── Piura ─────────────────────────────────────────────────────────────────
  {
    id: "unp",
    name: "Universidad Nacional de Piura",
    shortName: "UNP",
    city: "Piura",
    lat: -5.1945,
    lng: -80.6328,
  },
  {
    id: "udep",
    name: "Universidad de Piura",
    shortName: "UDEP",
    city: "Piura",
    lat: -5.1789,
    lng: -80.6234,
  },
]

/**
 * Calcula la distancia en kilómetros entre dos puntos usando la fórmula Haversine.
 */
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Retorna las universidades filtradas por ciudad.
 */
export function getUniversitiesByCity(city: string): University[] {
  return UNIVERSITIES.filter(u => u.city.toLowerCase() === city.toLowerCase())
}
