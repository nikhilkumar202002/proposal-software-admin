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
  const finalAddressLines =
    addressLines && addressLines.length > 0 ? addressLines : DEFAULT_ADDRESS_LINES

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
      <div
        className="w-full text-[10px] text-gray-600"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Left Column (Phone Numbers) */}
        <div className="text-left font-semibold text-gray-800 leading-snug shrink-0">
          {finalPhoneList.map((phone, idx) => (
            <div key={idx} style={{ whiteSpace: 'nowrap' }}>
              {phone}
            </div>
          ))}
        </div>

        {/* Center Column (Centered Page Number) */}
        <div className="text-center shrink-0">
          <DocumentPageNumber
            pageNumber={pageNumber}
            totalPages={totalPages}
            format={pageNumberFormat}
            alignment="center"
          />
        </div>

        {/* Right Column (Full Legal Address across 2-3 lines) */}
        <div className="text-right font-medium text-gray-700 leading-snug shrink-0 flex flex-col items-end">
          {finalAddressLines.map((line, idx) => (
            <div key={idx} style={{ whiteSpace: 'nowrap' }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DocumentFooter
