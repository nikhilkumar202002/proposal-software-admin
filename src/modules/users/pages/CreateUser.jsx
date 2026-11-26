import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import useUserStore from '../store/userStore'
import UserForm from '../components/UserForm'

export const CreateUser = () => {
  const navigate = useNavigate()
  const { addUser } = useUserStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [apiErrors, setApiErrors] = useState({})

  const handleCreateUser = async (formData) => {
    setIsSubmitting(true)
    setErrorMessage(null)
    setApiErrors({})
    try {
      const newUser = await addUser(formData)
      setIsSubmitting(false)
      setSuccessMessage(`User "${newUser?.name || formData.name}" created successfully! Redirecting...`)
      setTimeout(() => {
        navigate('/users')
      }, 1000)
    } catch (err) {
      setIsSubmitting(false)
      const fieldErrors = err.response?.data?.errors || {}
      setApiErrors(fieldErrors)
      const firstError = Object.values(fieldErrors).flat()[0]
      const errorMsg =
        firstError ||
        err.response?.data?.message ||
        err.message ||
        'Failed to create user. Please try again.'
      setErrorMessage(errorMsg)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Error Banner */}
      {errorMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-white" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Banner */}
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
          onClick={() => navigate('/users')}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          title="Back to User List"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Add New User
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Create a team member account and configure their access permissions.
          </p>
        </div>
      </div>

      {/* User Form */}
      <UserForm
        onSubmit={handleCreateUser}
        isSubmitting={isSubmitting}
        isEdit={false}
        apiErrors={apiErrors}
      />
    </div>
  )
}

export default CreateUser
