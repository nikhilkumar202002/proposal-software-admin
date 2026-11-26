export const CompanyContactForm = ({
  company = {},
  onChange = () => {},
  errors = {},
  disabled = false,
  className = '',
}) => {
  const handleChange = (field, value) => {
    if (field === 'supportEmail' || field === 'support_email') {
      onChange({ supportEmail: value, support_email: value })
    } else if (field === 'alternatePhone' || field === 'alternate_phone') {
      onChange({ alternatePhone: value, alternate_phone: value })
    } else {
      onChange({ [field]: value })
    }
  }

  const handleSocialChange = (network, value) => {
    const existing = company.social_links || company.socialLinks || {}
    const updated = { ...existing, [network]: value }
    onChange({
      social_links: updated,
      socialLinks: updated,
    })
  }

  const socialLinks = company.social_links || company.socialLinks || {}

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Primary Email Address
          </label>
          <input
            type="email"
            value={company.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={disabled}
            placeholder="e.g. contact@domaindude.in"
            className={`w-full h-9 px-3 text-xs text-gray-900 bg-white border rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Support Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Customer Support Email
          </label>
          <input
            type="email"
            value={company.support_email || company.supportEmail || ''}
            onChange={(e) => handleChange('support_email', e.target.value)}
            disabled={disabled}
            placeholder="e.g. support@domaindude.in"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Primary Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Primary Contact Phone
          </label>
          <input
            type="tel"
            value={company.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={disabled}
            placeholder="e.g. +91 77360 16507"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
        </div>

        {/* Alternate Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Alternate / Direct Phone
          </label>
          <input
            type="tel"
            value={company.alternate_phone || company.alternatePhone || ''}
            onChange={(e) => handleChange('alternate_phone', e.target.value)}
            disabled={disabled}
            placeholder="e.g. +91 90480 06320"
            className="w-full h-9 px-3 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
          />
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
            placeholder="e.g. https://www.domaindude.in"
            className={`w-full h-9 px-3 text-xs text-gray-900 bg-white border rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.website && (
            <p className="mt-1 text-[11px] text-red-500">{errors.website}</p>
          )}
        </div>
      </div>

      {/* Social Profiles */}
      <div className="pt-2 border-t border-gray-100">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Social & Developer Profiles
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="block text-[11px] font-medium text-gray-500 mb-1">
              LinkedIn
            </span>
            <input
              type="text"
              value={socialLinks.linkedin || ''}
              onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              disabled={disabled}
              placeholder="https://linkedin.com/company/domaindude"
              className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
            />
          </div>

          <div>
            <span className="block text-[11px] font-medium text-gray-500 mb-1">
              Twitter / X
            </span>
            <input
              type="text"
              value={socialLinks.twitter || ''}
              onChange={(e) => handleSocialChange('twitter', e.target.value)}
              disabled={disabled}
              placeholder="https://twitter.com/domaindude"
              className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
            />
          </div>

          <div>
            <span className="block text-[11px] font-medium text-gray-500 mb-1">
              GitHub
            </span>
            <input
              type="text"
              value={socialLinks.github || ''}
              onChange={(e) => handleSocialChange('github', e.target.value)}
              disabled={disabled}
              placeholder="https://github.com/domaindude"
              className="w-full h-8 px-2.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyContactForm
