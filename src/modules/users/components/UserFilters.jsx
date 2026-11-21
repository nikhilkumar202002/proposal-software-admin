import { RotateCcw, ArrowUpDown, Filter } from 'lucide-react'
import { ROLES, USER_STATUSES } from '../data/usersData'

export const UserFilters = ({
  role = 'all',
  status = 'all',
  sortBy = 'name',
  sortDirection = 'asc',
  onRoleChange = () => {},
  onStatusChange = () => {},
  onSortChange = () => {},
  onReset = () => {},
  hasActiveFilters = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {/* Role Filter */}
      <div className="relative">
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="appearance-none text-xs font-medium pl-3 pr-8 py-2 bg-white border border-gray-200/90 rounded-xl text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-all cursor-pointer shadow-2xs"
        >
          <option value="all">All Roles</option>
          {Object.values(ROLES).map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none text-xs font-medium pl-3 pr-8 py-2 bg-white border border-gray-200/90 rounded-xl text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-all cursor-pointer shadow-2xs"
        >
          <option value="all">All Statuses</option>
          {Object.values(USER_STATUSES).map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Sort Select */}
      <div className="relative">
        <select
          value={`${sortBy}-${sortDirection}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split('-')
            onSortChange(field, dir)
          }}
          className="appearance-none text-xs font-medium pl-3 pr-8 py-2 bg-white border border-gray-200/90 rounded-xl text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-all cursor-pointer shadow-2xs"
        >
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
          <option value="createdAt-desc">Created (Newest First)</option>
          <option value="createdAt-asc">Created (Oldest First)</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200/80 rounded-xl transition-colors cursor-pointer select-none"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  )
}

export default UserFilters
