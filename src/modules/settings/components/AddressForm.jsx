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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address Line 1 */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Address Line 1 (Street / Building / Suite)
          </label>
          <input
            type="text"
            value={company.address_line_1 || company.addressLine1 || company.address || ''}
            onChange={(e) => {
              handleChange('address_line_1', e.target.value)
              handleChange('addressLine1', e.target.value)
              handleChange('address', e.target.value)
            }}
            disabled={disabled}
            placeholder="e.g. Tower B, Suite 402"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Address Line 2 (Area / Tech Park / Landmark)
          </label>
          <input
            type="text"
            value={company.address_line_2 || company.addressLine2 || ''}
            onChange={(e) => {
              handleChange('address_line_2', e.target.value)
              handleChange('addressLine2', e.target.value)
            }}
            disabled={disabled}
            placeholder="e.g. DLF CyberCity"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
        </div>
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
            value={company.postal_code || company.postalCode || ''}
            onChange={(e) => {
              handleChange('postal_code', e.target.value)
              handleChange('postalCode', e.target.value)
            }}
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
