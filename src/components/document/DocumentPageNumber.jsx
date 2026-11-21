function padZero(num) {
  return String(num).padStart(2, '0')
}

export const DocumentPageNumber = ({
  pageNumber = 1,
  totalPages = 1,
  format = 'counts', // 'counts' | 'fraction' | 'number' | 'pageNumber'
  alignment = 'center',
  className = '',
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment] || 'text-center'

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
    case 'counts':
    case 'pageOfTotal':
    default:
      text = `${padZero(pageNumber)} / ${padZero(totalPages)}`
      break
  }

  return (
    <div
      className={`text-[10px] font-semibold text-gray-500 select-none ${alignClass} ${className}`}
      aria-label={`Page ${pageNumber} of ${totalPages}`}
    >
      {text}
    </div>
  )
}

export default DocumentPageNumber
