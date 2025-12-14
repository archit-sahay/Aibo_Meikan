export interface Partner {
  id: string
  name: string
  phoneNumbers: string[]
  city: string
  state: string
  pinCode: string
  address: string
  email: string | null
  uniqueCode: string
  adminNotes: string | null
  createdAt: Date
}

export interface RegisterFormData {
  name: string
  phoneNumbers: string[]
  city: string
  state: string
  pinCode: string
  address: string
  email?: string
}

export interface RegisterResponse {
  success: boolean
  uniqueCode?: string
  error?: string
}

