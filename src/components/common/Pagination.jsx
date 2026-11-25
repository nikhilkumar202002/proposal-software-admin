import { ChevronLeft, ChevronRight } from 'lucide-react'

function generatePagination(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export const Pagination = ({
  page = 1,
  currentPage,
  pageSize = 10,
  total = 0,
  totalCount,
  totalPages: propTotalPages,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange = () => {},
  onPageSizeChange,
  showPageSizeSelector = true,
  className = '',
}) => {
  const activePage = currentPage !== undefined ? currentPage : page
  const resolvedTotal = totalCount !== undefined ? totalCount : (total !== undefined ? total : 0)
  const totalPages = propTotalPages !== undefined
    ? propTotalPages
    : Math.max(1, Math.ceil(resolvedTotal / pageSize))
  const safePage = Math.min(Math.max(1, activePage), totalPages)

  const startRecord = resolvedTotal === 0 ? 0 : (safePage - 1) * pageSize + 1
  const endRecord = Math.min(safePage * pageSize, resolvedTotal)

  const pages = generatePagination(safePage, totalPages)

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3 select-none text-xs text-gray-500 ${className}`}
    >
      {/* Records count & Page Size selector */}
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-semibold text-gray-900">{startRecord}</span> to{' '}
          <span className="font-semibold text-gray-900">{endRecord}</span> of{' '}
          <span className="font-semibold text-gray-900">{total}</span> results
        </span>

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 focus:outline-none focus:border-[#0055FF] cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1 self-center sm:self-auto">
        {/* Previous Button */}
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Number Pills */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                  ...
                </span>
              )
            }

            const isCurrent = p === safePage

            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0055FF] text-white font-semibold shadow-2xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {p}
              </button>
            )
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
