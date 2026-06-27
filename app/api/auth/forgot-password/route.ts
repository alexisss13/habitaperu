import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { randomBytes } from "crypto"
import { forgotPasswordSchema } from "@/lib/validations"
import { sendPasswordResetEmail } from "@/lib/email"
import { z } from "zod"

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hora

// POST /api/auth/forgot-password - Solicitar enlace de restablecimiento de contraseña
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, locale } = forgotPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    // Siempre respondemos con el mismo mensaje exista o no el usuario,
    // para no revelar qué correos están registrados (enumeration attack).
    if (user) {
      const resetToken = randomBytes(32).toString("hex")
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      })

      const resetUrl = `${process.env.NEXTAUTH_URL}/${locale || 'es'}/reset-password?token=${resetToken}`
      sendPasswordResetEmail(user.email, user.firstName, resetUrl).catch(() => {})
    }

    return NextResponse.json({ message: "Si el correo existe, enviamos un enlace de recuperación." })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error en forgot-password:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
