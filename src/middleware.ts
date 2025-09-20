import { auth } from "./auth-edge"
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes
} from "./routes"
import { localizationMiddleware } from '@/components/local/middleware'
import { i18n } from '@/components/local/config'

// Middleware using Next.js 14/15 syntax
export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Construct proper base URL for redirects
  const protocol = req.headers?.get('x-forwarded-proto') || 'https'
  const host = req.headers?.get('host') || req.headers?.get('x-forwarded-host')
  const baseUrl = host ? `${protocol}://${host}` : nextUrl.origin

  // DEBUG: Add comprehensive logging
  console.log("🌐 [Middleware] === DEBUG START ===")
  console.log("🌐 [Middleware] Request URL:", req.url)
  console.log("🌐 [Middleware] nextUrl.pathname:", nextUrl.pathname)
  console.log("🌐 [Middleware] nextUrl.href:", nextUrl.href)
  console.log("🌐 [Middleware] nextUrl.origin:", nextUrl.origin)
  console.log("🌐 [Middleware] Headers:")
  console.log("  - x-forwarded-proto:", req.headers?.get('x-forwarded-proto'))
  console.log("  - host:", req.headers?.get('host'))
  console.log("  - x-forwarded-host:", req.headers?.get('x-forwarded-host'))
  console.log("🌐 [Middleware] Constructed baseUrl:", baseUrl)
  console.log("🌐 [Middleware] isLoggedIn:", isLoggedIn)

  let pathname = nextUrl.pathname

  // Extract locale from pathname if present
  const currentLocale = i18n.locales.find(locale =>
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  console.log("🌐 [Middleware] Original pathname:", pathname)
  console.log("🌐 [Middleware] Detected currentLocale:", currentLocale)

  // Remove locale from pathname for route checking
  if (currentLocale) {
    pathname = pathname.replace(`/${currentLocale}`, '') || '/'
  }

  console.log("🌐 [Middleware] Processed pathname:", pathname)

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)

  console.log("🌐 [Middleware] Route checks:")
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

  console.log("🌐 [Middleware] isPlatformRoute:", isPlatformRoute)

  // Skip middleware for API routes
  if (isApiAuthRoute) {
    console.log("🌐 [Middleware] Skipping API auth route")
    return
  }

  // Handle locale detection/redirection first (only if not an API route)
  if (!currentLocale && !isApiAuthRoute) {
    console.log("🌐 [Middleware] No locale detected, calling localizationMiddleware")
    return localizationMiddleware(req)
  }

  if (isAuthRoute) {
    console.log("🌐 [Middleware] Processing auth route")
    if (isLoggedIn) {
      const redirectUrl = currentLocale
        ? `/${currentLocale}${DEFAULT_LOGIN_REDIRECT}`
        : DEFAULT_LOGIN_REDIRECT
      console.log("🌐 [Middleware] Auth redirect URL:", redirectUrl)
      console.log("🌐 [Middleware] Base URL for redirect:", baseUrl)

      try {
        const fullRedirectUrl = new URL(redirectUrl, baseUrl)
        console.log("🌐 [Middleware] Full redirect URL constructed:", fullRedirectUrl.href)
        return Response.redirect(fullRedirectUrl)
      } catch (error) {
        console.error("🚨 [Middleware] ERROR creating URL for auth redirect:", error)
        console.error("🚨 [Middleware] redirectUrl:", redirectUrl)
        console.error("🚨 [Middleware] baseUrl:", baseUrl)
        throw error
      }
    }
    return
  }

  // Explicitly protect platform routes
  if (isPlatformRoute && !isLoggedIn) {
    console.log("🌐 [Middleware] Platform route requires auth, redirecting to login")
    const callbackUrl = req.nextUrl.pathname + nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    const loginUrl = currentLocale
      ? `/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`
      : `/login?callbackUrl=${encodedCallbackUrl}`

    console.log("🌐 [Middleware] Platform redirect - callbackUrl:", callbackUrl)
    console.log("🌐 [Middleware] Platform redirect - encodedCallbackUrl:", encodedCallbackUrl)
    console.log("🌐 [Middleware] Platform redirect - loginUrl:", loginUrl)
    console.log("🌐 [Middleware] Platform redirect - baseUrl:", baseUrl)

    try {
      const fullLoginUrl = new URL(loginUrl, baseUrl)
      console.log("🌐 [Middleware] Platform redirect - Full URL constructed:", fullLoginUrl.href)
      return Response.redirect(fullLoginUrl)
    } catch (error) {
      console.error("🚨 [Middleware] ERROR creating URL for platform redirect:", error)
      console.error("🚨 [Middleware] loginUrl:", loginUrl)
      console.error("🚨 [Middleware] baseUrl:", baseUrl)
      throw error
    }
  }

  if (!isLoggedIn && !isPublicRoute) {
    console.log("🌐 [Middleware] Non-public route requires auth, redirecting to login")
    const callbackUrl = req.nextUrl.pathname + nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    const loginUrl = currentLocale
      ? `/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`
      : `/login?callbackUrl=${encodedCallbackUrl}`

    console.log("🌐 [Middleware] General redirect - callbackUrl:", callbackUrl)
    console.log("🌐 [Middleware] General redirect - encodedCallbackUrl:", encodedCallbackUrl)
    console.log("🌐 [Middleware] General redirect - loginUrl:", loginUrl)
    console.log("🌐 [Middleware] General redirect - baseUrl:", baseUrl)

    try {
      const fullLoginUrl = new URL(loginUrl, baseUrl)
      console.log("🌐 [Middleware] General redirect - Full URL constructed:", fullLoginUrl.href)
      return Response.redirect(fullLoginUrl)
    } catch (error) {
      console.error("🚨 [Middleware] ERROR creating URL for general redirect:", error)
      console.error("🚨 [Middleware] loginUrl:", loginUrl)
      console.error("🚨 [Middleware] baseUrl:", baseUrl)
      throw error
    }
  }

  console.log("🌐 [Middleware] No action needed, continuing")
  console.log("🌐 [Middleware] === DEBUG END ===")
  return
})

// Middleware must run in Edge Runtime
// Note: Authentication checks work in Edge Runtime via NextAuth

export const config = {
  matcher: ['/((?!api|_next|_static|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)'],
}