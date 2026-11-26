import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useClientStore } from '../store/clientStore'
import ClientDetails from '../components/ClientDetails'
import { ConfirmDialog } from '../../../components/common'

export const ClientDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentClient, loadClient, deleteClient, isLoading } = useClientStore()
  const [clientToDelete, setClientToDelete] = useState(null)

  useEffect(() => {
    if (id) {
      loadClient(id).catch(() => {})
    }
  }, [id, loadClient])

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return
    try {
      await deleteClient(clientToDelete.id)
      setClientToDelete(null)
      navigate('/clients')
    } catch {
      // Error handled in store
    }
  }

  if (isLoading && !currentClient) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center">
        <Loader2 className="w-8 h-8 text-[#0055FF] animate-spin mx-auto mb-3" />
        <h2 className="text-sm font-semibold text-gray-700">Loading client profile...</h2>
      </div>
    )
  }

  if (!currentClient && !isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center space-y-4 bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-base font-bold text-gray-900">Client Not Found</h2>
        <p className="text-xs text-gray-500">The requested client could not be located in your database.</p>
        <button
          type="button"
          onClick={() => navigate('/clients')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0055FF] rounded-xl hover:bg-[#0044CC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Client Directory
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Back button bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/clients')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Client Directory</span>
        </button>
      </div>

      {/* Main Client Details View */}
      <ClientDetails
        client={currentClient}
        onEdit={(c) => navigate(`/clients/${c.id}/edit`)}
        onDelete={(c) => setClientToDelete(c)}
        onCreateProposal={(c) => navigate('/proposals/new', { state: { prefilledClient: c } })}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(clientToDelete)}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Client Record"
        description={`Are you sure you want to delete "${clientToDelete?.companyName}" (${clientToDelete?.name})? All contact details will be removed.`}
        variant="danger"
        confirmText="Delete Client"
      />
    </div>
  )
}

export default ClientDetailsPage
