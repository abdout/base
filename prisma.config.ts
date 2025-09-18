import path from 'node:path'
import type { PrismaConfig } from 'prisma'
import dotenv from 'dotenv'

// Load environment variables when using prisma.config.ts
dotenv.config()

export default {
  schema: path.join('prisma'),
} satisfies PrismaConfig