// Lightweight auth for Edge Runtime (middleware)
// This avoids importing Prisma and bcryptjs which are not Edge-compatible

import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

// Basic config without database or bcrypt dependencies
const authConfig: NextAuthConfig = {
  providers: [], // Providers will be handled by the main auth.ts
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      return isLoggedIn
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as string
      }

      return session
    },
  },
  session: {
    strategy: "jwt"
  },
}

export const { auth, signIn, signOut } = NextAuth(authConfig)