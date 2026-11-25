import { useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Edit3,
  FileDown,
  Printer,
  Copy,
} from 'lucide-react'
import useProposalStore from '../store/proposalStore'
import { DocumentCanvas } from '../../../components/document'
import { Button } from '../../../components/common'
import { ProposalStatusDropdown } from '../components/ProposalStatusDropdown'
import { convertProposalToDocumentCanvasProps } from '../utils/proposalHelpers'

export const ProposalPreview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const shouldAutoPrint = searchParams.get('print') === 'true'

  const {
    currentProposal,
    loadProposal,
    duplicateProposal,
    downloadPdf,
    updateProposalStatus,
    isLoading,
    isGeneratingPdf,
  } = useProposalStore()

  useEffect(() => {
    if (id) {
      loadProposal(id)
    }
  }, [id, loadProposal])

  // Trigger print once proposal data and layout are fully ready
  useEffect(() => {
    if (shouldAutoPrint && !isLoading && currentProposal) {
      const timer = setTimeout(() => {
        window.print()
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [shouldAutoPrint, isLoading, currentProposal])

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
    <div className="space-y-6 print:space-y-0">
      {/* Top Header Bar */}
      <div className="space-y-3 no-print print:hidden">
        {/* Back Button Top */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/proposals')}
            icon={ArrowLeft}
            className="text-xs shadow-2xs"
          >
            Back
          </Button>
        </div>

        {/* Title on Left, Proposal Number & Action Buttons on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
            {currentProposal.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#0055FF]">
                {currentProposal.number}
              </span>
              <span className="text-gray-300">•</span>
              <ProposalStatusDropdown
                status={currentProposal.status || 'proposal_sent'}
                onChange={async (newStatus) => {
                  await updateProposalStatus(currentProposal.id, newStatus)
                }}
              />
            </div>

            <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Main Document Canvas Render */}
      <div className="w-full flex justify-center print:block print:p-0 print:m-0">
        <DocumentCanvas
          content={canvasProps.content}
          company={canvasProps.company}
          proposal={canvasProps.proposal}
          initialSettings={canvasProps.settings}
          showToolbar={true}
          onPrint={handlePrint}
        />
      </div>
    </div>
  )
}

export default ProposalPreview
