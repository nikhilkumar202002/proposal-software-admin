import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit3,
  FileDown,
  Printer,
  Copy,
} from 'lucide-react'
import useProposalStore from '../store/proposalStore'
import { DocumentCanvas } from '../../../components/document'
import { Button, StatusBadge } from '../../../components/common'
import { convertProposalToDocumentCanvasProps } from '../utils/proposalHelpers'

export const ProposalPreview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    currentProposal,
    loadProposal,
    duplicateProposal,
    downloadPdf,
    isLoading,
    isGeneratingPdf,
  } = useProposalStore()

  useEffect(() => {
    if (id) {
      loadProposal(id)
    }
  }, [id, loadProposal])

  const handleDuplicate = async () => {
    if (!currentProposal) return
    const clone = await duplicateProposal(currentProposal.id)
    navigate(`/proposals/${clone.id}/edit`)
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading || !currentProposal) {
    return (
      <div className="p-12 text-center text-gray-500 text-sm">
        Loading document preview...
      </div>
    )
  }

  const canvasProps = convertProposalToDocumentCanvasProps(currentProposal)

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs print:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/proposals')}
            icon={ArrowLeft}
            className="text-xs"
          >
            Back to List
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#FB6C00]">
                {currentProposal.number}
              </span>
              <span className="text-gray-300">•</span>
              <StatusBadge status={currentProposal.status || 'draft'} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              {currentProposal.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icon={Printer}
            className="text-xs"
          >
            Print
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadPdf(currentProposal.id)}
            disabled={isGeneratingPdf}
            icon={FileDown}
            className="text-xs"
          >
            {isGeneratingPdf ? 'Generating...' : 'Export PDF'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            icon={Copy}
            className="text-xs hidden md:inline-flex"
          >
            Duplicate
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/proposals/${currentProposal.id}/edit`)}
            icon={Edit3}
            className="text-xs font-semibold"
          >
            Edit Proposal
          </Button>
        </div>
      </div>

      {/* Main Document Canvas Render */}
      <div className="w-full flex justify-center">
        <DocumentCanvas
          content={canvasProps.content}
          company={canvasProps.company}
          proposal={canvasProps.proposal}
          showToolbar={true}
          onPrint={handlePrint}
        />
      </div>
    </div>
  )
}

export default ProposalPreview
