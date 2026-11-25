import logoImg from '../../assets/Domine-Dude_black.png'

export const DocumentHeader = ({
  company = {},
  proposal = {},
  showDivider = true,
  height = 14, // in mm (compact header height)
  className = '',
}) => {
  const companyName = company.name || 'Domain Dude'
  const companyLogo = company.logoUrl || logoImg
  const website = company.website || 'www.domaindude.in'
  const proposalDate = proposal.date || new Date().toISOString().split('T')[0]
  const validUntilDate = proposal.validUntil

  // Proposal Type logic:
  // "direct" (default) -> With Company Logo
  // "b2b" -> Without Company Logo
  const isB2B = proposal.proposalType === 'b2b' || proposal.showCompanyLogo === false
  const showLogo = !isB2B && proposal.showCompanyLogo !== false

  return (
    <div
      style={{ minHeight: `${height}mm` }}
      className={`w-full flex flex-col justify-end select-none ${className}`}
    >
      <div
        className="flex items-center justify-between gap-4 pb-1.5 w-full border-b border-gray-200"
        style={{ borderBottom: showDivider ? '1px solid #E5E7EB' : 'none' }}
      >
        {/* Left Side: Logo (Preserves exact dimensions and alignment in both modes) */}
        <div className="flex items-center gap-3 min-w-0">
          {showLogo && companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="h-8 max-h-8.5 w-auto object-contain shrink-0"
            />
          ) : (
            <div className="h-8 w-1 opacity-0 pointer-events-none" aria-hidden="true" />
          )}
        </div>

        {/* Right Side: Generated Date, Valid Date & Website Domain */}
        <div className="text-right shrink-0 flex flex-col items-end leading-tight space-y-0.5">
          <div className="text-[10px] text-gray-500 font-medium tracking-tight">
            <span>Date: <strong className="text-gray-800 font-semibold">{proposalDate}</strong></span>
            {validUntilDate && (
              <>
                <span className="mx-1.5 text-gray-300">•</span>
                <span>Valid: <strong className="text-gray-800 font-semibold">{validUntilDate}</strong></span>
              </>
            )}
          </div>
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-semibold text-gray-900 hover:text-[#0055FF] transition-colors tracking-tight"
          >
            {website}
          </a>
        </div>
      </div>
    </div>
  )
}

export default DocumentHeader
