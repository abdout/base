import { getUserByEmail } from "@/components/auth/user";
import { LoginSchema } from "@/components/auth/validation";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

// Environment variable validation on startup
console.log("🔧 [Auth Config] Environment Check:");
console.log("  ✓ GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` : "❌ MISSING");
console.log("  ✓ GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ MISSING");
console.log("  ✓ FACEBOOK_CLIENT_ID:", process.env.FACEBOOK_CLIENT_ID || "❌ MISSING");
console.log("  ✓ FACEBOOK_CLIENT_SECRET:", process.env.FACEBOOK_CLIENT_SECRET ? "✅ Set" : "❌ MISSING");
console.log("  ✓ AUTH_SECRET:", process.env.AUTH_SECRET ? "✅ Set" : "❌ MISSING");
console.log("  ✓ NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ MISSING");
console.log("  ✓ NODE_ENV:", process.env.NODE_ENV);

if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  console.error("⚠️ [Auth Config] Facebook OAuth credentials missing!");
}

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        console.log("🔵 [Google OAuth] Raw profile data:", JSON.stringify(profile, null, 2));
        const mappedProfile = {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: new Date(),
        };
        console.log("✅ [Google OAuth] Mapped profile:", JSON.stringify(mappedProfile, null, 2));
        return mappedProfile;
      },
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profile(profile) {
        console.log("🔵 [Facebook OAuth] Raw profile data:", JSON.stringify(profile, null, 2));
        console.log("🔵 [Facebook OAuth] Client ID:", process.env.FACEBOOK_CLIENT_ID);
        console.log("🔵 [Facebook OAuth] Client Secret exists:", !!process.env.FACEBOOK_CLIENT_SECRET);

        const mappedProfile = {
          id: profile.id,
          name: profile.name || "Facebook User",
          email: profile.email || `${profile.id}@facebook.com`,
          image: profile.picture?.data?.url || null,
          emailVerified: new Date(),
        };
        console.log("✅ [Facebook OAuth] Mapped profile:", JSON.stringify(mappedProfile, null, 2));
        return mappedProfile;
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password,
          );

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ],
} satisfies NextAuthConfig