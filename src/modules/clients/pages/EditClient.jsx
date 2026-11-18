import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useClientStore from '../store/clientStore'
import ClientForm from '../components/ClientForm'
import { Button } from '../../../components/common'

export const EditClient = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentClient, loadClient, updateClient, isLoading, isSaving } = useClientStore()

  useEffect(() => {
    if (id) {
      loadClient(id)
    }
  }, [id, loadClient])

  const handleUpdate = async (formData) => {
    try {
      await updateClient(id, formData)
      navigate('/clients')
    } catch (err) {
      console.error('Failed to update client:', err)
    }
  }

  if (isLoading || !currentClient) {
    return (
      <div className="p-12 text-center text-gray-500 text-sm">
        Loading client profile...
      </div>
    )
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
              Client Management • {currentClient.companyName}
            </span>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              Edit Client Profile
            </h2>
          </div>
        </div>
      </div>

      {/* Main Client Form */}
      <ClientForm
        initialData={currentClient}
        onSubmit={handleUpdate}
        onCancel={() => navigate('/clients')}
        isSaving={isSaving}
        isEditMode={true}
      />
    </div>
  )
}

export default EditClient
