import { X } from 'lucide-react'
import SearchInput from './SearchInput'
import Select from './Select'
import Button from './Button'

export const FilterBar = ({
  searchQuery = '',
  onSearchChange = () => {},
  searchPlaceholder = 'Search...',
  statusValue = '',
  onStatusChange = () => {},
  statusOptions = [],
  children,
  onClearFilters,
  hasActiveFilters = false,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/80 p-3.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${className}`}
    >
      {/* Search Bar */}
      <div className="flex-1 min-w-[220px]">
        <SearchInput
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {statusOptions.length > 0 && (
          <div className="w-40">
            <Select
              placeholder="All Statuses"
              value={statusValue}
              onChange={onStatusChange}
              options={statusOptions}
              clearable
            />
          </div>
        )}

        {children}

        {hasActiveFilters && onClearFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            leftIcon={X}
            className="text-gray-500 hover:text-gray-800 text-xs"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}

export default FilterBar
