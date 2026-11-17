import { Users, Building2, Mail, Phone, MapPin, Receipt, Check } from 'lucide-react'
import { Input, Button } from '../../../components/common'
import { PREDEFINED_CLIENTS } from '../utils/proposalHelpers'

export const ClientDetailsForm = ({
  client = {},
  onChange = () => {},
  className = '',
}) => {
  const handleSelectPredefined = (c) => {
    onChange({
      name: c.name,
      companyName: c.companyName,
      email: c.email,
      phone: c.phone,
      address: c.address,
      taxNumber: c.taxNumber,
    })
  }

  const handleClear = () => {
    onChange({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      taxNumber: '',
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
        {/* Header & Quick Selector */}
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

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-xs text-gray-600"
            >
              Clear Fields
            </Button>
          </div>
        </div>

        {/* Quick select pills */}
        <div className="pt-4 pb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
            Quick Fill from Client Directory:
          </p>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_CLIENTS.map((c) => {
              const isSelected = client?.companyName === c.companyName
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectPredefined(c)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-[#0055FF] border-blue-200 shadow-2xs font-semibold'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 opacity-70" />
                  <span>{c.companyName}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0055FF]" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
          {/* Client Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Company / Organization Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={client.companyName || ''}
              onChange={(e) => onChange({ companyName: e.target.value })}
              placeholder="e.g. Apex Global Enterprises Inc."
              icon={Building2}
              required
            />
          </div>

          {/* Contact Person Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Primary Contact Person Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={client.name || ''}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Mr. Rohan Mehta"
              icon={Users}
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
              value={client.email || ''}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="e.g. rohan.mehta@apexglobal.com"
              icon={Mail}
              required
            />
          </div>

          {/* Phone */}
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

          {/* Physical Address */}
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

          {/* Tax Number */}
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
      </div>
    </div>
  )
}

export default ClientDetailsForm
