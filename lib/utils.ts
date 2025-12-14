import { randomBytes } from 'crypto'

/**
 * Generate a unique partner code
 * Format: PART-{8 random alphanumeric characters}
 */
export function generateUniqueCode(): string {
  const randomPart = randomBytes(4).toString('hex').toUpperCase()
  return `PART-${randomPart}`
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  // Check if it's 10 digits (for Indian numbers) or starts with + and has 10+ digits
  return /^(\+?\d{10,15})$/.test(cleaned)
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '')
}

