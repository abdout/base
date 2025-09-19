import { auth } from "./auth"
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes
} from "./routes"
import { localizationMiddleware } from './components/internationalization/middleware'
import { i18n } from './components/internationalization/config'

// Middleware using Next.js 14/15 syntax
export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  console.log("🌐 [Middleware] Request:", {
    path: nextUrl.pathname,
    isLoggedIn,
    authExists: !!req.auth,
    userId: req.auth?.user?.id
  })

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
    console.log("🔄 [Middleware] API auth route, skipping");
    return
  }

  // Handle locale detection/redirection first (only if not an API route)
  if (!currentLocale && !isApiAuthRoute) {
    return localizationMiddleware(req)
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log("🔃 [Middleware] Already logged in, redirecting from auth route");
      const redirectUrl = currentLocale
        ? `/${currentLocale}${DEFAULT_LOGIN_REDIRECT}`
        : DEFAULT_LOGIN_REDIRECT
      return Response.redirect(new URL(redirectUrl, nextUrl))
    }
    console.log("✅ [Middleware] Auth route accessible (not logged in)");
    return
  }

  // Explicitly protect platform routes
  if (isPlatformRoute && !isLoggedIn) {
    const callbackUrl = req.nextUrl.pathname + nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    const loginUrl = currentLocale
      ? `/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`
      : `/login?callbackUrl=${encodedCallbackUrl}`

    return Response.redirect(new URL(loginUrl, nextUrl))
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = req.nextUrl.pathname + nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    const loginUrl = currentLocale
      ? `/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`
      : `/login?callbackUrl=${encodedCallbackUrl}`

    return Response.redirect(new URL(loginUrl, nextUrl))
  }

  return
})

// Force Node.js runtime for middleware (required for Prisma and bcryptjs)
export const runtime = 'nodejs'

export const config = {
  matcher: ['/((?!api|_next|_static|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)'],
}