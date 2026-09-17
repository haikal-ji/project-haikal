import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaVersion?: string
}

// Invalidate cached Prisma client in development when schema is updated
const SCHEMA_VERSION = 'v2-with-bio'

export const prisma =
  globalForPrisma.prisma && globalForPrisma.prismaVersion === SCHEMA_VERSION
    ? globalForPrisma.prisma
    : new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaVersion = SCHEMA_VERSION
}
