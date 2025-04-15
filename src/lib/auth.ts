import { type DefaultSession } from "next-auth";

// Test accounts for development
export const TEST_ACCOUNTS = [
  {
    id: "1",
    email: "user@test.com",
    name: "Test User",
    image: "/default-avatar.png",
    role: "user"
  },
  {
    id: "2",
    email: "admin@test.com",
    name: "Test Admin",
    image: "/default-avatar.png",
    role: "admin"
  }
];

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
  }
}

// Helper function to validate test account credentials
export function validateTestCredentials(email: string, password: string) {
  const isValidUser = email === "user@test.com" && password === "password123";
  const isValidAdmin = email === "admin@test.com" && password === "admin123";
  
  if (isValidUser) {
    return TEST_ACCOUNTS[0];
  }
  
  if (isValidAdmin) {
    return TEST_ACCOUNTS[1];
  }
  
  return null;
} 