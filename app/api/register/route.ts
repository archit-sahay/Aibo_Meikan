import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateUniqueCode } from '@/lib/utils'
import { sendRegistrationEmail } from '@/lib/email'
import type { RegisterFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Check if DATABASE_URL is configured (support Prisma Postgres format too)
    const databaseUrl = process.env.DATABASE_URL || 
      process.env.AIBO_DB_PRISMA_DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      Object.entries(process.env).find(([key]) => key.includes('PRISMA_DATABASE_URL'))?.[1]
    
    if (!databaseUrl) {
      console.error('DATABASE_URL is not configured')
      return NextResponse.json(
        { success: false, error: 'Database not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    const body: RegisterFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.city || !body.state || !body.pinCode || !body.address || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!body.phoneNumbers || body.phoneNumbers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one phone number is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Generate unique code
    let uniqueCode = generateUniqueCode()
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    // Ensure code is unique (retry if collision)
    while (!isUnique && attempts < maxAttempts) {
      const existing = await prisma.partner.findUnique({
        where: { uniqueCode },
      })

      if (!existing) {
        isUnique = true
      } else {
        uniqueCode = generateUniqueCode()
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique code. Please try again.' },
        { status: 500 }
      )
    }

    // Create partner record
    const partner = await prisma.partner.create({
      data: {
        name: body.name.trim(),
        phoneNumbers: body.phoneNumbers,
        city: body.city.trim(),
        state: body.state.trim(),
        pinCode: body.pinCode.trim(),
        address: body.address.trim(),
        email: body.email.trim(),
        uniqueCode,
      },
    })

    // Send registration emails (don't fail registration if email fails)
    try {
      await sendRegistrationEmail({
        name: partner.name,
        email: partner.email,
        uniqueCode: partner.uniqueCode,
        phoneNumbers: Array.isArray(partner.phoneNumbers)
          ? partner.phoneNumbers
          : JSON.parse(partner.phoneNumbers as unknown as string),
        city: partner.city,
        state: partner.state,
        pinCode: partner.pinCode,
        address: partner.address,
      })
    } catch (emailError) {
      console.error('Failed to send registration email:', emailError)
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      uniqueCode: partner.uniqueCode,
    })
  } catch (error) {
    console.error('Registration error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        success: false, 
        error: process.env.NODE_ENV === 'development' 
          ? `Registration failed: ${errorMessage}` 
          : 'Registration failed. Please try again.' 
      },
      { status: 500 }
    )
  }
}

