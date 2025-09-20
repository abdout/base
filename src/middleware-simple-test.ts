import { NextRequest, NextResponse } from 'next/server'

// Simple middleware without NextAuth to test URL construction
export default function middleware(request: NextRequest) {
  console.log("🧪 [SimpleMiddleware] === STARTING ===")
  console.log("🧪 [SimpleMiddleware] Request URL:", request.url)
  console.log("🧪 [SimpleMiddleware] Request nextUrl:", request.nextUrl)
  console.log("🧪 [SimpleMiddleware] Request nextUrl.href:", request.nextUrl.href)
  console.log("🧪 [SimpleMiddleware] Request nextUrl.origin:", request.nextUrl.origin)
  console.log("🧪 [SimpleMiddleware] Request nextUrl.pathname:", request.nextUrl.pathname)

  // Get headers
  const protocol = request.headers?.get('x-forwarded-proto') || 'https'
  const host = request.headers?.get('host') || request.headers?.get('x-forwarded-host')

  console.log("🧪 [SimpleMiddleware] Protocol:", protocol)
  console.log("🧪 [SimpleMiddleware] Host:", host)

  // Try to construct baseUrl the same way
  let baseUrl: string
  try {
    if (host) {
      baseUrl = `${protocol}://${host}`
    } else {
      baseUrl = request.nextUrl.origin
    }
    console.log("🧪 [SimpleMiddleware] Constructed baseUrl:", baseUrl)

    // Test URL construction
    const testUrl = new URL('/', baseUrl)
    console.log("🧪 [SimpleMiddleware] Test URL successful:", testUrl.href)

  } catch (error) {
    console.error("🚨 [SimpleMiddleware] ERROR in URL construction:", error)
    console.error("🚨 [SimpleMiddleware] host:", host)
    console.error("🚨 [SimpleMiddleware] protocol:", protocol)
    console.error("🚨 [SimpleMiddleware] baseUrl:", baseUrl)
    console.error("🚨 [SimpleMiddleware] request.nextUrl.origin:", request.nextUrl.origin)
  }

  console.log("🧪 [SimpleMiddleware] === ENDING ===")
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_static|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)'],
}