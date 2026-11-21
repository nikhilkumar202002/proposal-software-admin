import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import useUserStore from '../store/userStore'
import UserForm from '../components/UserForm'

export const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getUserById, fetchUser, updateUser, isLoading } = useUserStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (id) {
      fetchUser(id)
    }
  }, [id, fetchUser])

  const user = useMemo(() => getUserById(id), [id, getUserById])

  const handleUpdateUser = async (formData) => {
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      // Clean empty password if not changed
      const payload = { ...formData }
      if (!payload.password) {
        delete payload.password
        delete payload.confirmPassword
      }

      await updateUser(id, payload)
      setIsSubmitting(false)
      setSuccessMessage(`Changes for "${user?.name || formData.name}" saved successfully!`)
      setTimeout(() => {
        navigate(`/users/${id}`)
      }, 1000)
    } catch (err) {
      setIsSubmitting(false)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save changes. Please try again.'
      setErrorMessage(errorMsg)
    }
  }

  if (isLoading && !user) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <Loader2 className="w-8 h-8 text-[#0055FF] animate-spin mx-auto mb-3" />
        <h2 className="text-sm font-semibold text-gray-700">Loading user profile...</h2>
      </div>
    )
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
      {/* Error Notification */}
      {errorMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

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
