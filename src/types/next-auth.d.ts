import { DefaultSession } from "next-auth"
import { User as PrismaUser } from "@prisma/client"
import { JWT } from "next-auth/jwt"
import NextAuth from "next-auth"

interface IUser {
  id: string
  role: string
  emailNotifications: boolean
  pushNotifications: boolean
  premium: boolean
  createdAt: Date
  updatedAt: Date
  isTestAccount: boolean
  name?: string | null
  email?: string | null
  image?: string | null
  premiumPlan?: string | null
  premiumExpiresAt?: Date | null
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      premium: boolean
      role: string
      emailNotifications: boolean
      pushNotifications: boolean
      createdAt: Date
      isPremium: boolean
      premiumUntil: Date | null
      premiumPlan?: string | null
      premiumExpiresAt?: Date | null
    } & DefaultSession["user"]
  }

  interface User extends PrismaUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    premium: boolean
    role: string
    emailNotifications: boolean
    pushNotifications: boolean
    createdAt: Date
    isPremium: boolean
    premiumUntil: Date | null
    premiumPlan?: string | null
    premiumExpiresAt?: Date | null
  }
} 