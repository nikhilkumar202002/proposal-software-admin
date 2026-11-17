import { PAGE_NUMBER_FORMATS } from '../utils/settingsHelpers'

export const DocumentFooterSettings = ({
  footer = {},
  onChange = () => {},
  companyPhone = '+91 98765 43210',
  companyAddress = '',
  disabled = false,
  className = '',
}) => {
  const handleChange = (field, value) => {
    onChange({ ...footer, [field]: value })
  }

  return (
    <div className={`p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
        <div>
          <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Document Footer Layout & Content
          </h5>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Controls contact numbers, legal address, divider, and page numbering.
          </p>
        </div>

        {/* Footer Visibility Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={footer.visible !== false}
            onChange={(e) => handleChange('visible', e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 text-[#FB6C00] rounded border-gray-300 focus:ring-[#FB6C00]"
          />
          <span className="text-xs font-semibold text-gray-700">Show Footer</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Footer Contact Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Footer Contact Phone (Bottom-Left)
          </label>
          <input
            type="text"
            value={footer.contactPhone || companyPhone}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
            disabled={disabled || footer.visible === false}
            placeholder="+91 98765 43210"
            className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00]"
          />
        </div>

        {/* Footer Legal Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Footer Address Text (Bottom-Right)
          </label>
          <input
            type="text"
            value={footer.addressText || companyAddress}
            onChange={(e) => handleChange('addressText', e.target.value)}
            disabled={disabled || footer.visible === false}
            placeholder="Tower B, Suite 402, DLF CyberCity, Gurugram"
            className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1 border-t border-gray-200/80">
        {/* Footer Height */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Footer Height (mm)
          </label>
          <input
            type="number"
            min="12"
            max="30"
            value={footer.height || 16}
            onChange={(e) => handleChange('height', parseInt(e.target.value) || 16)}
            disabled={disabled || footer.visible === false}
            className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00]"
          />
          <p className="mt-1 text-[10px] text-gray-400">Standard A4 default is 16mm.</p>
        </div>

        {/* Page Numbering Format */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Page Numbering Format (Center)
          </label>
          <select
            value={footer.pageNumberFormat || 'pageOfTotal'}
            onChange={(e) => handleChange('pageNumberFormat', e.target.value)}
            disabled={disabled || footer.visible === false || footer.showPageNumbers === false}
            className="w-full h-8 px-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#FB6C00] cursor-pointer"
          >
            {PAGE_NUMBER_FORMATS.map((fmt) => (
              <option key={fmt.value} value={fmt.value}>
                {fmt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-2 pt-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={footer.showDivider !== false}
              onChange={(e) => handleChange('showDivider', e.target.checked)}
              disabled={disabled || footer.visible === false}
              className="w-4 h-4 text-[#FB6C00] rounded border-gray-300 focus:ring-[#FB6C00]"
            />
            <span className="text-xs font-medium text-gray-700">Show Footer Divider Line</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={footer.showPageNumbers !== false}
              onChange={(e) => handleChange('showPageNumbers', e.target.checked)}
              disabled={disabled || footer.visible === false}
              className="w-4 h-4 text-[#FB6C00] rounded border-gray-300 focus:ring-[#FB6C00]"
            />
            <span className="text-xs font-medium text-gray-700">Enable Page Numbering</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default DocumentFooterSettings
