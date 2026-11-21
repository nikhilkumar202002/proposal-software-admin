import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Edit3,
  Phone,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Activity,
  UserCheck,
  KeyRound,
  FileText,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { ROLES, USER_STATUSES, PERMISSION_MODULES } from '../constants'
import UserAvatar from './UserAvatar'
import RoleBadge from './RoleBadge'
import UserStatusBadge from './UserStatusBadge'
import DeleteUserModal from './DeleteUserModal'

export const UserDetailsCard = ({
  user,
  onDelete = () => {},
  onToggleStatus = () => {},
}) => {
  const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  if (!user) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 text-center">
        <p className="text-sm text-gray-500">User account not found.</p>
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0055FF] text-white"
        >
          Back to Users
        </button>
      </div>
    )
  }

  const roleConfig = ROLES[user.role] || ROLES.viewer
  const statusConfig = USER_STATUSES[user.status] || USER_STATUSES.active
  const isActive = user.status === 'active'

  // Count granted permissions per module
  const grantedPermSet = new Set(user.permissions || [])

  return (
    <div className="space-y-6">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UserAvatar
              src={user.avatar}
              name={user.name}
              email={user.email}
              size="xl"
              status={user.status}
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  {user.name}
                </h2>
                <RoleBadge role={user.role} size="sm" />
                <UserStatusBadge status={user.status} size="sm" />
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onToggleStatus(user.id, isActive ? 'inactive' : 'active')}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                isActive
                  ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {isActive ? 'Deactivate User' : 'Activate User'}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/users/${user.id}/edit`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0055FF] hover:bg-[#0044CC] text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit User</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Delete user"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Phone */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider block">
              Phone Number
            </span>
            <span className="text-xs font-bold text-gray-900 mt-0.5 block">
              {user.phone || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Creation Date */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider block">
              Account Created
            </span>
            <span className="text-xs font-bold text-gray-900 mt-0.5 block">
              {user.createdAt || 'Jan 2024'}
            </span>
          </div>
        </div>

        {/* Last Login */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider block">
              Last Login
            </span>
            <span className="text-xs font-bold text-gray-900 mt-0.5 block">
              {user.lastLogin || 'Never'}
            </span>
          </div>
        </div>

        {/* Email Verification */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              user.emailVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            {user.emailVerified ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
          </div>
          <div>
            <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider block">
              Email Verification
            </span>
            <span className="text-xs font-bold text-gray-900 mt-0.5 block">
              {user.emailVerified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Assigned Role Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                Assigned Security Role
              </h3>
              <p className="text-xs text-gray-500">
                Primary access tier governing default permissions across the workspace
              </p>
            </div>
          </div>

          <RoleBadge role={user.role} size="md" />
        </div>

        <div className="mt-4 p-4 rounded-xl bg-gray-50/70 border border-gray-100">
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {roleConfig.description}
          </p>
        </div>
      </div>

      {/* 4. Permissions Overview Grouped by Module */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Granted Permissions Overview
            </h3>
            <p className="text-xs text-gray-500">
              Active system capabilities allocated to {user.name} ({user.permissions?.length || 0} total)
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/users/${user.id}/edit`)}
            className="text-xs font-semibold text-[#0055FF] hover:underline"
          >
            Modify Permissions
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERMISSION_MODULES.map((module) => {
            const grantedInModule = module.permissions.filter((p) =>
              grantedPermSet.has(p.id)
            )

            if (grantedInModule.length === 0) return null

            return (
              <div
                key={module.id}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/40"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-gray-900">
                    {module.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-blue-50 text-[#0055FF] border border-blue-100">
                    {grantedInModule.length}/{module.permissions.length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {grantedInModule.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 text-[11px] text-gray-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 5. Account Activity Timeline */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Account Activity Timeline
            </h3>
            <p className="text-xs text-gray-500">
              Audit log of logins, role updates, and proposal interactions
            </p>
          </div>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {(user.activityLog || []).map((activity, idx) => (
            <div key={activity.id || idx} className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#0055FF] ring-4 ring-white" />
              <div>
                <p className="text-xs font-semibold text-gray-900">
                  {activity.event}
                </p>
                <span className="text-[10.5px] text-gray-400 mt-0.5 block">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        user={user}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false)
          onDelete(user.id)
          navigate('/users')
        }}
      />
    </div>
  )
}

export default UserDetailsCard
