'use client'

import { useState } from 'react'
import { isValidEmail, isValidPhoneNumber, formatPhoneNumber } from '@/lib/utils'
import type { RegisterFormData, RegisterResponse } from '@/types'

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    phoneNumbers: [''],
    city: '',
    state: '',
    pinCode: '',
    address: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; uniqueCode?: string } | null>(null)

  const addPhoneField = () => {
    setFormData({
      ...formData,
      phoneNumbers: [...formData.phoneNumbers, ''],
    })
  }

  const removePhoneField = (index: number) => {
    if (formData.phoneNumbers.length > 1) {
      setFormData({
        ...formData,
        phoneNumbers: formData.phoneNumbers.filter((_, i) => i !== index),
      })
    }
  }

  const updatePhoneNumber = (index: number, value: string) => {
    const updated = [...formData.phoneNumbers]
    updated[index] = value
    setFormData({ ...formData, phoneNumbers: updated })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (formData.phoneNumbers.length === 0 || formData.phoneNumbers.every(p => !p.trim())) {
      newErrors.phoneNumbers = 'At least one phone number is required'
    } else {
      formData.phoneNumbers.forEach((phone, index) => {
        if (phone.trim() && !isValidPhoneNumber(phone)) {
          newErrors[`phone_${index}`] = 'Invalid phone number format'
        }
      })
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'Pin code is required'
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Pin code must be 6 digits'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitResult(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Clean phone numbers
      const cleanedPhoneNumbers = formData.phoneNumbers
        .map(p => formatPhoneNumber(p))
        .filter(p => p.length > 0)

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phoneNumbers: cleanedPhoneNumbers,
          email: formData.email.trim(),
        }),
      })

      const data: RegisterResponse = await response.json()

      if (data.success && data.uniqueCode) {
        setSubmitResult({
          success: true,
          message: 'Registration successful!',
          uniqueCode: data.uniqueCode,
        })
        // Reset form
        setFormData({
          name: '',
          phoneNumbers: [''],
          city: '',
          state: '',
          pinCode: '',
          address: '',
          email: '',
        })
      } else {
        setSubmitResult({
          success: false,
          message: data.error || 'Registration failed. Please try again.',
        })
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'An error occurred. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitResult?.success && submitResult.uniqueCode) {
    return (
      <div className="max-w-2xl mx-auto bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Registration Successful!
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Your unique partner code is:
        </p>
        <div className="bg-white dark:bg-gray-800 border-2 border-green-500 rounded-lg p-6 mb-6">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 font-mono">
            {submitResult.uniqueCode}
          </p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Please save this code for your records.
        </p>
        <button
          onClick={() => setSubmitResult(null)}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Register Another Partner
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {submitResult && !submitResult.success && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{submitResult.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number(s) <span className="text-red-500">*</span>
        </label>
        {formData.phoneNumbers.map((phone, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => updatePhoneNumber(index, e.target.value)}
              placeholder="Enter phone number"
              className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors[`phone_${index}`] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formData.phoneNumbers.length > 1 && (
              <button
                type="button"
                onClick={() => removePhoneField(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {errors.phoneNumbers && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumbers}</p>
        )}
        {formData.phoneNumbers.map((phone, index) => {
          if (errors[`phone_${index}`]) {
            return (
              <p key={`error_${index}`} className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors[`phone_${index}`]}
              </p>
            )
          }
          return null
        })}
        <button
          type="button"
          onClick={addPhoneField}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          + Add another phone number
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.city && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.state && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.state}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Pin Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="pinCode"
          value={formData.pinCode}
          onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.pinCode ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={6}
          required
        />
        {errors.pinCode && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pinCode}</p>}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.address && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Registering...' : 'Register as Partner'}
      </button>
    </form>
  )
}

