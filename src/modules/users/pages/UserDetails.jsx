import { useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import useUserStore from '../store/userStore'
import UserDetailsCard from '../components/UserDetailsCard'

export const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getUserById, fetchUser, deleteUser, updateUserStatus, isLoading } = useUserStore()

  useEffect(() => {
    if (id) {
      fetchUser(id)
    }
  }, [id, fetchUser])

  const user = useMemo(() => getUserById(id), [id, getUserById])

  if (isLoading && !user) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <Loader2 className="w-8 h-8 text-[#0055FF] animate-spin mx-auto mb-3" />
        <h2 className="text-sm font-semibold text-gray-700">Loading user details...</h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back button row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Users</span>
        </button>
      </div>

      {/* User Details Card */}
      <UserDetailsCard
        user={user}
        onDelete={async (userId) => {
          await deleteUser(userId)
          navigate('/users')
        }}
        onToggleStatus={async (userId, newStatus) => {
          await updateUserStatus(userId, newStatus)
        }}
      />
    </div>
  )
}

export default UserDetails
