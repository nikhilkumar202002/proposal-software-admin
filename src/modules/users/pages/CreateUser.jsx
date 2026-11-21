import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import useUserStore from '../store/userStore'
import UserForm from '../components/UserForm'

export const CreateUser = () => {
  const navigate = useNavigate()
  const { addUser } = useUserStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleCreateUser = (formData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      const newUser = addUser(formData)
      setIsSubmitting(false)
      setSuccessMessage(`User "${newUser.name}" created successfully! Redirecting...`)
      setTimeout(() => {
        navigate('/users')
      }, 1000)
    }, 400)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
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
      />
    </div>
  )
}

export default CreateUser
