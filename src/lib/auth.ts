import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { User } from ".prisma/client"
import SpotifyProvider from "next-auth/providers/spotify"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/error"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // Implement your real user lookup and password check here
        // Example:
        // const user = await db.user.findUnique({ where: { email: credentials.email } });
        // if (user && await bcrypt.compare(credentials.password, user.password)) {
        //   return user;
        // }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        return {
          ...token,
          ...session.user
        };
      }
      if (user) {
        return {
          ...token,
          ...user
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: token.id,
          premium: token.premium,
          role: token.role,
          emailNotifications: token.emailNotifications,
          pushNotifications: token.pushNotifications,
          createdAt: token.createdAt,
          isPremium: token.isPremium,
          premiumUntil: token.premiumUntil,
          premiumPlan: token.premiumPlan,
          premiumExpiresAt: token.premiumExpiresAt
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to homepage after successful login
      return baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
} 