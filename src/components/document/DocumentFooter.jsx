import DocumentPageNumber from './DocumentPageNumber'

function formatAddressLines(address) {
  if (!address) return []
  if (Array.isArray(address)) return address
  if (address.includes('\n')) {
    return address.split('\n').map((l) => l.trim()).filter(Boolean)
  }
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean)
  if (parts.length >= 4) {
    return [
      parts.slice(0, 2).join(', '),
      parts.slice(2, parts.length - 1).join(', '),
      parts[parts.length - 1],
    ]
  }
  if (parts.length >= 2) {
    const mid = Math.ceil(parts.length / 2)
    return [
      parts.slice(0, mid).join(', '),
      parts.slice(mid).join(', '),
    ]
  }
  return [address]
}

export const DocumentFooter = ({
  company = {},
  pageNumber = 1,
  totalPages = 1,
  showDivider = true,
  pageNumberFormat = 'counts',
  height = 16, // in mm
  className = '',
}) => {
  const companyPhone = company.phone || '+91 77360 16507, +91 90480 06320'
  const companyAddress = company.address || 'Tower B, Suite 402, DLF CyberCity, Gurugram, Haryana 122002'

  // Extract phone numbers into distinct lines (2 lines)
  const phoneList = companyPhone
    .split(/,|\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  // Extract full address into 2 or 3 lines without truncation
  const addressLines = formatAddressLines(companyAddress)

  return (
    <div
      style={{ minHeight: `${height}mm` }}
      className={`w-full flex flex-col justify-end select-none ${className}`}
    >
      {showDivider && (
        <div className="w-full h-px bg-gray-200 mb-2 shrink-0" />
      )}

      {/* 3 Equal Columns Footer Layout */}
      <div className="grid grid-cols-3 items-center text-[10px] text-gray-600 w-full gap-2">
        {/* Left Column (1/3): 2-line Phone Numbers */}
        <div className="flex flex-col text-left font-semibold text-gray-800 leading-snug">
          {phoneList.map((phone, idx) => (
            <span key={idx} className="block whitespace-nowrap">
              {phone}
            </span>
          ))}
        </div>

        {/* Center Column (1/3): Centered Page Number (Counts Only) */}
        <div className="text-center">
          <DocumentPageNumber
            pageNumber={pageNumber}
            totalPages={totalPages}
            format={pageNumberFormat}
            alignment="center"
          />
        </div>

        {/* Right Column (1/3): Full Address across 2-3 lines */}
        <div className="flex flex-col text-right font-medium text-gray-700 leading-snug ml-auto">
          {addressLines.map((line, idx) => (
            <span key={idx} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DocumentFooter
