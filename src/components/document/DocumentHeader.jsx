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

  return (
    <div
      style={{ minHeight: `${height}mm` }}
      className={`w-full flex flex-col justify-between select-none ${className}`}
    >
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-3 min-w-0">
          {companyLogo && (
            <img
              src={companyLogo}
              alt={companyName}
              className="h-8 max-h-9 w-auto object-contain shrink-0"
            />
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
