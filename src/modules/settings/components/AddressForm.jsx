export const AddressForm = ({
  company = {},
  onChange = () => {},
  disabled = false,
  className = '',
}) => {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Street Address */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Street / Building / Suite Address
        </label>
        <input
          type="text"
          value={company.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          disabled={disabled}
          placeholder="e.g. Tower B, Suite 402, DLF CyberCity"
          className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
        />
        <p className="mt-1 text-[10px] text-gray-400">
          Rendered on the right side of the document footer and in corporate execution blocks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={company.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            disabled={disabled}
            placeholder="e.g. Gurugram"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
        </div>

        {/* State / Province */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            State / Region
          </label>
          <input
            type="text"
            value={company.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            disabled={disabled}
            placeholder="e.g. Haryana"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Postal / PIN Code
          </label>
          <input
            type="text"
            value={company.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            disabled={disabled}
            placeholder="e.g. 122002"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            value={company.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            disabled={disabled}
            placeholder="e.g. India"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
        </div>
      </div>
    </div>
  )
}

export default AddressForm
