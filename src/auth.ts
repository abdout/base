import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "@/components/auth/user"
import { getTwoFactorConfirmationByUserId } from "@/components/auth/verification/2f-confirmation"
import { getAccountByUserId } from "@/components/auth/account"
import { db } from "@/lib/db"
import authConfig from "@/auth.config"

// Force Node.js runtime for auth operations
export const runtime = 'nodejs'

// Helper to ensure we have a valid URL
function getBaseUrl() {
  console.log("🔧 [Auth] === Getting Base URL ===")
  console.log("🔧 [Auth] Environment variables:")
  console.log("  - NEXTAUTH_URL:", process.env.NEXTAUTH_URL)
  console.log("  - VERCEL_URL:", process.env.VERCEL_URL)
  console.log("  - NODE_ENV:", process.env.NODE_ENV)

  // In production, use NEXTAUTH_URL if set
  if (process.env.NEXTAUTH_URL) {
    const url = process.env.NEXTAUTH_URL
    console.log("🔧 [Auth] Using NEXTAUTH_URL:", url)

    // Ensure it has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const fullUrl = `https://${url}`
      console.log("🔧 [Auth] Added https:// protocol:", fullUrl)
      return fullUrl
    }
    return url
  }

  // Fallback for development
  if (process.env.VERCEL_URL) {
    const vercelUrl = `https://${process.env.VERCEL_URL}`
    console.log("🔧 [Auth] Using VERCEL_URL:", vercelUrl)
    return vercelUrl
  }

  // Default fallback
  const fallbackUrl = 'https://localhost:3000'
  console.log("🔧 [Auth] Using fallback URL:", fallbackUrl)
  return fallbackUrl
}

// Get and validate the base URL at initialization
const baseUrl = getBaseUrl()
console.log("✅ [Auth] NextAuth initialized with base URL:", baseUrl)

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER";
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(
        existingUser.id
      );

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  // Ensure secure cookies and proper URL handling
  useSecureCookies: process.env.NODE_ENV === "production",
  trustHost: true,
})