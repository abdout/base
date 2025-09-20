import { NextRequest, NextResponse } from "next/server"

// Force Node.js runtime for auth routes (required for Prisma and bcryptjs)
export const runtime = 'nodejs'

// We need to dynamically import auth after setting the URL
async function getAuthHandlers(request: NextRequest) {
  console.log("🔐 [OAuth API] === STARTING OAuth Request ===")
  console.log("🔐 [OAuth API] Request URL:", request.url)
  console.log("🔐 [OAuth API] Request method:", request.method)

  // Log all headers for debugging
  console.log("🔐 [OAuth API] Headers:")
  request.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`)
  })

  // Get the host and protocol
  const proto = request.headers.get('x-forwarded-proto') || 'https'
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || 'localhost:3000'

  console.log("🔐 [OAuth API] Detected protocol:", proto)
  console.log("🔐 [OAuth API] Detected host:", host)

  // Ensure we have a valid URL
  let authUrl = `${proto}://${host}`

  // Validate the URL
  try {
    new URL(authUrl)
    console.log("✅ [OAuth API] Valid auth URL constructed:", authUrl)
  } catch (error) {
    console.error("❌ [OAuth API] Invalid URL constructed:", authUrl)
    console.error("❌ [OAuth API] Error:", error)
    // Fallback to a safe URL
    authUrl = 'https://localhost:3000'
    console.log("🔄 [OAuth API] Using fallback URL:", authUrl)
  }

  // Set the environment variable BEFORE importing auth
  console.log("🔐 [OAuth API] Previous NEXTAUTH_URL:", process.env.NEXTAUTH_URL)
  process.env.NEXTAUTH_URL = authUrl
  console.log("🔐 [OAuth API] New NEXTAUTH_URL set to:", process.env.NEXTAUTH_URL)

  // Now dynamically import auth with the correct URL set
  console.log("🔐 [OAuth API] Dynamically importing auth module...")
  const { GET, POST } = await import("@/auth")
  console.log("🔐 [OAuth API] Auth module imported successfully")

  return { GET, POST }
}

export async function GET(request: NextRequest, context?: any) {
  try {
    console.log("🔐 [OAuth GET] Processing GET request")
    const { GET: handler } = await getAuthHandlers(request)
    const response = await handler(request, context)
    console.log("✅ [OAuth GET] Request completed successfully")
    return response
  } catch (error) {
    console.error("❌ [OAuth GET] Error processing request:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, context?: any) {
  try {
    console.log("🔐 [OAuth POST] Processing POST request")
    const { POST: handler } = await getAuthHandlers(request)
    const response = await handler(request, context)
    console.log("✅ [OAuth POST] Request completed successfully")
    return response
  } catch (error) {
    console.error("❌ [OAuth POST] Error processing request:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
