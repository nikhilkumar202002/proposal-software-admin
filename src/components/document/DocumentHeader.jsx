import logoImg from '../../assets/Domine-Dude_black.png'

export const DocumentHeader = ({
  company = {},
  proposal = {},
  template = 'modern', // 'modern' | 'corporate' | 'minimal'
  showDivider = true,
  height = 22, // in mm
  className = '',
}) => {
  const companyName = company.name || 'ProposalOS'
  const companyTagline = company.tagline || 'Enterprise Proposals & Contracts'
  const companyLogo = company.logoUrl || logoImg
  const proposalTitle = proposal.title || 'Technical & Commercial Proposal'
  const proposalNumber = proposal.number || 'PROP-2026-001'

  return (
    <div
      style={{ minHeight: `${height}mm` }}
      className={`w-full flex flex-col justify-between select-none ${className}`}
    >
      {template === 'modern' ? (
        <div className="flex items-start justify-between gap-4 pb-2">
          {/* Company Brand & Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            {companyLogo && (
              <img
                src={companyLogo}
                alt={companyName}
                className="h-7 w-auto object-contain shrink-0"
              />
            )}
            <div className="min-w-0">
              <span className="text-xs font-bold text-gray-900 tracking-tight block truncate">
                {companyName}
              </span>
              <span className="text-[10px] text-gray-500 block truncate">
                {companyTagline}
              </span>
            </div>
          </div>

          {/* Proposal Meta Reference */}
          <div className="text-right shrink-0">
            <span className="text-xs font-semibold text-gray-800 block truncate max-w-[260px]">
              {proposalTitle}
            </span>
            <span className="text-[10px] font-mono font-medium text-gray-500 block">
              Ref: {proposalNumber}
            </span>
          </div>
        </div>
      ) : template === 'corporate' ? (
        <div className="flex items-center justify-between pb-2">
          <div>
            <span className="text-sm font-bold text-gray-900 tracking-tight block">
              {proposalTitle}
            </span>
            <span className="text-[10px] font-medium text-gray-400">
              Document No: {proposalNumber}
            </span>
          </div>
          {companyLogo && (
            <img
              src={companyLogo}
              alt={companyName}
              className="h-8 w-auto object-contain"
            />
          )}
        </div>
      ) : (
        /* Minimal single-line */
        <div className="flex items-center justify-between pb-2 text-[10px] text-gray-500">
          <span className="font-semibold text-gray-800">{companyName}</span>
          <span className="truncate max-w-[280px]">{proposalTitle}</span>
          <span className="font-mono">{proposalNumber}</span>
        </div>
      )}

      {showDivider && (
        <div className="w-full h-px bg-gray-200/90 shrink-0" />
      )}
    </div>
  )
}

export default DocumentHeader
