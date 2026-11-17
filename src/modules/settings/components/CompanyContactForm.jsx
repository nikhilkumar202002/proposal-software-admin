export const CompanyContactForm = ({
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Official Email Address
          </label>
          <input
            type="email"
            value={company.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={disabled}
            placeholder="e.g. contact@domaindude.in"
            className={`w-full h-9 px-3 text-xs text-gray-900 bg-white border rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/20 focus:border-[#FB6C00] transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Primary Contact Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Primary Contact Phone
          </label>
          <input
            type="tel"
            value={company.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={disabled}
            placeholder="e.g. +91 98765 43210"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/20 focus:border-[#FB6C00] transition-colors"
          />
          <p className="mt-1 text-[10px] text-gray-400">
            Rendered on the left side of the document footer.
          </p>
        </div>

        {/* Official Website */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Official Website Domain
          </label>
          <input
            type="text"
            value={company.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            disabled={disabled}
            placeholder="e.g. www.domaindude.in"
            className={`w-full h-9 px-3 text-xs text-gray-900 bg-white border rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/20 focus:border-[#FB6C00] transition-colors ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.website ? (
            <p className="mt-1 text-[11px] text-red-500">{errors.website}</p>
          ) : (
            <p className="mt-1 text-[10px] text-gray-400">
              Rendered on the right side of the document header.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyContactForm
