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
  const companyPhone = company.phone || '+91 77360 16507, +91 90480 06320'
  const companyAddress = company.address || 'Tower B, Suite 402, DLF CyberCity, Gurugram, Haryana 122002'

  return (
    <div
      style={{ minHeight: `${height}mm` }}
      className={`w-full flex flex-col justify-end select-none ${className}`}
    >
      {showDivider && (
        <div className="w-full h-px bg-gray-200/90 mb-2 shrink-0" />
      )}

      {/* 3 Equal Columns Footer Layout */}
      <div className="grid grid-cols-3 items-center text-[10px] text-gray-600 pt-1 w-full gap-2">
        {/* Left Column (1/3): Contact Numbers */}
        <div className="text-left truncate font-semibold text-gray-800">
          <span className="truncate block" title={companyPhone}>
            {companyPhone}
          </span>
        </div>

        {/* Center Column (1/3): Centered Page Number */}
        <div className="text-center">
          <DocumentPageNumber
            pageNumber={pageNumber}
            totalPages={totalPages}
            format={pageNumberFormat}
            alignment="center"
          />
        </div>

        {/* Right Column (1/3): Address */}
        <div className="text-right truncate font-medium text-gray-700">
          <span className="truncate block" title={companyAddress}>
            {companyAddress}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DocumentFooter
