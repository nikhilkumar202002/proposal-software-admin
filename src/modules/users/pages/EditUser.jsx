import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import useUserStore from '../store/userStore'
import UserForm from '../components/UserForm'

export const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getUserById, updateUser } = useUserStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  const user = useMemo(() => getUserById(id), [id, getUserById])

  const handleUpdateUser = (formData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      // Clean empty password if not changed
      const payload = { ...formData }
      if (!payload.password) {
        delete payload.password
        delete payload.confirmPassword
      }

      updateUser(id, payload)
      setIsSubmitting(false)
      setSuccessMessage(`Changes for "${user.name}" saved successfully!`)
      setTimeout(() => {
        navigate(`/users/${id}`)
      }, 1000)
    }, 400)
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-gray-900">User Not Found</h2>
        <p className="text-xs text-gray-500 mt-1">
          The requested user account does not exist or may have been deleted.
        </p>
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0055FF] text-white"
        >
          Back to Users Directory
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Success Notification */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-gray-200/80">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Edit User Profile
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Modify team member credentials, security role, and module permissions.
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <UserForm
        initialData={user}
        isEdit={true}
        onSubmit={handleUpdateUser}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default EditUser
