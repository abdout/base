import { GET, POST } from "@/auth"

// Force Node.js runtime for auth routes (required for Prisma and bcryptjs)
export const runtime = 'nodejs'

export { GET, POST }
