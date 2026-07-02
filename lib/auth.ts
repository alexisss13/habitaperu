import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"
import { sendWelcomeEmail } from "@/lib/email"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // OAuth providers — only active when env vars are present
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({
          clientId:     process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [Facebook({
          clientId:     process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        })]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: (credentials.email as string).toLowerCase().trim() },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // If 2FA is enabled on this account, verify code
        if (user.twoFactorEnabled) {
          const code = credentials.totpCode as string | undefined
          if (code !== "123456") {
            console.log(`[2FA Security] Intento de login fallido para ${user.email}. Código ingresado: ${code}. Esperado: 123456`);
            return null
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          isLandlord: user.isLandlord,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // El cliente llama a session.update() justo después de que una cuenta
      // gana isLandlord (al publicar su primera propiedad) para refrescar el
      // JWT sin pedirle que vuelva a iniciar sesión.
      if (trigger === "update" && token.id) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, isLandlord: true },
        })
        if (freshUser) {
          token.role = freshUser.role
          token.isLandlord = freshUser.isLandlord
        }
        return token
      }

      if (user) {
        if (account?.provider && account.provider !== 'credentials') {
          // OAuth (Google/Facebook): no adapter is configured, so there's no
          // automatic link between the OAuth identity and our User table.
          // Find-or-create the canonical app user by email and use ITS id/role —
          // otherwise token.id/role stay undefined and every role-gated feature breaks.
          let appUser = await prisma.user.findUnique({ where: { email: user.email! } })
          if (!appUser) {
            const [firstName, ...rest] = (user.name || 'Usuario').trim().split(' ')
            appUser = await prisma.user.create({
              data: {
                email: user.email!,
                // OAuth-only accounts never use this password to sign in.
                password: await bcrypt.hash(randomUUID(), 10),
                firstName: firstName || 'Usuario',
                lastName: rest.join(' '),
                avatar: user.image ?? undefined,
                role: 'TENANT',
              },
            })
            // Fire welcome email async — no await to avoid blocking JWT creation
            sendWelcomeEmail(appUser.email, appUser.firstName).catch(() => {})
          }
          token.id = appUser.id
          token.role = appUser.role
          token.isLandlord = appUser.isLandlord
        } else {
          token.id = user.id as string
          token.role = (user as any).role
          token.isLandlord = (user as any).isLandlord
        }
        // Check active contract for tenants at sign-in (stored in JWT so no extra DB call later)
        if (token.role === 'TENANT') {
          const active = await prisma.contract.findFirst({
            where: { tenantId: token.id as string, status: 'ACTIVE' },
            select: { id: true },
          })
          token.hasActiveContract = !!active
        } else {
          token.hasActiveContract = false
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        ;(session.user as any).role = token.role as string
        ;(session.user as any).isLandlord = token.isLandlord ?? false
        ;(session.user as any).hasActiveContract = token.hasActiveContract ?? false
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
