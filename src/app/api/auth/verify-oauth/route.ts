import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  // Get the current URL information
  const proto = request.headers.get('x-forwarded-proto') || 'https'
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || 'localhost:3000'
  const currentUrl = `${proto}://${host}`

  // Check all OAuth-related environment variables
  const config = {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      VERCEL_URL: process.env.VERCEL_URL,
    },
    detected: {
      protocol: proto,
      host: host,
      fullUrl: currentUrl,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecretExists: !!process.env.FACEBOOK_CLIENT_SECRET,
      expectedCallbackUrl: `${currentUrl}/api/auth/callback/facebook`,
      configuredInFacebook: "Please add this URL to Facebook App settings",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecretExists: !!process.env.GOOGLE_CLIENT_SECRET,
      expectedCallbackUrl: `${currentUrl}/api/auth/callback/google`,
      configuredInGoogle: "Please add this URL to Google Console",
    },
    requiredUrls: {
      facebook: [
        `${currentUrl}/api/auth/callback/facebook`,
        `https://cb.databayt.org/api/auth/callback/facebook`,
        `https://co.databayt.org/api/auth/callback/facebook`,
      ],
      google: [
        `${currentUrl}/api/auth/callback/google`,
        `https://cb.databayt.org/api/auth/callback/google`,
        `https://co.databayt.org/api/auth/callback/google`,
      ]
    },
    instructions: {
      facebook: {
        step1: "Go to https://developers.facebook.com/apps/",
        step2: "Select your app",
        step3: "Navigate to Facebook Login → Settings",
        step4: "Add ALL URLs from 'requiredUrls.facebook' to Valid OAuth Redirect URIs",
        step5: "Ensure 'Client OAuth Login' is ON",
        step6: "Ensure 'Web OAuth Login' is ON",
      },
      google: {
        step1: "Go to https://console.cloud.google.com/",
        step2: "Select your project",
        step3: "Navigate to APIs & Services → Credentials",
        step4: "Click on your OAuth 2.0 Client ID",
        step5: "Add ALL URLs from 'requiredUrls.google' to Authorized redirect URIs",
      }
    }
  }

  return NextResponse.json(config, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}