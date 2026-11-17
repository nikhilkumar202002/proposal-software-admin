import { Save, Building2, Check, AlertCircle } from 'lucide-react'
import CompanyLogoUpload from '../components/CompanyLogoUpload'
import CompanyProfileForm from '../components/CompanyProfileForm'
import CompanyContactForm from '../components/CompanyContactForm'
import AddressForm from '../components/AddressForm'
import { useSettings } from '../hooks/useSettings'

export const CompanyProfile = ({ standalone = false }) => {
  const {
    company,
    updateCompany,
    handleUploadLogo,
    saveCompany,
    isSaving,
    error,
    successMessage,
    validationErrors,
  } = useSettings()

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    try {
      await saveCompany()
    } catch {
      // Error is set in store
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Page Title & Save Action if standalone */}
      {standalone && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#FB6C00]" />
              Company Legal Profile & Branding
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage legal company identity, official logo, tax registration, and physical headquarters address.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#FB6C00] hover:bg-[#E65F00] active:scale-[0.98] rounded-xl shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      )}

      {/* Status Messages */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Official Logo Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Official Brand Logo
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Uploaded logo is centrally stored and rendered in document headers for Direct Client Proposals.
          </p>
        </div>

        <CompanyLogoUpload
          logoUrl={company.logoUrl}
          onUpload={handleUploadLogo}
          onRemove={() => updateCompany({ logoUrl: '' })}
          disabled={isSaving}
        />
      </div>

      {/* 2. Legal Entity & Tax Details */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Legal Entity & Tax Information
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Registered business details printed on contracts and commercial invoices.
          </p>
        </div>

        <CompanyProfileForm
          company={company}
          onChange={updateCompany}
          errors={validationErrors}
          disabled={isSaving}
        />
      </div>

      {/* 3. Official Contact Information */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Contact & Domain Channels
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Primary email, contact telephone, and website domain.
          </p>
        </div>

        <CompanyContactForm
          company={company}
          onChange={updateCompany}
          errors={validationErrors}
          disabled={isSaving}
        />
      </div>

      {/* 4. Headquarters Physical Address */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Corporate Headquarters Address
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Used on proposal footers, execution sections, and tax invoicing.
          </p>
        </div>

        <AddressForm
          company={company}
          onChange={updateCompany}
          disabled={isSaving}
        />
      </div>

      {/* Save Button for tab mode */}
      {!standalone && (
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#FB6C00] hover:bg-[#E65F00] active:scale-[0.98] rounded-xl shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving Changes...' : 'Save Company Profile'}</span>
          </button>
        </div>
      )}
    </form>
  )
}

export default CompanyProfile
