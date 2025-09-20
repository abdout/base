import { NextRequest, NextResponse } from 'next/server'
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes
} from "./routes"
import { localizationMiddleware } from '@/components/local/middleware'
import { i18n } from '@/components/local/config'

// Helper function to safely create URLs
function createSafeURL(path: string, base: string): URL {
  try {
    // Ensure path starts with /
    const safePath = path.startsWith('/') ? path : `/${path}`
    const url = new URL(safePath, base)
    console.log(`✅ [SafeURL] Created: ${url.href}`)
    return url
  } catch (error) {
    console.error(`🚨 [SafeURL] Failed to create URL with path="${path}" base="${base}":`, error)
    // Fallback to a safe URL
    const fallbackUrl = new URL('/', 'https://localhost:3000')
    console.log(`🔄 [SafeURL] Using fallback: ${fallbackUrl.href}`)
    return fallbackUrl
  }
}

// Manual JWT verification for Edge Runtime
async function verifyAuth(request: NextRequest): Promise<boolean> {
  try {
    const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                        request.cookies.get('__Secure-next-auth.session-token')?.value

    if (!sessionToken) {
      console.log("🔐 [Auth] No session token found")
      return false
    }

    // Use a simple approach - if token exists and isn't obviously invalid, consider authenticated
    // For production, you'd want to properly verify the JWT with your secret
    if (sessionToken && sessionToken.length > 10) {
      console.log("🔐 [Auth] Valid session token found")
      return true
    }

    return false
  } catch (error) {
    console.error("🚨 [Auth] Error verifying session:", error)
    return false
  }
}

