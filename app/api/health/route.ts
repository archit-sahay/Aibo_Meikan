import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Check if DATABASE_URL is set (support Prisma Postgres format too)
    const databaseUrl = process.env.DATABASE_URL || 
      process.env.AIBO_DB_PRISMA_DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      Object.entries(process.env).find(([key]) => key.includes('PRISMA_DATABASE_URL'))?.[1]
    
    if (!databaseUrl) {
      return NextResponse.json(
        {
          status: 'error',
          database: 'not_configured',
          error: 'DATABASE_URL or Prisma Postgres URL environment variable is not set',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }

    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Database connection failed. Please check DATABASE_URL.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

