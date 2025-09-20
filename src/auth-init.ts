import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "@/components/auth/user"
import { getTwoFactorConfirmationByUserId } from "@/components/auth/verification/2f-confirmation"
import { getAccountByUserId } from "@/components/auth/account"
import { db } from "@/lib/db"
import authConfig from "@/auth.config"

// Force Node.js runtime for auth operations
export const runtime = 'nodejs'

// Create NextAuth instance with safe configuration
export function createAuth() {
  return NextAuth({
    pages: {
      signIn: "/login",
      error: "/error",
    },
    events: {
      async linkAccount({ user, account, profile }) {
        // Only update email verification for new users
        // The signIn callback handles existing users
        const existingUser = await db.user.findUnique({
          where: { id: user.id }
        });

        if (existingUser && !existingUser.emailVerified) {
          await db.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
          })
        }
      }
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        // For OAuth providers (Google, Facebook, etc.)
        if (account?.provider !== "credentials") {
          // Check if a user with this email already exists
          if (user.email) {
            const existingUser = await db.user.findUnique({
              where: { email: user.email }
            });

            if (existingUser) {
              // Check if this OAuth account is already linked
              const existingAccount = await db.account.findUnique({
                where: {
                  provider_providerAccountId: {
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                  }
                }
              });

              if (!existingAccount) {
                // Link the OAuth account to the existing user
                await db.account.create({
                  data: {
                    userId: existingUser.id,
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state,
                  }
                });
              }

              // Update the user's email verification status if needed
              if (!existingUser.emailVerified) {
                await db.user.update({
                  where: { id: existingUser.id },
                  data: { emailVerified: new Date() }
                });
              }
            }
          }

          return true;
        }

        // For credentials provider
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
}

// Create a singleton instance with lazy initialization
let authInstance: ReturnType<typeof createAuth> | null = null;

export function getAuth() {
  if (!authInstance) {
    authInstance = createAuth();
  }
  return authInstance;
}

// Export the auth instance methods
const getInstance = () => getAuth();

export const auth = (...args: Parameters<ReturnType<typeof createAuth>['auth']>) =>
  getInstance().auth(...args);

export const signIn = (...args: Parameters<ReturnType<typeof createAuth>['signIn']>) =>
  getInstance().signIn(...args);

export const signOut = (...args: Parameters<ReturnType<typeof createAuth>['signOut']>) =>
  getInstance().signOut(...args);

export const update = (...args: Parameters<ReturnType<typeof createAuth>['update']>) =>
  getInstance().update(...args);

// Export handlers separately for the API route
export const handlers = {
  GET: async (...args: any[]) => {
    const { handlers } = getInstance();
    return handlers.GET(...args);
  },
  POST: async (...args: any[]) => {
    const { handlers } = getInstance();
    return handlers.POST(...args);
  }
};