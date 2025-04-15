import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import type { DefaultSession } from "next-auth"

export interface ExtendedUser {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  location?: string
  website?: string
  phoneNumber?: string
  theme?: "light" | "dark" | "system"
  language?: string
  emailNotifications: boolean
  pushNotifications: boolean
  premium: boolean
  createdAt: Date
  updatedAt: Date
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }

  interface User extends ExtendedUser {}
}

declare module 'next-auth/jwt' {
  interface JWT extends ExtendedUser {}
} 