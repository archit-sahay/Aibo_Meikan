import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return false
  }

  // Get password from Authorization header (format: "Bearer password")
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return false
  }

  const providedPassword = authHeader.replace('Bearer ', '')
  return providedPassword === adminPassword
}

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const partners = await prisma.partner.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform phone numbers from JSON to array
    const transformedPartners = partners.map((partner) => ({
      ...partner,
      phoneNumbers: Array.isArray(partner.phoneNumbers)
        ? partner.phoneNumbers
        : JSON.parse(partner.phoneNumbers as unknown as string),
      createdAt: partner.createdAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      partners: transformedPartners,
    })
  } catch (error) {
    console.error('Fetch partners error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch partners' },
      { status: 500 }
    )
  }
}

