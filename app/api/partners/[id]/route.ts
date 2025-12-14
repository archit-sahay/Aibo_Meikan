import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return false
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return false
  }

  const providedPassword = authHeader.replace('Bearer ', '').trim()
  return providedPassword === adminPassword.trim()
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthenticated = await verifyAdmin(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { notes } = await request.json()
    const partnerId = params.id

    // Update admin notes for the partner
    const partner = await prisma.partner.update({
      where: { id: partnerId },
      data: {
        adminNotes: notes || null,
      },
    })

    return NextResponse.json({
      success: true,
      partner: {
        ...partner,
        phoneNumbers: Array.isArray(partner.phoneNumbers)
          ? partner.phoneNumbers
          : JSON.parse(partner.phoneNumbers as unknown as string),
        createdAt: partner.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Update notes error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notes' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthenticated = await verifyAdmin(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const partnerId = params.id

    // Delete the partner
    await prisma.partner.delete({
      where: { id: partnerId },
    })

    return NextResponse.json({
      success: true,
      message: 'Partner deleted successfully',
    })
  } catch (error) {
    console.error('Delete partner error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        success: false, 
        error: process.env.NODE_ENV === 'development' 
          ? `Failed to delete partner: ${errorMessage}` 
          : 'Failed to delete partner' 
      },
      { status: 500 }
    )
  }
}
