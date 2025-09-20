import { GET as authGET, POST as authPOST } from "@/auth"
import { NextRequest } from "next/server"

// Force Node.js runtime for auth routes (required for Prisma and bcryptjs)
export const runtime = 'nodejs'

// Wrapper to ensure proper URL handling
async function handleRequest(
  request: NextRequest,
  handler: typeof authGET | typeof authPOST,
  context?: any
) {
  // Set NEXTAUTH_URL if not already set
  if (!process.env.NEXTAUTH_URL) {
    const proto = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host')
    if (host) {
      process.env.NEXTAUTH_URL = `${proto}://${host}`
    }
  }

  return handler(request, context)
}

export async function GET(request: NextRequest, context?: any) {
  return handleRequest(request, authGET, context)
}

export async function POST(request: NextRequest, context?: any) {
  return handleRequest(request, authPOST, context)
}
