"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Role, ContractStatus } from "@prisma/client"

export async function updateProfileAction(data: {
  firstName: string
  lastName: string
  phone: string
  bio: string
  district: string
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("No autenticado")

  const { firstName, lastName, phone, bio, district } = data

  if (!firstName.trim() || !lastName.trim()) {
    return { success: false, error: "Nombre y apellido son requeridos" }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || null,
      bio: bio.trim() || null,
      district: district.trim() || null,
    },
  })

  return { success: true }
}

/**
 * Toggles the 2FA state for the currently authenticated user.
 */
export async function toggleTwoFactorAction() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("No autenticado")
  }

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true }
  })

  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: !user.twoFactorEnabled
    },
    select: { twoFactorEnabled: true }
  })

  return {
    success: true,
    twoFactorEnabled: updatedUser.twoFactorEnabled
  }
}

/**
 * Checks if a user has 2FA enabled, after validating email and password.
 * This prevents leaking whether 2FA is enabled for wrong passwords/emails.
 */
export async function checkHasActiveContract() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== Role.TENANT) {
    return { hasActiveContract: false }
  }

  const active = await prisma.contract.findFirst({
    where: { tenantId: session.user.id, status: ContractStatus.ACTIVE },
    select: { id: true },
  })

  return { hasActiveContract: !!active }
}

/**
 * Primer paso del flujo unificado de login/registro: dado un email, dice si
 * ya existe una cuenta (para pedir contraseña) o no (para crear una nueva).
 */
export async function checkAccountExistsAction(email: string) {
  if (!email) {
    return { success: false, error: "Email requerido", exists: false }
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true },
  })

  return { success: true, exists: !!user }
}

export async function checkTwoFactorRequiredAction(email: string) {
  if (!email) {
    return { success: false, error: "Email requerido", twoFactorRequired: false }
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { twoFactorEnabled: true }
  })

  if (!user) {
    return { success: false, error: "Credenciales incorrectas", twoFactorRequired: false }
  }

  return {
    success: true,
    twoFactorRequired: user.twoFactorEnabled
  }
}
