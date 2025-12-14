import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Support both standard DATABASE_URL and Prisma Postgres format (AIBO_DB_PRISMA_DATABASE_URL)
const databaseUrl = process.env.DATABASE_URL || 
  process.env.AIBO_DB_PRISMA_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  Object.entries(process.env).find(([key]) => key.includes('PRISMA_DATABASE_URL'))?.[1]

if (!databaseUrl) {
  console.error('DATABASE_URL or Prisma Postgres URL environment variable is not set')
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

