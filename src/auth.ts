import NextAuth from "next-auth"
import { UserRole } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { DefaultSession } from "next-auth"
import { db } from "@/lib/db"
import { getUserById } from "@/components/auth/user"
import { getTwoFactorConfirmationByUserId } from "@/components/auth/verification/2f-confirmation"
import { getAccountByUserId } from "@/components/auth/account"
import authConfig from "./auth.config"


// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
      isTwoFactorEnabled: boolean
      isOAuth: boolean
    } & DefaultSession["user"]
  }
}

console.log("🚀 [Auth] Initializing NextAuth with config");

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/en/login",
    error: "/en/error",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false, // Force false for localhost development
      },
    },
  },
  events: {
    async linkAccount({ user }) {
      console.log("🔗 [linkAccount Event] OAuth account linked:", {
        userId: user.id,
        email: user.email,
        name: user.name
      });
      try {
        if (user.id) {
          await db.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
          })
          console.log("✅ [linkAccount Event] User emailVerified updated");
        }
      } catch (error) {
        console.error("❌ [linkAccount Event] Error updating user:", error);
      }
    },
    async signIn({ user, account, isNewUser }) {
      console.log("🔐 [signIn Event] Sign-in attempt:", {
        userId: user.id,
        email: user.email,
        name: user.name,
        provider: account?.provider,
        isNewUser,
        accountType: account?.type
      });
    },
    async createUser({ user }) {
      console.log("👤 [createUser Event] New user created:", {
        userId: user.id,
        email: user.email,
        name: user.name
      });
    }
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("🔄 [Redirect Callback]", { url, baseUrl });

      // Redirect to the callback URL after successful sign in
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    async signIn({ user, account }) {
      console.log("🔐 [signIn Callback] Processing sign-in:", {
        userId: user.id,
        name: user.name,
        email: user.email,
        provider: account?.provider,
        providerAccountId: account?.providerAccountId,
        type: account?.type
      });

      try {
        if (!user.id) {
          console.error("❌ [signIn Callback] No user ID provided");
          return false;
        }

        // OAuth providers (Google, Facebook) bypass verification checks
        if (account?.provider !== "credentials") {
          console.log("✅ [signIn Callback] OAuth provider detected, allowing sign-in");
          return true;
        }

        // Credentials provider requires verification
        const existingUser = await getUserById(user.id);
        console.log("🔍 [signIn Callback] Existing user check:", {
          found: !!existingUser,
          emailVerified: existingUser?.emailVerified,
          isTwoFactorEnabled: existingUser?.isTwoFactorEnabled
        });

        if (!existingUser?.emailVerified) {
          console.warn("⚠️ [signIn Callback] Email not verified");
          return false;
        }

        if (existingUser.isTwoFactorEnabled) {
          console.log("🔒 [signIn Callback] 2FA enabled, checking confirmation");
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

          if (!twoFactorConfirmation) {
            console.warn("⚠️ [signIn Callback] 2FA confirmation not found");
            return false;
          }

          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id }
          });
          console.log("✅ [signIn Callback] 2FA confirmation deleted");
        }

        console.log("✅ [signIn Callback] Sign-in successful");
        return true;
      } catch (error) {
        console.error("❌ [signIn Callback] Error during sign-in:", error);
        return false;
      }
    },
    async session({ token, session }) {
      console.log("📋 [Session Callback] Building session:", {
        tokenSub: token.sub,
        tokenName: token.name,
        tokenEmail: token.email,
        sessionUser: !!session.user
      });

      try {
        if (token.sub && session.user) {
          session.user.id = token.sub
        }

        if (token.role && session.user) {
          session.user.role = token.role as UserRole
        }

        if (session.user) {
          session.user.isTwoFactorEnabled = !!token.isTwoFactorEnabled
          session.user.name = token.name as string
          session.user.email = token.email as string
          session.user.isOAuth = !!token.isOAuth
        }

        console.log("✅ [Session Callback] Session created:", {
          userId: session.user?.id,
          userName: session.user?.name,
          userEmail: session.user?.email,
          isOAuth: session.user?.isOAuth
        });

        return session
      } catch (error) {
        console.error("❌ [Session Callback] Error building session:", error);
        return session;
      }
    },
    async jwt({ token }) {
      console.log("🎫 [JWT Callback] Processing token:", {
        sub: token.sub,
        name: token.name,
        email: token.email
      });

      try {
        if (!token.sub) {
          console.warn("⚠️ [JWT Callback] No token.sub found");
          return token;
        }

        const existingUser = await getUserById(token.sub);
        console.log("🔍 [JWT Callback] User lookup:", {
          found: !!existingUser,
          userId: existingUser?.id,
          name: existingUser?.name,
          email: existingUser?.email
        });

        if (!existingUser) {
          console.warn("⚠️ [JWT Callback] User not found in database");
          return token;
        }

        const existingAccount = await getAccountByUserId(existingUser.id);
        console.log("🔍 [JWT Callback] Account lookup:", {
          isOAuth: !!existingAccount,
          provider: existingAccount?.provider
        });

        token.isOAuth = !!existingAccount;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

        console.log("✅ [JWT Callback] Token updated:", {
          isOAuth: token.isOAuth,
          name: token.name,
          role: token.role
        });

        return token;
      } catch (error) {
        console.error("❌ [JWT Callback] Error processing token:", error);
        return token;
      }
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  // Enable debug mode temporarily to get detailed error information
  debug: true, // Set to true for both dev and production to debug
  ...authConfig,
})