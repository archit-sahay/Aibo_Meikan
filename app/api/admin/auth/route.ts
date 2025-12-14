import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Trim whitespace from both password and stored value for comparison
    const trimmedPassword = password.trim()
    const trimmedAdminPassword = adminPassword.trim()
    
    if (trimmedPassword === trimmedAdminPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