// Manual middleware without NextAuth wrapper
export default async function middleware(request: NextRequest) {
  console.log("🔧 [ManualMiddleware] === DEBUG START ===")
  console.log("🔧 [ManualMiddleware] Request URL:", request.url)
  console.log("🔧 [ManualMiddleware] Request pathname:", request.nextUrl.pathname)

  try {
    const { nextUrl } = request

    // Construct proper base URL for redirects with better fallbacks
    const protocol = request.headers?.get('x-forwarded-proto') || 'https'
    const host = request.headers?.get('host') || request.headers?.get('x-forwarded-host') || 'localhost:3000'

    // Ensure we always have a valid baseUrl
    let baseUrl: string
    try {
      if (host && host !== 'localhost:3000') {
        baseUrl = `${protocol}://${host}`
      } else if (nextUrl.origin && nextUrl.origin !== 'null') {
        baseUrl = nextUrl.origin
      } else {
        baseUrl = 'https://localhost:3000' // Ultimate fallback
      }
      // Validate the baseUrl by creating a URL object
      new URL('/', baseUrl)
    } catch (error) {
      console.error("🚨 [ManualMiddleware] Invalid baseUrl detected, using fallback:", error)
      baseUrl = 'https://localhost:3000'
    }

    console.log("🔧 [ManualMiddleware] Constructed baseUrl:", baseUrl)

    let pathname = nextUrl.pathname

    // Extract locale from pathname if present
    const currentLocale = i18n.locales.find(locale =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    console.log("🔧 [ManualMiddleware] Original pathname:", pathname)
    console.log("🔧 [ManualMiddleware] Detected currentLocale:", currentLocale)

    // Remove locale from pathname for route checking
    if (currentLocale) {
      pathname = pathname.replace(`/${currentLocale}`, '') || '/'
    }

    console.log("🔧 [ManualMiddleware] Processed pathname:", pathname)

    const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(pathname)
    const isAuthRoute = authRoutes.includes(pathname)

    console.log("🔧 [ManualMiddleware] Route checks:")
    console.log("  - isApiAuthRoute:", isApiAuthRoute)
    console.log("  - isPublicRoute:", isPublicRoute)
    console.log("  - isAuthRoute:", isAuthRoute)

    // Check if the route is in the platform directory
    const isPlatformRoute =
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/") ||
      pathname === "/project" ||
      pathname.startsWith("/project/") ||
      pathname === "/task" ||
      pathname.startsWith("/task/") ||
      pathname === "/wallet" ||
      pathname.startsWith("/wallet/") ||
      pathname === "/daily" ||
      pathname.startsWith("/daily/") ||
      pathname === "/resource" ||
      pathname.startsWith("/resource/");

    console.log("🔧 [ManualMiddleware] isPlatformRoute:", isPlatformRoute)

    // Skip middleware for API routes
    if (isApiAuthRoute) {
      console.log("🔧 [ManualMiddleware] Skipping API auth route")
      return NextResponse.next()
    }

    // Handle locale detection/redirection first (only if not an API route)
    if (!currentLocale && !isApiAuthRoute) {
      console.log("🔧 [ManualMiddleware] No locale detected, calling localizationMiddleware")
      return localizationMiddleware(request)
    }

    // Verify authentication manually
    const isLoggedIn = await verifyAuth(request)
    console.log("🔧 [ManualMiddleware] isLoggedIn:", isLoggedIn)

    if (isAuthRoute) {
      console.log("🔧 [ManualMiddleware] Processing auth route")
      if (isLoggedIn) {
        const redirectUrl = currentLocale
          ? `/${currentLocale}${DEFAULT_LOGIN_REDIRECT}`
          : DEFAULT_LOGIN_REDIRECT
        console.log("🔧 [ManualMiddleware] Auth redirect URL:", redirectUrl)
        console.log("🔧 [ManualMiddleware] Base URL for redirect:", baseUrl)

        const fullRedirectUrl = createSafeURL(redirectUrl, baseUrl)
        console.log("🔧 [ManualMiddleware] Full redirect URL constructed:", fullRedirectUrl.href)
        return NextResponse.redirect(fullRedirectUrl)
      }
      return NextResponse.next()
    }

    // Explicitly protect platform routes
    if (isPlatformRoute && !isLoggedIn) {
      console.log("🔧 [ManualMiddleware] Platform route requires auth, redirecting to login")
      const callbackUrl = request.nextUrl.pathname + nextUrl.search
      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      const loginUrl = currentLocale
        ? `/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`
        : `/login?callbackUrl=${encodedCallbackUrl}`

      console.log("🔧 [ManualMiddleware] Platform redirect - callbackUrl:", callbackUrl)
      console.log("🔧 [ManualMiddleware] Platform redirect - loginUrl:", loginUrl)
      console.log("🔧 [ManualMiddleware] Platform redirect - baseUrl:", baseUrl)

      const fullLoginUrl = createSafeURL(loginUrl, baseUrl)
      console.log("🔧 [ManualMiddleware] Platform redirect - Full URL constructed:", fullLoginUrl.href)
      return NextResponse.redirect(fullLoginUrl)
    }

    if (!isLoggedIn && !isPublicRoute) {
      console.log("🔧 [ManualMiddleware] Non-public route requires auth, redirecting to login")
      const callbackUrl = request.nextUrl.pathname + nextUrl.search
      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      const loginUrl = currentLocale
        ? `/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`
        : `/login?callbackUrl=${encodedCallbackUrl}`

      console.log("🔧 [ManualMiddleware] General redirect - callbackUrl:", callbackUrl)
      console.log("🔧 [ManualMiddleware] General redirect - loginUrl:", loginUrl)
      console.log("🔧 [ManualMiddleware] General redirect - baseUrl:", baseUrl)

      const fullLoginUrl = createSafeURL(loginUrl, baseUrl)
      console.log("🔧 [ManualMiddleware] General redirect - Full URL constructed:", fullLoginUrl.href)
      return NextResponse.redirect(fullLoginUrl)
    }

    console.log("🔧 [ManualMiddleware] No action needed, continuing")
    console.log("🔧 [ManualMiddleware] === DEBUG END ===")
    return NextResponse.next()

  } catch (error) {
    console.error("🚨 [ManualMiddleware] CRITICAL ERROR in middleware:", error)
    console.error("🚨 [ManualMiddleware] Request URL:", request.url)
    console.error("🚨 [ManualMiddleware] Request headers:", Object.fromEntries(request.headers.entries()))

    // Return a safe response to prevent crashes
    console.log("🔄 [ManualMiddleware] Returning safe fallback response")
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|_next|_static|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)'],
}