import { useState } from 'react'
import {
  Save,
  Eye,
  FileDown,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
} from 'lucide-react'
import { Button, ConfirmDialog } from '../../../components/common'

export const ProposalActions = ({
  currentStep = 1,
  totalSteps = 4,
  onPrev = () => {},
  onNext = () => {},
  onSaveDraft = () => {},
  onPublish = () => {},
  onPreview = () => {},
  onDownloadPdf = () => {},
  onDuplicate,
  onDelete,
  isSaving = false,
  isGeneratingPdf = false,
  isEditMode = false,
  className = '',
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <div
        className={`bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20 ${className}`}
      >
        {/* Step Navigation Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPrev}
            disabled={currentStep <= 1 || isSaving}
            icon={ChevronLeft}
            className="text-xs"
          >
            Previous
          </Button>

          <span className="text-xs text-gray-500 font-medium px-2">
            Step <span className="text-gray-900 font-bold">{currentStep}</span> of{' '}
            {totalSteps}
          </span>

          <Button
            type="button"
            variant={currentStep === totalSteps ? 'outline' : 'primary'}
            size="sm"
            onClick={onNext}
            disabled={currentStep >= totalSteps || isSaving}
            rightIcon={ChevronRight}
            className="text-xs"
          >
            Next
          </Button>
        </div>

        {/* Global Proposal Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
          {/* Quick Preview Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPreview}
            icon={Eye}
            className="text-xs text-gray-700"
          >
            A4 Preview
          </Button>

          {/* Download PDF */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            icon={isGeneratingPdf ? Loader2 : FileDown}
            className="text-xs text-gray-700"
          >
            {isGeneratingPdf ? 'Generating...' : 'Export PDF'}
          </Button>

          {/* Duplicate (if editing) */}
          {isEditMode && onDuplicate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDuplicate}
              icon={Copy}
              className="text-xs text-gray-700 hidden md:inline-flex"
            >
              Duplicate
            </Button>
          )}

          {/* Delete (if editing) */}
          {isEditMode && onDelete && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              icon={Trash2}
              className="text-xs"
            >
              Delete
            </Button>
          )}

          {/* Save Draft */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onSaveDraft('draft')}
            disabled={isSaving}
            icon={isSaving ? Loader2 : Save}
            className="text-xs"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>

          {/* Save & Publish / Send */}
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onPublish('sent')}
            disabled={isSaving}
            icon={Send}
            className="text-xs font-semibold"
          >
            {isEditMode ? 'Update Proposal' : 'Publish & Finalize'}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isEditMode && onDelete && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            setShowDeleteConfirm(false)
            onDelete()
          }}
          title="Delete Proposal"
          description="Are you sure you want to permanently delete this proposal? This action cannot be reversed."
          variant="danger"
          confirmText="Delete Proposal"
        />
      )}
    </>
  )
}

export default ProposalActions
