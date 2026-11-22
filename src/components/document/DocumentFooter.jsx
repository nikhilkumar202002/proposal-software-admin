import DocumentPageNumber from './DocumentPageNumber'

const DEFAULT_ADDRESS_LINES = [
  'Tower B, Suite 402',
  'DLF CyberCity, Gurugram',
  'Haryana 122002',
]

function formatAddressLines(address) {
  if (!address) return DEFAULT_ADDRESS_LINES
  if (Array.isArray(address)) {
    const filtered = address.map((l) => String(l).trim()).filter(Boolean)
    return filtered.length > 0 ? filtered : DEFAULT_ADDRESS_LINES
  }
  const cleanAddress = String(address).trim()
  if (!cleanAddress) return DEFAULT_ADDRESS_LINES

  if (cleanAddress.includes('\n')) {
    const lines = cleanAddress.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length > 0) return lines
  }
  const parts = cleanAddress.split(',').map((p) => p.trim()).filter(Boolean)
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
  return [cleanAddress]
}

export const DocumentFooter = ({
  company = {},
  footerSettings = {},
  pageNumber = 1,
  totalPages = 1,
  showDivider = true,
  pageNumberFormat = 'counts',
  height = 16, // in mm
  className = '',
}) => {
  const combinedCompanyAddress = [
    company?.address,
    company?.city,
    company?.state,
    company?.postalCode || company?.postal_code || company?.pincode,
  ]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .filter(Boolean)
    .join(', ')

  const resolvedAddress =
    (footerSettings?.addressText && String(footerSettings.addressText).trim()) ||
    (company?.addressText && String(company.addressText).trim()) ||
    (company?.fullAddress && String(company.fullAddress).trim()) ||
    (combinedCompanyAddress && combinedCompanyAddress.trim()) ||
    (company?.address && String(company.address).trim()) ||
    'Tower B, Suite 402, DLF CyberCity, Gurugram, Haryana 122002'

  const resolvedPhone =
    (footerSettings?.contactPhone && String(footerSettings.contactPhone).trim()) ||
    (company?.phone && String(company.phone).trim()) ||
    (company?.contactPhone && String(company.contactPhone).trim()) ||
    '+91 77360 16507, +91 90480 06320'

  // Extract phone numbers into distinct lines (2 lines)
  const phoneList = resolvedPhone
    .split(/,|\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const finalPhoneList =
    phoneList.length > 0 ? phoneList : ['+91 77360 16507', '+91 90480 06320']

  // Extract full address into 2 or 3 lines without truncation
  const addressLines = formatAddressLines(resolvedAddress)

  return (
    <div
      style={{ minHeight: `${height}mm` }}
      className={`w-full flex flex-col justify-end select-none ${className}`}
    >
      {showDivider && (
        <div
          className="w-full border-b border-gray-200 mb-2 shrink-0"
          style={{ borderBottom: '1px solid #E5E7EB' }}
        />
      )}

      {/* 3 Equal Columns Footer Layout */}
      <div className="grid grid-cols-3 items-center text-[10px] text-gray-600 w-full gap-2">
        {/* Left Column (1/3): 2-line Phone Numbers */}
        <div className="flex flex-col text-left font-semibold text-gray-800 leading-snug">
          {finalPhoneList.map((phone, idx) => (
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
