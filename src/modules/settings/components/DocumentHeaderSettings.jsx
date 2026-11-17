export const DocumentHeaderSettings = ({
  header = {},
  onChange = () => {},
  companyWebsite = 'www.domaindude.in',
  disabled = false,
  className = '',
}) => {
  const handleChange = (field, value) => {
    onChange({ ...header, [field]: value })
  }

  return (
    <div className={`p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
        <div>
          <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Document Header Layout & Content
          </h5>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Controls the fixed header banner rendered across all physical A4 proposal pages.
          </p>
        </div>

        {/* Header Visibility Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={header.visible !== false}
            onChange={(e) => handleChange('visible', e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 text-[#FB6C00] rounded border-gray-300 focus:ring-[#FB6C00]"
          />
          <span className="text-xs font-semibold text-gray-700">Show Header</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Header Height */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Header Min Height (mm)
          </label>
          <input
            type="number"
            min="15"
            max="40"
            value={header.height || 22}
            onChange={(e) => handleChange('height', parseInt(e.target.value) || 22)}
            disabled={disabled || header.visible === false}
            className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00]"
          />
          <p className="mt-1 text-[10px] text-gray-400">Standard A4 default is 22mm.</p>
        </div>

        {/* Website Domain Text */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Header Domain URL
          </label>
          <input
            type="text"
            value={header.website || companyWebsite}
            onChange={(e) => handleChange('website', e.target.value)}
            disabled={disabled || header.visible === false}
            placeholder="www.domaindude.in"
            className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:border-[#FB6C00] focus:ring-1 focus:ring-[#FB6C00]"
          />
          <p className="mt-1 text-[10px] text-gray-400">Positioned on top-right of every page.</p>
        </div>

        {/* Toggles */}
        <div className="space-y-2 pt-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={header.showDivider !== false}
              onChange={(e) => handleChange('showDivider', e.target.checked)}
              disabled={disabled || header.visible === false}
              className="w-4 h-4 text-[#FB6C00] rounded border-gray-300 focus:ring-[#FB6C00]"
            />
            <span className="text-xs font-medium text-gray-700">Show Header Divider Line</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={header.showDate !== false}
              onChange={(e) => handleChange('showDate', e.target.checked)}
              disabled={disabled || header.visible === false}
              className="w-4 h-4 text-[#FB6C00] rounded border-gray-300 focus:ring-[#FB6C00]"
            />
            <span className="text-xs font-medium text-gray-700">Display Proposal Generation Date</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default DocumentHeaderSettings
