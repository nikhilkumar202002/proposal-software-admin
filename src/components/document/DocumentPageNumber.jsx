function padZero(num) {
  return String(num).padStart(2, '0')
}

export const DocumentPageNumber = ({
  pageNumber = 1,
  totalPages = 1,
  format = 'pageOfTotal', // 'pageOfTotal' | 'number' | 'fraction' | 'pageNumber'
  alignment = 'right', // 'left' | 'center' | 'right'
  className = '',
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment] || 'text-right'

  let text
  switch (format) {
    case 'number':
      text = padZero(pageNumber)
      break
    case 'fraction':
      text = `${pageNumber} / ${totalPages}`
      break
    case 'pageNumber':
      text = `Page ${pageNumber}`
      break
    case 'pageOfTotal':
    default:
      text = `Page ${padZero(pageNumber)} of ${padZero(totalPages)}`
      break
  }

  return (
    <div
      className={`text-[11px] font-medium text-gray-400 select-none ${alignClass} ${className}`}
      aria-label={`Page ${pageNumber} of ${totalPages}`}
    >
      {text}
    </div>
  )
}

export default DocumentPageNumber
