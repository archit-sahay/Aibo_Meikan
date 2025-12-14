'use client'

import { useState } from 'react'
import type { Partner } from '@/types'
import { NotesModal } from './NotesModal'

interface PartnerListProps {
  partners: Partner[]
  onUpdateNotes: (partnerId: string, notes: string) => Promise<void>
}

export function PartnerList({ partners, onUpdateNotes }: PartnerListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredPartners = partners.filter((partner) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      partner.name.toLowerCase().includes(searchLower) ||
      partner.uniqueCode.toLowerCase().includes(searchLower) ||
      partner.email?.toLowerCase().includes(searchLower) ||
      partner.city.toLowerCase().includes(searchLower) ||
      partner.state.toLowerCase().includes(searchLower) ||
      partner.phoneNumbers.some((phone) => phone.includes(searchTerm))
    )
  })

  const handleOpenNotes = (partner: Partner) => {
    setSelectedPartner(partner)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPartner(null)
  }

  const handleSaveNotes = async (notes: string) => {
    if (selectedPartner) {
      await onUpdateNotes(selectedPartner.id, notes)
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <input
          type="text"
          placeholder="Search partners by name, code, email, city, state, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Admin Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No partners found matching your search.' : 'No partners registered yet.'}
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {partner.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {partner.phoneNumbers.join(', ')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <div>{partner.address}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {partner.city}, {partner.state} - {partner.pinCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {partner.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-mono font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {partner.uniqueCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(partner.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleOpenNotes(partner)}
                        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        {partner.adminNotes ? 'Edit Notes' : 'Add Notes'}
                      </button>
                      {partner.adminNotes && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {partner.adminNotes.length > 50
                            ? `${partner.adminNotes.substring(0, 50)}...`
                            : partner.adminNotes}
                        </p>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Showing {filteredPartners.length} of {partners.length} partners
      </div>

      {selectedPartner && (
        <NotesModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          currentNotes={selectedPartner.adminNotes}
          partnerName={selectedPartner.name}
          onSave={handleSaveNotes}
        />
      )}
    </div>
  )
}

