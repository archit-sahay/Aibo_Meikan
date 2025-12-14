import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
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
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Database connection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

