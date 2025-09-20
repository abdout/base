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
    return new URL(safePath, base)
  } catch (error) {
    console.error(`🚨 [SafeURL] Failed to create URL with path="${path}" base="${base}":`, error)
    // Fallback to a safe URL
    return new URL('/', 'https://localhost:3000')
  }
}

// Manual JWT verification for Edge Runtime
async function verifyAuth(request: NextRequest): Promise<boolean> {
  try {
    // NextAuth v5 uses different cookie names
    // Check multiple possible cookie names
    const cookieNames = [
      'authjs.session-token',           // NextAuth v5 default
      '__Secure-authjs.session-token',  // NextAuth v5 with secure
      'next-auth.session-token',        // NextAuth v4 fallback
      '__Secure-next-auth.session-token', // NextAuth v4 secure fallback
    ]

    let sessionToken: string | undefined

    for (const cookieName of cookieNames) {
      const token = request.cookies.get(cookieName)?.value
      if (token) {
        sessionToken = token
        break
      }
    }

    if (!sessionToken) {
      return false
    }

    // Basic validation - check if token exists and has reasonable length
    // JWT tokens are typically 100+ characters
    if (sessionToken && sessionToken.length > 50) {
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
  // Skip logging for asset requests
  const pathname = request.nextUrl.pathname
  const isAsset = pathname.includes('_next') || pathname.includes('favicon')

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

    let pathname = nextUrl.pathname

    // Extract locale from pathname if present
    const currentLocale = i18n.locales.find(locale =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    // Remove locale from pathname for route checking
    if (currentLocale) {
      pathname = pathname.replace(`/${currentLocale}`, '') || '/'
    }

    const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(pathname)
    const isAuthRoute = authRoutes.includes(pathname)

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

    // Skip middleware for API routes
    if (isApiAuthRoute) {
      return NextResponse.next()
    }

    // Handle locale detection/redirection first (only if not an API route)
    if (!currentLocale && !isApiAuthRoute) {
      return localizationMiddleware(request)
    }

    // Verify authentication manually
    const isLoggedIn = await verifyAuth(request)

    if (isAuthRoute) {
      if (isLoggedIn) {
        const redirectUrl = currentLocale
          ? `/${currentLocale}${DEFAULT_LOGIN_REDIRECT}`
          : DEFAULT_LOGIN_REDIRECT
        const fullRedirectUrl = createSafeURL(redirectUrl, baseUrl)
        return NextResponse.redirect(fullRedirectUrl)
      }
      return NextResponse.next()
    }

    // Explicitly protect platform routes
    if (isPlatformRoute && !isLoggedIn) {
      const callbackUrl = request.nextUrl.pathname + nextUrl.search
      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      const loginUrl = currentLocale
        ? `/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`
        : `/login?callbackUrl=${encodedCallbackUrl}`

      const fullLoginUrl = createSafeURL(loginUrl, baseUrl)
      return NextResponse.redirect(fullLoginUrl)
    }

    if (!isLoggedIn && !isPublicRoute) {
      const callbackUrl = request.nextUrl.pathname + nextUrl.search
      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      const loginUrl = currentLocale
        ? `/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`
        : `/login?callbackUrl=${encodedCallbackUrl}`

      const fullLoginUrl = createSafeURL(loginUrl, baseUrl)
      return NextResponse.redirect(fullLoginUrl)
    }

    return NextResponse.next()

  } catch (error) {
    console.error("🚨 [Middleware] Error:", error)
    // Return a safe response to prevent crashes
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|_next|_static|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)'],
}