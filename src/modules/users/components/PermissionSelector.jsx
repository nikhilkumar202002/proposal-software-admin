import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Check,
  LayoutDashboard,
  FileText,
  Users,
  Sparkles,
  ShieldCheck,
  UserCog,
  Settings,
} from 'lucide-react'
import { PERMISSION_MODULES } from '../data/usersData'

const moduleIcons = {
  dashboard: LayoutDashboard,
  proposals: FileText,
  clients: Users,
  ai: Sparkles,
  users: UserCog,
  roles: ShieldCheck,
  settings: Settings,
}

export const PermissionSelector = ({
  selectedPermissions = [],
  onChange = () => {},
  readOnly = false,
  className = '',
}) => {
  // Track open/collapsed state of each group (default all expanded)
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {}
    PERMISSION_MODULES.forEach((m) => {
      initial[m.id] = true
    })
    return initial
  })

  const toggleGroup = (moduleId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const toggleExpandAll = () => {
    const allOpen = Object.values(openGroups).every(Boolean)
    const nextState = {}
    PERMISSION_MODULES.forEach((m) => {
      nextState[m.id] = !allOpen
    })
    setOpenGroups(nextState)
  }

  const handleTogglePermission = (permissionId) => {
    if (readOnly) return
    const isSelected = selectedPermissions.includes(permissionId)
    const updated = isSelected
      ? selectedPermissions.filter((id) => id !== permissionId)
      : [...selectedPermissions, permissionId]
    onChange(updated)
  }

  const handleToggleModuleAll = (module) => {
    if (readOnly) return
    const modulePermIds = module.permissions.map((p) => p.id)
    const allSelected = modulePermIds.every((id) => selectedPermissions.includes(id))

    let updated
    if (allSelected) {
      // Unselect all for this module
      const modulePermSet = new Set(modulePermIds)
      updated = selectedPermissions.filter((id) => !modulePermSet.has(id))
    } else {
      // Select all for this module
      const newPermSet = new Set([...selectedPermissions, ...modulePermIds])
      updated = Array.from(newPermSet)
    }
    onChange(updated)
  }

  const totalPermissions = PERMISSION_MODULES.reduce(
    (sum, m) => sum + m.permissions.length,
    0
  )
  const selectedCount = selectedPermissions.length
  const allGroupsOpen = Object.values(openGroups).every(Boolean)

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700">
            Assigned Capabilities
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#0055FF] border border-blue-100">
            {selectedCount} of {totalPermissions} permissions granted
          </span>
        </div>

        <button
          type="button"
          onClick={toggleExpandAll}
          className="text-[11px] font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          {allGroupsOpen ? 'Collapse All Groups' : 'Expand All Groups'}
        </button>
      </div>

      {/* Module Permission Groups */}
      <div className="space-y-3">
        {PERMISSION_MODULES.map((module) => {
          const Icon = moduleIcons[module.id] || FileText
          const isOpen = openGroups[module.id] ?? true
          const modulePermIds = module.permissions.map((p) => p.id)
          const moduleSelectedCount = modulePermIds.filter((id) =>
            selectedPermissions.includes(id)
          ).length
          const isAllModuleSelected =
            modulePermIds.length > 0 && moduleSelectedCount === modulePermIds.length
          const isPartiallySelected =
            moduleSelectedCount > 0 && !isAllModuleSelected

          return (
            <div
              key={module.id}
              className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden transition-all"
            >
              {/* Module Header Bar */}
              <div
                onClick={() => toggleGroup(module.id)}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50/70 hover:bg-gray-50 cursor-pointer select-none transition-colors border-b border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0055FF] flex items-center justify-center shrink-0 border border-blue-100/80">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 tracking-tight">
                        {module.name}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-medium border ${
                          isAllModuleSelected
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : moduleSelectedCount > 0
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {moduleSelectedCount}/{module.permissions.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  {!readOnly && (
                    <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 hover:text-gray-900 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isAllModuleSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isPartiallySelected
                        }}
                        onChange={() => handleToggleModuleAll(module)}
                        className="rounded border-gray-300 text-[#0055FF] focus:ring-[#0055FF]/30 cursor-pointer w-3.5 h-3.5"
                      />
                      <span>Select All</span>
                    </label>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleGroup(module.id)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Individual Permissions List */}
              {isOpen && (
                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white">
                  {module.permissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.id)

                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                          isChecked
                            ? 'border-blue-200 bg-blue-50/40 text-gray-900'
                            : 'border-transparent hover:bg-gray-50 text-gray-600'
                        } ${readOnly ? 'cursor-default pointer-events-none' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={readOnly}
                          onChange={() => handleTogglePermission(perm.id)}
                          className="mt-0.5 rounded border-gray-300 text-[#0055FF] focus:ring-[#0055FF]/30 cursor-pointer w-3.5 h-3.5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-medium text-gray-900 leading-tight">
                            {perm.label}
                          </span>
                          <span className="block text-[10.5px] text-gray-400 leading-tight mt-0.5 truncate">
                            {perm.description}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PermissionSelector
