import logoImg from '../../assets/Domine-Dude_black.png'

export const DocumentHeader = ({
  company = {},
  proposal = {},
  showDivider = true,
  height = 22, // in mm
  className = '',
}) => {
  const companyName = company.name || 'Domain Dude'
  const companyLogo = company.logoUrl || logoImg
  const website = company.website || 'www.domaindude.in'
  const proposalDate = proposal.date || new Date().toISOString().split('T')[0]

  // Proposal Type logic:
  // "direct" (default) -> With Company Logo
  // "b2b" -> Without Company Logo
  const isB2B = proposal.proposalType === 'b2b' || proposal.showCompanyLogo === false
  const showLogo = !isB2B && proposal.showCompanyLogo !== false

  return (
    <div
      style={{ minHeight: `${height}mm` }}
      className={`w-full flex flex-col justify-between select-none ${className}`}
    >
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Left Side: Logo (Preserves exact dimensions and alignment in both modes) */}
        <div className="flex items-center gap-3 min-w-0 h-9">
          {showLogo && companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="h-8 max-h-9 w-auto object-contain shrink-0"
            />
          ) : (
            <div className="h-8 w-1 opacity-0 pointer-events-none" aria-hidden="true" />
          )}
        </div>

        {/* Right Side: Date & Website Domain */}
        <div className="text-right shrink-0 flex flex-col items-end">
          <span className="text-[11px] font-medium text-gray-700 tracking-tight">
            {proposalDate}
          </span>
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-semibold text-gray-900 hover:text-[#FB6C00] transition-colors mt-0.5 tracking-tight"
          >
            {website}
          </a>
        </div>
      </div>

      {showDivider && (
        <div className="w-full h-px bg-gray-200/90 shrink-0" />
      )}
    </div>
  )
}

export default DocumentHeader
