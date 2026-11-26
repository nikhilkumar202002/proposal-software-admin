export const CompanyProfileForm = ({
  company = {},
  onChange = () => {},
  errors = {},
  disabled = false,
  className = '',
}) => {
  const handleChange = (field, value) => {
    // Keep both camelCase and snake_case in sync for robust state management
    if (field === 'name' || field === 'company_name') {
      onChange({ name: value, company_name: value })
    } else if (field === 'legalName' || field === 'legal_name') {
      onChange({ legalName: value, legal_name: value })
    } else if (field === 'registrationNumber' || field === 'registration_number') {
      onChange({ registrationNumber: value, registration_number: value })
    } else if (field === 'taxNumber' || field === 'tax_registration_number') {
      onChange({ taxNumber: value, tax_registration_number: value })
    } else if (field === 'tagline' || field === 'description') {
      onChange({ tagline: value, description: value, additionalInfo: value })
    } else {
      onChange({ [field]: value })
    }
  }

  const companyName = company.company_name || company.name || ''
  const legalName = company.legal_name || company.legalName || ''
  const regNumber = company.registration_number || company.registrationNumber || ''
  const taxNumber = company.tax_registration_number || company.taxNumber || ''
  const description = company.description || company.tagline || company.additionalInfo || ''

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Trade / Display Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Company Trade / Brand Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => handleChange('company_name', e.target.value)}
            disabled={disabled}
            placeholder="e.g. Domain Dude"
            className={`w-full h-9 px-3 text-xs text-gray-900 bg-white border rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors ${
              errors.company_name || errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {(errors.company_name || errors.name) && (
            <p className="mt-1 text-[11px] text-red-500">
              {errors.company_name || errors.name}
            </p>
          )}
        </div>

        {/* Company Legal Registered Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Legal Entity / Registered Name
          </label>
          <input
            type="text"
            value={legalName}
            onChange={(e) => handleChange('legal_name', e.target.value)}
            disabled={disabled}
            placeholder="e.g. Domain Dude Technologies Pvt. Ltd."
            className={`w-full h-9 px-3 text-xs text-gray-900 bg-white border rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors ${
              errors.legal_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.legal_name && (
            <p className="mt-1 text-[11px] text-red-500">{errors.legal_name}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Registration / CIN Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Company Registration Number / CIN
          </label>
          <input
            type="text"
            value={regNumber}
            onChange={(e) => handleChange('registration_number', e.target.value)}
            disabled={disabled}
            placeholder="e.g. U72900HR2026PTC109988"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
        </div>

        {/* GST / Tax Registration Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            GST / Tax Registration Number
          </label>
          <input
            type="text"
            value={taxNumber}
            onChange={(e) => handleChange('tax_registration_number', e.target.value)}
            disabled={disabled}
            placeholder="e.g. 07AABCD1234E1Z5 or US-EIN-94301928"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
        </div>
      </div>

      {/* Description / Tagline */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Business Description / Tagline
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => handleChange('description', e.target.value)}
          disabled={disabled}
          placeholder="e.g. Comprehensive Proposal and Business Acceleration Platform"
          className="w-full p-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          Rendered on document covers, executive summaries, and legal signature sections.
        </p>
      </div>
    </div>
  )
}

export default CompanyProfileForm
