import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2, Inbox } from 'lucide-react'

export const DataTable = ({
  columns = [],
  data = [],
  rowKey = 'id',
  selectable = false,
  selectedRows = [],
  onSelectRow = () => {},
  onSelectAll = () => {},
  sortColumn,
  sortDirection = 'asc',
  onSort,
  loading = false,
  emptyMessage = 'No records found',
  emptyDescription = 'There is no data to display right now.',
  renderActions,
  className = '',
  onRowClick,
}) => {
  const allSelected =
    data.length > 0 && selectedRows.length === data.length
  const isPartiallySelected =
    selectedRows.length > 0 && selectedRows.length < data.length

  const handleSelectAllChange = () => {
    if (allSelected) {
      onSelectAll([])
    } else {
      onSelectAll(data.map((row) => row[rowKey]))
    }
  }

  const handleRowCheckbox = (id, e) => {
    e.stopPropagation()
    onSelectRow(id)
  }

  const handleHeaderSort = (key, sortable) => {
    if (!sortable || !onSort) return
    const nextDirection =
      sortColumn === key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(key, nextDirection)
  }

  return (
    <div className={`w-full bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 border-collapse">
          {/* Table Header */}
          <thead className="bg-[#F8F9FB] text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200/80 select-none">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected
                    }}
                    onChange={handleSelectAllChange}
                    className="w-4 h-4 rounded border-gray-300 text-[#FB6C00] focus:ring-[#FB6C00] cursor-pointer"
                    aria-label="Select all rows"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortColumn === col.key
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => handleHeaderSort(col.key, col.sortable)}
                    className={`px-5 py-3.5 ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${
                      col.sortable
                        ? 'cursor-pointer hover:text-gray-900 transition-colors'
                        : ''
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'right' ? 'justify-end' : ''
                      }`}
                    >
                      <span>{col.title}</span>
                      {col.sortable && (
                        <span className="text-gray-400">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#FB6C00]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#FB6C00]" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}

              {renderActions && (
                <th className="px-5 py-3.5 text-right w-20">Actions</th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (renderActions ? 1 : 0)}
                  className="px-5 py-16 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#FB6C00]" />
                    <span className="text-xs font-medium text-gray-500">
                      Loading records...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (renderActions ? 1 : 0)}
                  className="px-5 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-3">
                      <Inbox className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {emptyMessage}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {emptyDescription}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const id = row[rowKey] || index
                const isSelected = selectedRows.includes(id)

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${
                      isSelected
                        ? 'bg-orange-50/40 hover:bg-orange-50/70'
                        : 'hover:bg-gray-50/70'
                    }`}
                  >
                    {selectable && (
                      <td className="w-12 px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowCheckbox(id, e)}
                          className="w-4 h-4 rounded border-gray-300 text-[#FB6C00] focus:ring-[#FB6C00] cursor-pointer"
                          aria-label={`Select row ${id}`}
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-5 py-3.5 ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        }`}
                      >
                        {col.render
                          ? col.render(row, row[col.key], index)
                          : row[col.key] !== undefined && row[col.key] !== null
                          ? String(row[col.key])
                          : '—'}
                      </td>
                    ))}

                    {renderActions && (
                      <td
                        className="px-5 py-3.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renderActions(row, index)}
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
