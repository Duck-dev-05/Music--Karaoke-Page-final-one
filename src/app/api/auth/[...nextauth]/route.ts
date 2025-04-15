import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DefaultSession } from 'next-auth';

// Test accounts for development
const TEST_ACCOUNTS = [
  { 
    email: "user@test.com", 
    password: "password123", 
    role: "user", 
    name: "Test User",
    emailNotifications: true,
    pushNotifications: true,
    premium: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    email: "admin@test.com", 
    password: "admin123", 
    role: "admin", 
    name: "Test Admin",
    emailNotifications: true,
    pushNotifications: true,
    premium: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      emailNotifications: boolean;
      pushNotifications: boolean;
      premium: boolean;
      createdAt: Date;
      updatedAt: Date;
    } & DefaultSession['user']
  }
}

const handler = NextAuth({
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find matching test account
        const account = TEST_ACCOUNTS.find(
          acc => acc.email === credentials.email && acc.password === credentials.password
        );

        if (account) {
          return {
            id: account.role === 'admin' ? '1' : '2',
            name: account.name,
            email: account.email,
            role: account.role,
            emailNotifications: account.emailNotifications,
            pushNotifications: account.pushNotifications,
            premium: account.premium,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.emailNotifications = user.emailNotifications;
        token.pushNotifications = user.pushNotifications;
        token.premium = user.premium;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.emailNotifications = token.emailNotifications as boolean;
        session.user.pushNotifications = token.pushNotifications as boolean;
        session.user.premium = token.premium as boolean;
        session.user.createdAt = token.createdAt as Date;
        session.user.updatedAt = token.updatedAt as Date;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };