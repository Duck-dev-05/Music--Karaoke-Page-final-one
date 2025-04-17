import { DefaultSession, DefaultUser } from "next-auth"
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
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      premium: boolean
    }
  }

  interface User extends IUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
} 