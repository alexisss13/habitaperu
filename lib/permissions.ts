/**
 * Una cuenta puede gestionar propiedades si su rol es LANDLORD (registro
 * directo como arrendador) o si ganó la capacidad publicando al menos una
 * propiedad (isLandlord=true), sin importar cuál sea su rol principal.
 * Usar esto en vez de comparar `role === "LANDLORD"` a mano en los guards.
 */
export function hasLandlordRole(user: { role?: string | null; isLandlord?: boolean | null } | null | undefined): boolean {
  if (!user) return false
  return user.role === "LANDLORD" || !!user.isLandlord
}
