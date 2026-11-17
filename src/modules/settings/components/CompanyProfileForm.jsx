export const CompanyProfileForm = ({
  company = {},
  onChange = () => {},
  errors = {},
  disabled = false,
  className = '',
}) => {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Legal Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Company Legal Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={company.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={disabled}
            placeholder="e.g. Domain Dude Technologies Pvt Ltd"
            className={`w-full h-9 px-3 text-xs text-gray-900 bg-white border rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/20 focus:border-[#FB6C00] transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>
          )}
        </div>

        {/* GST / Tax Registration Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            GST / Tax Registration Number
          </label>
          <input
            type="text"
            value={company.taxNumber || ''}
            onChange={(e) => handleChange('taxNumber', e.target.value)}
            disabled={disabled}
            placeholder="e.g. 07AABCP1234F1Z5 or US-EIN-94301928"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/20 focus:border-[#FB6C00] transition-colors"
          />
        </div>
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Business Tagline / Subtitle
        </label>
        <input
          type="text"
          value={company.tagline || ''}
          onChange={(e) => handleChange('tagline', e.target.value)}
          disabled={disabled}
          placeholder="e.g. Enterprise Document & Workflow Systems"
          className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/20 focus:border-[#FB6C00] transition-colors"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          Displayed on proposal cover blocks and corporate signature agreements.
        </p>
      </div>

      {/* Additional Company Information / Notes */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Additional Corporate Details & Registrations
        </label>
        <textarea
          rows={3}
          value={company.additionalInfo || ''}
          onChange={(e) => handleChange('additionalInfo', e.target.value)}
          disabled={disabled}
          placeholder="e.g. Incorporated under Indian Companies Act 2013 | ISO 27001 Certified..."
          className="w-full p-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/20 focus:border-[#FB6C00] transition-colors"
        />
      </div>
    </div>
  )
}

export default CompanyProfileForm
