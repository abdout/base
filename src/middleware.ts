import { auth } from "./auth"
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

  // Debug logging disabled in production
  // console.log("🌐 [Middleware] Request:", nextUrl.pathname)

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
    return
  }

  // Handle locale detection/redirection first (only if not an API route)
  if (!currentLocale && !isApiAuthRoute) {
    return localizationMiddleware(req)
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      const redirectUrl = currentLocale
        ? `/${currentLocale}${DEFAULT_LOGIN_REDIRECT}`
        : DEFAULT_LOGIN_REDIRECT
      return Response.redirect(new URL(redirectUrl, baseUrl))
    }
    return
  }

  // Explicitly protect platform routes
  if (isPlatformRoute && !isLoggedIn) {
    const callbackUrl = req.nextUrl.pathname + nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    const loginUrl = currentLocale
      ? `/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`
      : `/login?callbackUrl=${encodedCallbackUrl}`

    return Response.redirect(new URL(loginUrl, baseUrl))
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = req.nextUrl.pathname + nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    const loginUrl = currentLocale
      ? `/${currentLocale}/login?callbackUrl=${encodedCallbackUrl}`
      : `/login?callbackUrl=${encodedCallbackUrl}`

    return Response.redirect(new URL(loginUrl, baseUrl))
  }

  return
})

// Middleware must run in Edge Runtime
// Note: Authentication checks work in Edge Runtime via NextAuth

export const config = {
  matcher: ['/((?!api|_next|_static|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)'],
}