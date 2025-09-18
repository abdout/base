import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  console.log("📊 [Session Check] Current session:", {
    exists: !!session,
    user: session?.user,
    expires: session?.expires
  })

  return NextResponse.json({
    authenticated: !!session,
    session
  })
}