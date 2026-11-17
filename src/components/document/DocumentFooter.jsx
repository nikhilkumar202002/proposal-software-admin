import DocumentPageNumber from './DocumentPageNumber'

export const DocumentFooter = ({
  company = {},
  pageNumber = 1,
  totalPages = 1,
  showDivider = true,
  pageNumberFormat = 'pageOfTotal',
  customText,
  template = 'standard',
  height = 16, // in mm
  className = '',
}) => {
  const companyName = company.name || 'ProposalOS Technologies'
  const companyWebsite = company.website || 'www.proposalos.com'
  const companyEmail = company.email || 'contact@proposalos.com'
  const companyPhone = company.phone || '+91 98765 43210'

  return (
    <div
      style={{ minHeight: `${height}mm` }}
      className={`w-full flex flex-col justify-end select-none ${className}`}
    >
      {showDivider && (
        <div className="w-full h-px bg-gray-200/90 mb-2 shrink-0" />
      )}

      {template === 'standard' ? (
        <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
          {/* Left contact info */}
          <div className="flex items-center gap-2 truncate max-w-[70%]">
            <span className="font-semibold text-gray-700">{companyName}</span>
            <span>•</span>
            <span className="text-gray-500">{companyWebsite}</span>
            <span>•</span>
            <span className="text-gray-500">{companyEmail}</span>
          </div>

          {/* Right page number */}
          <div className="shrink-0 ml-2">
            <DocumentPageNumber
              pageNumber={pageNumber}
              totalPages={totalPages}
              format={pageNumberFormat}
              alignment="right"
            />
          </div>
        </div>
      ) : template === 'detailed' ? (
        <div className="flex items-center justify-between text-[9.5px] text-gray-500 pt-1">
          <div className="truncate">
            <p className="font-semibold text-gray-700">{companyName}</p>
            <p className="text-gray-400">
              {companyEmail} | {companyPhone} | {companyWebsite}
            </p>
          </div>

          <div className="text-right shrink-0">
            {customText && <p className="text-gray-400">{customText}</p>}
            <DocumentPageNumber
              pageNumber={pageNumber}
              totalPages={totalPages}
              format={pageNumberFormat}
              alignment="right"
            />
          </div>
        </div>
      ) : (
        /* Minimal template */
        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
          <span>{customText || `© ${new Date().getFullYear()} ${companyName}`}</span>
          <DocumentPageNumber
            pageNumber={pageNumber}
            totalPages={totalPages}
            format={pageNumberFormat}
            alignment="right"
          />
        </div>
      )}
    </div>
  )
}

export default DocumentFooter
