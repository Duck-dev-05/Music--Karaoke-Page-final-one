import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Test accounts for development
const TEST_ACCOUNTS = [
  {
    id: "free-test-account",
    name: "Free User",
    email: "free@test.com",
    password: "test123",
    role: "user",
    premium: false,
    bio: "I'm a free user testing out the karaoke features!",
    location: "Test City",
    website: "https://example.com",
    total_favorites: 5,
    total_playlists: 2,
    total_songs: 10,
    createdAt: new Date("2024-01-01").toISOString(),
    isTestAccount: true
  },
  {
    id: "premium-test-account",
    name: "Premium User",
    email: "premium@test.com",
    password: "test123",
    role: "user",
    premium: true,
    bio: "I'm a premium user enjoying all the features!",
    location: "Premium City",
    website: "https://premium-example.com",
    total_favorites: 50,
    total_playlists: 10,
    total_songs: 100,
    createdAt: new Date("2024-01-01").toISOString(),
    subscription: {
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      plan: "Premium Monthly",
      status: "active"
    },
    isTestAccount: true
  }
]

// Function to validate test credentials
const validateTestCredentials = (email: string, password: string) => {
  const testAccount = TEST_ACCOUNTS.find(account => account.email === email && account.password === password)
  if (testAccount) {
    return {
      ...testAccount,
      isTestAccount: true
    }
  }
  return null
}

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
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For demo purposes, we'll use hardcoded users
        const users = [
          {
            id: "1",
            name: "Free User",
            email: "free@test.com",
            password: "password123"
          },
          {
            id: "2",
            name: "Premium User",
            email: "premium@test.com",
            password: "password123"
          }
        ];

        const user = users.find(user => user.email === credentials.email);

        if (!user || user.password !== credentials.password) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user?.email) {
        // Update the token when the session is updated (e.g., during premium upgrade)
        token.email = session.user.email;
      }
      
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
} 