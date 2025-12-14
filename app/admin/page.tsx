'use client'

import { useState, useEffect } from 'react'
import { AdminLogin } from '@/components/AdminLogin'
import { PartnerList } from '@/components/PartnerList'
import type { Partner } from '@/types'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already authenticated (from localStorage)
    const authStatus = localStorage.getItem('admin_authenticated')
    const adminPassword = localStorage.getItem('admin_password')
    if (authStatus === 'true' && adminPassword) {
      setIsAuthenticated(true)
      fetchPartners()
    }
  }, [])

  const handleLogin = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_authenticated', 'true')
        localStorage.setItem('admin_password', password) // Store password for API calls
        fetchPartners()
        return true
      }
      return false
    } catch (err) {
      console.error('Login error:', err)
      return false
    }
  }

  const fetchPartners = async () => {
    setIsLoading(true)
    setError('')
    try {
      // Get password from localStorage (stored after successful login)
      const adminPassword = localStorage.getItem('admin_password')
      if (!adminPassword) {
        setIsAuthenticated(false)
        localStorage.removeItem('admin_authenticated')
        return
      }

      const response = await fetch('/api/partners', {
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
        },
      })

      if (response.status === 401) {
        setIsAuthenticated(false)
        localStorage.removeItem('admin_authenticated')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch partners')
      }

      const data = await response.json()
      setPartners(data.partners || [])
    } catch (err) {
      setError('Failed to load partners. Please refresh the page.')
      console.error('Fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateNotes = async (partnerId: string, notes: string) => {
    try {
      const adminPassword = localStorage.getItem('admin_password')
      if (!adminPassword) {
        setIsAuthenticated(false)
        localStorage.removeItem('admin_authenticated')
        return
      }

      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) {
        throw new Error('Failed to update notes')
      }

      // Refresh partners list
      fetchPartners()
    } catch (err) {
      console.error('Update notes error:', err)
      throw err
    }
  }

  const handleDeletePartner = async (partnerId: string) => {
    try {
      const adminPassword = localStorage.getItem('admin_password')
      if (!adminPassword) {
        setIsAuthenticated(false)
        localStorage.removeItem('admin_authenticated')
        return
      }

      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete partner')
      }

      // Refresh partners list
      fetchPartners()
    } catch (err) {
      console.error('Delete partner error:', err)
      throw err
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_password')
    setPartners([])
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminLogin onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Partner Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all registered partners
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Loading partners...</p>
        </div>
      ) : (
        <PartnerList 
          partners={partners} 
          onUpdateNotes={handleUpdateNotes}
          onDeletePartner={handleDeletePartner}
        />
      )}
    </div>
  )
}

