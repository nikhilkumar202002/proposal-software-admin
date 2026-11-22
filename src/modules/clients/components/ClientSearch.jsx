import { RotateCcw } from 'lucide-react'
import { SearchInput, Select, Button } from '../../../components/common'
import { CLIENT_STATUS_OPTIONS, COUNTRY_OPTIONS } from '../utils/clientHelpers'

export const ClientSearch = ({
  filters = {},
  onChange = () => {},
  className = '',
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...CLIENT_STATUS_OPTIONS,
  ]

  const countryOptions = [
    { value: 'all', label: 'All Countries' },
    ...COUNTRY_OPTIONS,
  ]

  const hasActiveFilters =
    Boolean(filters.search) ||
    (filters.status && filters.status !== 'all') ||
    (filters.country && filters.country !== 'all')

  const handleReset = () => {
    onChange({ search: '', status: 'all', country: 'all' })
  }

  return (
    <div
      className={`bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Search Input */}
      <div className="w-full md:w-80">
        <SearchInput
          placeholder="Search by client, company, email, city..."
          value={typeof filters.search === 'string' ? filters.search : ''}
          onChange={(e) => {
            const val = typeof e === 'string' ? e : e?.target?.value ?? ''
            onChange({ search: val })
          }}
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
        <div className="w-40">
          <Select
            options={statusOptions}
            value={filters.status || 'all'}
            onChange={(val) => onChange({ status: val })}
            placeholder="Status"
          />
        </div>

        <div className="w-44">
          <Select
            options={countryOptions}
            value={filters.country || 'all'}
            onChange={(val) => onChange({ country: val })}
            placeholder="Country"
          />
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            icon={RotateCcw}
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

export default ClientSearch
