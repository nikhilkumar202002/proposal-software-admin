import DocumentPageNumber from './DocumentPageNumber'

export const DocumentFooter = ({
  company = {},
  pageNumber = 1,
  totalPages = 1,
  showDivider = true,
  pageNumberFormat = 'pageOfTotal',
  height = 16, // in mm
  className = '',
}) => {
  const companyPhone = company.phone || '+91 98765 43210'
  const companyAddress = company.address || 'Tower B, Suite 402, DLF CyberCity, Gurugram, Haryana 122002'

  return (
    <div
      style={{ minHeight: `${height}mm` }}
      className={`w-full flex flex-col justify-end select-none ${className}`}
    >
      {showDivider && (
        <div className="w-full h-px bg-gray-200/90 mb-2 shrink-0" />
      )}

      <div className="flex items-center justify-between text-[10px] text-gray-600 pt-1 gap-4">
        {/* Left Side: Contact Numbers */}
        <div className="flex items-center gap-1.5 shrink-0 text-left">
          <span className="font-semibold text-gray-800">
            {companyPhone}
          </span>
        </div>

        {/* Center: Page Number */}
        <div className="shrink-0 text-center">
          <DocumentPageNumber
            pageNumber={pageNumber}
            totalPages={totalPages}
            format={pageNumberFormat}
            alignment="center"
          />
        </div>

        {/* Right Side: Address */}
        <div className="text-right truncate max-w-[50%]">
          <span className="font-medium text-gray-700 truncate block">
            {companyAddress}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DocumentFooter
