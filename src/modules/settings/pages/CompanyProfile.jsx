import { useState, useEffect } from 'react'
import { Save, Building2, Check, AlertCircle, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import CompanyLogoUpload from '../components/CompanyLogoUpload'
import CompanyFaviconUpload from '../components/CompanyFaviconUpload'
import CompanyProfileForm from '../components/CompanyProfileForm'
import CompanyContactForm from '../components/CompanyContactForm'
import AddressForm from '../components/AddressForm'
import { companyService } from '../../../services/company.service'
import { useSettingsStore } from '../store/settingsStore'

export const CompanyProfile = ({ standalone = false }) => {
  const storeCompany = useSettingsStore((s) => s.company)
  const updateStoreCompany = useSettingsStore((s) => s.updateCompany)

  const [company, setCompany] = useState(storeCompany || {})
  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState(null)

  // 1. Fetch company profile from GET /company-profile on mount
  const fetchProfile = async () => {
    setIsFetching(true)
    setError(null)
    try {
      const data = await companyService.getCompanyProfile()
      setCompany(data)
      updateStoreCompany(data)
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to load company profile.'
      setError(msg)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Local state update handler
  const handleCompanyChange = (fields) => {
    setCompany((prev) => ({
      ...prev,
      ...fields,
    }))
    setFieldErrors((prev) => {
      const updated = { ...prev }
      Object.keys(fields).forEach((k) => delete updated[k])
      return updated
    })
  }

  // 2. Save company profile with PUT /company-profile
  const handleSave = async (e) => {
    if (e) e.preventDefault()

    const name = (company.company_name || company.name || '').trim()
    if (!name) {
      setFieldErrors({ company_name: 'Company brand name is required' })
      toast.error('Company brand name is required')
      return
    }

    setIsSaving(true)
    setError(null)
    setFieldErrors({})
    setSuccessMessage(null)

    try {
      const saved = await companyService.updateCompanyProfile(company)
      setCompany(saved)
      updateStoreCompany(saved)
      setSuccessMessage('Company profile saved successfully.')
      toast.success('Company profile updated successfully.')
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors)
      }
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to save company profile.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  // 3. Upload Logo with POST /company-profile/logo
  const handleUploadLogo = async (file) => {
    try {
      const updated = await companyService.uploadLogo(file)
      setCompany(updated)
      updateStoreCompany(updated)
      toast.success('Company logo uploaded successfully.')
      return updated.logo_url
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to upload company logo.'
      toast.error(msg)
      throw err
    }
  }

  // 4. Delete Logo with DELETE /company-profile/logo
  const handleDeleteLogo = async () => {
    try {
      const updated = await companyService.deleteLogo()
      setCompany(updated)
      updateStoreCompany(updated)
      toast.success('Company logo removed.')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to remove company logo.'
      toast.error(msg)
    }
  }

  // 5. Upload Favicon with POST /company-profile/favicon
  const handleUploadFavicon = async (file) => {
    try {
      const updated = await companyService.uploadFavicon(file)
      setCompany(updated)
      updateStoreCompany(updated)
      toast.success('Website favicon uploaded successfully.')
      return updated.favicon_url
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to upload favicon.'
      toast.error(msg)
      throw err
    }
  }

  // 6. Delete Favicon with DELETE /company-profile/favicon
  const handleDeleteFavicon = async () => {
    try {
      const updated = await companyService.deleteFavicon()
      setCompany(updated)
      updateStoreCompany(updated)
      toast.success('Website favicon removed.')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to remove favicon.'
      toast.error(msg)
    }
  }

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-8 h-8 border-2 border-[#0055FF] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Loading company profile...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Page Title & Save Action if standalone */}
      {standalone && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0055FF]" />
              Company Legal Profile & Branding
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage legal company identity, official logo, favicon, tax registration, and physical headquarters address.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchProfile}
              disabled={isSaving || isFetching}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Refresh profile from server"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] active:scale-[0.98] rounded-xl shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
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

      {/* 1. Official Brand Logo Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Official Brand Logo
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Uploaded logo is centrally stored and rendered in document headers and proposal covers.
          </p>
        </div>

        <CompanyLogoUpload
          logoUrl={company.logo_url || company.logoUrl}
          onUpload={handleUploadLogo}
          onRemove={handleDeleteLogo}
          disabled={isSaving}
        />
      </div>

      {/* 2. Official Website Favicon Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Browser Favicon & Shortcut Icon
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Rendered in client proposal links, web previews, and browser tabs.
          </p>
        </div>

        <CompanyFaviconUpload
          faviconUrl={company.favicon_url || company.faviconUrl}
          onUpload={handleUploadFavicon}
          onRemove={handleDeleteFavicon}
          disabled={isSaving}
        />
      </div>

      {/* 3. Legal Entity & Tax Details */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Legal Entity & Tax Information
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Registered business details printed on contracts, proposals, and commercial invoices.
          </p>
        </div>

        <CompanyProfileForm
          company={company}
          onChange={handleCompanyChange}
          errors={fieldErrors}
          disabled={isSaving}
        />
      </div>

      {/* 4. Official Contact Information */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Contact & Domain Channels
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Primary email, support email, contact telephone numbers, website, and social channels.
          </p>
        </div>

        <CompanyContactForm
          company={company}
          onChange={handleCompanyChange}
          errors={fieldErrors}
          disabled={isSaving}
        />
      </div>

      {/* 5. Headquarters Physical Address */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Corporate Headquarters Address
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Used on proposal footers, execution signature blocks, and tax invoicing.
          </p>
        </div>

        <AddressForm
          company={company}
          onChange={handleCompanyChange}
          disabled={isSaving}
        />
      </div>

      {/* Save Button for tab mode */}
      {!standalone && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={fetchProfile}
            disabled={isSaving || isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Refresh profile from server"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] active:scale-[0.98] rounded-xl shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
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
