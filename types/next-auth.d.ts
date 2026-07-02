import { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      isLandlord: boolean
      hasActiveContract: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role: Role
    isLandlord: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    isLandlord: boolean
    hasActiveContract: boolean
  }
}
