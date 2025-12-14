import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateUniqueCode } from '@/lib/utils'
import type { RegisterFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.city || !body.state || !body.pinCode || !body.address) {
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
        email: body.email?.trim() || null,
        uniqueCode,
      },
    })

    return NextResponse.json({
      success: true,
      uniqueCode: partner.uniqueCode,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}

