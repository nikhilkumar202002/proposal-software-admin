import { Users, UserCheck, UserX, ShieldCheck } from 'lucide-react'

export const UserStats = ({ users = [] }) => {
  const safeUsers = Array.isArray(users) ? users : []

  const totalUsers = safeUsers.length
  const activeUsers = safeUsers.filter((u) => u.status === 'active').length
  const inactiveUsers = safeUsers.filter((u) => u.status === 'inactive').length
  const pendingUsers = safeUsers.filter((u) => u.status === 'pending').length
  const adminUsers = safeUsers.filter((u) => ['super_admin', 'admin'].includes(u.role)).length

  const activePercent = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      subtext: `${pendingUsers} pending invite`,
      icon: Users,
      iconBg: 'bg-blue-50 text-[#0055FF]',
    },
    {
      title: 'Active Users',
      value: activeUsers,
      subtext: `${activePercent}% of directory`,
      icon: UserCheck,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers,
      subtext: 'Disabled or paused accounts',
      icon: UserX,
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      title: 'Administrators',
      value: adminUsers,
      subtext: 'Super Admin & Admin roles',
      icon: ShieldCheck,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((item, idx) => {
        const Icon = item.icon
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {item.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${item.iconBg}`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {item.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.subtext}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default UserStats
