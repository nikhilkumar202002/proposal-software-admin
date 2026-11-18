import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useClientStore from '../store/clientStore'
import ClientForm from '../components/ClientForm'
import { Button } from '../../../components/common'

export const CreateClient = () => {
  const navigate = useNavigate()
  const { createClient, isSaving } = useClientStore()

  const handleCreate = async (formData) => {
    try {
      await createClient(formData)
      navigate('/clients')
    } catch (err) {
      console.error('Failed to create client:', err)
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/clients')}
            icon={ArrowLeft}
            className="text-xs"
          >
            Back to Clients
          </Button>

          <div>
            <span className="text-xs text-gray-500 font-medium">
              Client Management
            </span>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              Create New Client Account
            </h2>
          </div>
        </div>
      </div>

      {/* Main Client Form */}
      <ClientForm
        onSubmit={handleCreate}
        onCancel={() => navigate('/clients')}
        isSaving={isSaving}
        isEditMode={false}
      />
    </div>
  )
}

export default CreateClient
