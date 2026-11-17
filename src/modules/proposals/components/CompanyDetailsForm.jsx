import { Building, Globe, Mail, Phone, MapPin, Receipt, RotateCcw } from 'lucide-react'
import { Input, Button } from '../../../components/common'

export const CompanyDetailsForm = ({
  company = {},
  onChange = () => {},
  onResetDefault = () => {},
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FB6C00]">
              <Building className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Issuing Company Profile & Branding
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Appears in the physical A4 document header, footer, tax invoices, and legal declarations.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetDefault}
            icon={RotateCcw}
            className="text-xs text-gray-600 self-start sm:self-auto"
          >
            Reset to Default Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Company Legal Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={company.name || ''}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. ProposalOS Technologies Ltd."
              required
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Tagline / Subtitle
            </label>
            <Input
              value={company.tagline || ''}
              onChange={(e) => onChange({ tagline: e.target.value })}
              placeholder="e.g. Enterprise Document & Workflow Systems"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Official Contact Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={company.email || ''}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="e.g. contact@proposalos.com"
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
              value={company.phone || ''}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="e.g. +91 98765 43210"
              icon={Phone}
            />
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Website URL
            </label>
            <Input
              value={company.website || ''}
              onChange={(e) => onChange({ website: e.target.value })}
              placeholder="e.g. www.proposalos.com"
              icon={Globe}
            />
          </div>

          {/* Tax Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Company Tax ID / GSTIN
            </label>
            <Input
              value={company.taxNumber || ''}
              onChange={(e) => onChange({ taxNumber: e.target.value })}
              placeholder="e.g. 07AABCP1234F1Z5"
              icon={Receipt}
            />
          </div>

          {/* Office Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-gray-700">
              Registered Office Address
            </label>
            <Input
              value={company.address || ''}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="e.g. Tower B, Suite 402, DLF CyberCity, Gurugram, Haryana 122002"
              icon={MapPin}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailsForm
