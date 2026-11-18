import { useState } from 'react'
import {
  Building2,
  Users,
  Mail,
  Phone,
  Globe,
  MapPin,
  Receipt,
  FileText,
  Save,
  Loader2,
} from 'lucide-react'
import { Input, Textarea, Select, Button } from '../../../components/common'
import {
  COUNTRY_OPTIONS,
  CLIENT_STATUS_OPTIONS,
  validateClient,
} from '../utils/clientHelpers'

export const ClientForm = ({
  initialData = {},
  onSubmit = () => {},
  onCancel = () => {},
  isSaving = false,
  isEditMode = false,
  className = '',
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    companyName: initialData.companyName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    website: initialData.website || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    country: initialData.country || 'India',
    postalCode: initialData.postalCode || '',
    taxNumber: initialData.taxNumber || '',
    status: initialData.status || 'active',
    notes: initialData.notes || '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validation = validateClient(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Primary Details Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FB6C00]">
            <Building2 className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Company & Primary Contact
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter the organizational and primary liaison details for this account.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Company / Organization Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="e.g. Acme Technologies Inc."
              icon={Building2}
              error={errors.companyName}
              required
            />
          </div>

          {/* Contact Person Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Contact Person Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Mark Henderson"
              icon={Users}
              error={errors.name}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. mark@acme.io"
              icon={Mail}
              error={errors.email}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Phone Number
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. +1 (555) 382-9102"
              icon={Phone}
            />
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Website URL
            </label>
            <Input
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://acme.io"
              icon={Globe}
              error={errors.website}
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Account Status
            </label>
            <Select
              options={CLIENT_STATUS_OPTIONS}
              value={formData.status}
              onChange={(val) => handleChange('status', val)}
            />
          </div>
        </div>
      </div>

      {/* Address & Tax Details Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FB6C00]">
            <MapPin className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Billing Address & Tax Identification
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Used on proposal cover sheets, invoices, and legal agreements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Street Address */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
            <label className="text-xs font-semibold text-gray-700">
              Street / Building Address
            </label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. 100 Montgomery St, Suite 1200"
              icon={MapPin}
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              City
            </label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. San Francisco"
            />
          </div>

          {/* State / Province */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              State / Province
            </label>
            <Input
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="e.g. California"
            />
          </div>

          {/* Postal Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Postal / ZIP Code
            </label>
            <Input
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              placeholder="e.g. 94104"
            />
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Country
            </label>
            <Select
              options={COUNTRY_OPTIONS}
              value={formData.country}
              onChange={(val) => handleChange('country', val)}
            />
          </div>

          {/* Tax / GST Number */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-gray-700">
              Tax Registration Number / GSTIN / VAT ID
            </label>
            <Input
              value={formData.taxNumber}
              onChange={(e) => handleChange('taxNumber', e.target.value)}
              placeholder="e.g. 27AAACE5678B1Z2 or US-EIN-94301928"
              icon={Receipt}
            />
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          Internal Client Notes & Scope Context
        </label>
        <Textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Add any specific context, invoicing preferences, or meeting notes..."
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="text-xs"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={isSaving}
          icon={isSaving ? Loader2 : Save}
          className="text-xs font-semibold"
        >
          {isSaving
            ? 'Saving Client...'
            : isEditMode
            ? 'Update Client Profile'
            : 'Create Client Record'}
        </Button>
      </div>
    </form>
  )
}

export default ClientForm
