import { useState, useEffect, useMemo } from 'react'
import {
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Receipt,
  Plus,
  Edit3,
  Check,
  X,
  UserCheck,
  Sparkles,
} from 'lucide-react'
import { Input, Button, Modal, Select } from '../../../components/common'
import { useClientStore } from '../../clients/store/clientStore'
import { INITIAL_CLIENTS } from '../../clients/utils/clientHelpers'

export const ClientDetailsForm = ({
  client = {},
  onChange = () => {},
  className = '',
}) => {
  const { clients, fetchClients, createClient } = useClientStore()

  // Modal & inline edit state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditingInline, setIsEditingInline] = useState(false)
  const [isSubmittingNew, setIsSubmittingNew] = useState(false)

  // New client modal form state
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    taxNumber: '',
  })
  const [newClientErrors, setNewClientErrors] = useState({})

  // Fetch clients on mount if empty
  useEffect(() => {
    if (!clients || clients.length === 0) {
      fetchClients()
    }
  }, [clients, fetchClients])

  // Combine clients list with default seeds for fallback
  const allClients = useMemo(() => {
    if (Array.isArray(clients) && clients.length > 0) {
      return clients
    }
    return INITIAL_CLIENTS
  }, [clients])

  // Map to select options
  const clientOptions = useMemo(() => {
    return allClients.map((c) => ({
      value: String(c.id),
      label: `${c.companyName} — ${c.name || 'Contact'} (${c.email || 'No email'})`,
      clientData: c,
    }))
  }, [allClients])

  // Identify selected client in the options
  const selectedOption = useMemo(() => {
    if (!client?.companyName && !client?.name && !client?.email) return null
    return (
      allClients.find(
        (c) =>
          (c.companyName && client.companyName && c.companyName.toLowerCase() === client.companyName.toLowerCase()) ||
          (c.email && client.email && c.email.toLowerCase() === client.email.toLowerCase())
      ) || null
    )
  }, [allClients, client])

  const selectedValue = selectedOption ? String(selectedOption.id) : ''

  // Has active client data
  const hasClientData = Boolean(
    client?.companyName || client?.name || client?.email
  )

  // Handle client selection from dropdown
  const handleSelectClient = (clientId) => {
    if (!clientId) {
      handleClear()
      return
    }

    const found = allClients.find((c) => String(c.id) === String(clientId))
    if (found) {
      onChange({
        name: found.name || '',
        companyName: found.companyName || '',
        email: found.email || '',
        phone: found.phone || '',
        address: found.address || '',
        taxNumber: found.taxNumber || '',
      })
      setIsEditingInline(false)
    }
  }

  // Handle clear
  const handleClear = () => {
    onChange({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      taxNumber: '',
    })
    setIsEditingInline(false)
  }

  // Open modal
  const handleOpenModal = () => {
    setNewClientForm({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      taxNumber: '',
    })
    setNewClientErrors({})
    setIsModalOpen(true)
  }

  // Save new client from modal
  const handleSaveNewClient = async (e) => {
    if (e) e.preventDefault()

    const errors = {}
    if (!newClientForm.companyName.trim()) {
      errors.companyName = 'Company name is required'
    }
    if (!newClientForm.name.trim()) {
      errors.name = 'Contact person name is required'
    }
    if (!newClientForm.email.trim()) {
      errors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClientForm.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (Object.keys(errors).length > 0) {
      setNewClientErrors(errors)
      return
    }

    setIsSubmittingNew(true)
    try {
      const created = await createClient({
        name: newClientForm.name.trim(),
        companyName: newClientForm.companyName.trim(),
        email: newClientForm.email.trim(),
        phone: newClientForm.phone.trim(),
        address: newClientForm.address.trim(),
        taxNumber: newClientForm.taxNumber.trim(),
        status: 'active',
      })

      // Select this client into proposal
      onChange({
        name: created.name,
        companyName: created.companyName,
        email: created.email,
        phone: created.phone,
        address: created.address,
        taxNumber: created.taxNumber,
      })

      setIsModalOpen(false)
      setIsEditingInline(false)
    } catch (err) {
      setNewClientErrors({ general: err.message || 'Failed to save new client' })
    } finally {
      setIsSubmittingNew(false)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF]">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Client Organization & Contact Person
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Recipient information shown on document covers, legal clauses, and sign-offs.
              </p>
            </div>
          </div>

          {hasClientData && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-xs text-gray-600"
              >
                Clear Selection
              </Button>
            </div>
          )}
        </div>

        {/* Selection & Add Action Section */}
        <div className="pt-5 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1">
              <Select
                label="Select Client from Directory"
                placeholder="Search and select existing client..."
                options={clientOptions}
                value={selectedValue}
                onChange={handleSelectClient}
                searchable
                clearable
              />
            </div>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleOpenModal}
              icon={Plus}
              className="text-xs font-semibold shrink-0 mb-0.5 h-[42px]"
            >
              Add New Client
            </Button>
          </div>
        </div>

        {/* Display Selected Client Details */}
        {hasClientData ? (
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/30 p-5 transition-all">
            {/* Details Top Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-blue-100/70">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#0055FF] animate-pulse" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Selected Client Details
                </span>
                {selectedOption && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0055FF] bg-blue-100/60 px-2 py-0.5 rounded-md">
                    <UserCheck className="w-3 h-3" />
                    Directory Match
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingInline(!isEditingInline)}
                  icon={isEditingInline ? Check : Edit3}
                  className="text-xs bg-white text-gray-700"
                >
                  {isEditingInline ? 'Done Editing' : 'Edit for this Proposal'}
                </Button>
              </div>
            </div>

            {/* Read-Only Structured View vs Inline Edit Form */}
            {!isEditingInline ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Company Name */}
                <div className="p-3.5 bg-white rounded-xl border border-gray-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>Company Name</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 break-words">
                    {client.companyName || '—'}
                  </p>
                </div>

                {/* Primary Contact */}
                <div className="p-3.5 bg-white rounded-xl border border-gray-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
                    <Users className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>Contact Person</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 break-words">
                    {client.name || '—'}
                  </p>
                </div>

                {/* Email Address */}
                <div className="p-3.5 bg-white rounded-xl border border-gray-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
                    <Mail className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>Email Address</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 break-all">
                    {client.email || '—'}
                  </p>
                </div>

                {/* Phone Number */}
                <div className="p-3.5 bg-white rounded-xl border border-gray-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
                    <Phone className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>Phone Number</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {client.phone || '—'}
                  </p>
                </div>

                {/* Tax ID */}
                <div className="p-3.5 bg-white rounded-xl border border-gray-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
                    <Receipt className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>Tax ID / GSTIN / VAT</span>
                  </div>
                  <p className="text-sm font-mono font-medium text-gray-900">
                    {client.taxNumber || '—'}
                  </p>
                </div>

                {/* Address */}
                <div className="p-3.5 bg-white rounded-xl border border-gray-200/70 shadow-2xs md:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>Registered Address</span>
                  </div>
                  <p className="text-xs font-medium text-gray-800 line-clamp-2">
                    {client.address || '—'}
                  </p>
                </div>
              </div>
            ) : (
              /* Inline Editable Form for Proposal Specific Tweaks */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-blue-200 shadow-2xs">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Company / Organization Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={client.companyName || ''}
                    onChange={(e) => onChange({ companyName: e.target.value })}
                    placeholder="e.g. Apex Global Enterprises Inc."
                    icon={Building2}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Primary Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={client.name || ''}
                    onChange={(e) => onChange({ name: e.target.value })}
                    placeholder="e.g. Mr. Rohan Mehta"
                    icon={Users}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={client.email || ''}
                    onChange={(e) => onChange({ email: e.target.value })}
                    placeholder="e.g. rohan.mehta@apexglobal.com"
                    icon={Mail}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    value={client.phone || ''}
                    onChange={(e) => onChange({ phone: e.target.value })}
                    placeholder="e.g. +91 98201 12345"
                    icon={Phone}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Billing & Registered Address
                  </label>
                  <Input
                    value={client.address || ''}
                    onChange={(e) => onChange({ address: e.target.value })}
                    placeholder="e.g. Level 14, Commercial Plaza, Bandra-Kurla Complex, Mumbai 400051"
                    icon={MapPin}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Tax ID / GSTIN / VAT Registration
                  </label>
                  <Input
                    value={client.taxNumber || ''}
                    onChange={(e) => onChange({ taxNumber: e.target.value })}
                    placeholder="e.g. 27AAACE5678B1Z2"
                    icon={Receipt}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State when no client selected */
          <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 mx-auto mb-3 shadow-2xs">
              <Users className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">No Client Selected</h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
              Select an existing client from your directory using the dropdown above, or click below to register a new client.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenModal}
              icon={Plus}
              className="text-xs font-semibold text-[#0055FF] border-blue-200 hover:bg-blue-50"
            >
              Add New Client
            </Button>
          </div>
        )}
      </div>

      {/* New Client Popup Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Client"
        description="Enter the client organization and primary contact details. This client will be saved to your directory and applied to this proposal."
        size="2xl"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmittingNew}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveNewClient}
              loading={isSubmittingNew}
              icon={Sparkles}
            >
              Save & Apply Client
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveNewClient} className="space-y-4 py-1">
          {newClientErrors.general && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {newClientErrors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Company / Organization Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={newClientForm.companyName}
                onChange={(e) =>
                  setNewClientForm((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                placeholder="e.g. Acme Technologies Inc."
                icon={Building2}
                error={newClientErrors.companyName}
                required
              />
            </div>

            {/* Contact Person Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Primary Contact Person Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={newClientForm.name}
                onChange={(e) =>
                  setNewClientForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="e.g. Mark Henderson"
                icon={Users}
                error={newClientErrors.name}
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={newClientForm.email}
                onChange={(e) =>
                  setNewClientForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="e.g. mark@acme.io"
                icon={Mail}
                error={newClientErrors.email}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Phone Number
              </label>
              <Input
                type="tel"
                value={newClientForm.phone}
                onChange={(e) =>
                  setNewClientForm((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="e.g. +1 (555) 382-9102"
                icon={Phone}
              />
            </div>

            {/* Billing Address */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">
                Billing & Registered Address
              </label>
              <Input
                value={newClientForm.address}
                onChange={(e) =>
                  setNewClientForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="e.g. 100 Montgomery St, Suite 1200, San Francisco, CA"
                icon={MapPin}
              />
            </div>

            {/* Tax Number */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">
                Tax ID / GSTIN / VAT Registration
              </label>
              <Input
                value={newClientForm.taxNumber}
                onChange={(e) =>
                  setNewClientForm((prev) => ({
                    ...prev,
                    taxNumber: e.target.value,
                  }))
                }
                placeholder="e.g. 27AAACE5678B1Z2 or US-EIN-94301928"
                icon={Receipt}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ClientDetailsForm
