import { useState } from 'react'
import {
  Plus,
  Trash2,
  LayoutGrid,
  List,
} from 'lucide-react'
import { Button, ConfirmDialog } from '../../../components/common'

export const ClientActions = ({
  onNewClient = () => {},
  selectedCount = 0,
  onDeleteSelected = () => {},
  viewMode = 'table', // 'table' | 'grid'
  onViewModeChange = () => {},
  className = '',
}) => {
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)

  return (
    <>
      <div
        className={`flex items-center justify-between gap-3 flex-wrap ${className}`}
      >
        {/* Left: Bulk Selection Actions */}
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0055FF]">
              <span>
                {selectedCount} client{selectedCount > 1 ? 's' : ''} selected
              </span>
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(true)}
                className="hover:text-red-700 text-red-600 transition-colors ml-1 p-0.5 cursor-pointer"
                title="Delete Selected"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Layout Switcher & New Client Button */}
        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={onNewClient}
            icon={Plus}
            className="font-semibold text-xs"
          >
            Add New Client
          </Button>
        </div>
      </div>

      {/* Bulk Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={() => {
          setShowBulkDeleteConfirm(false)
          onDeleteSelected()
        }}
        title="Delete Selected Clients"
        description={`Are you sure you want to delete ${selectedCount} selected client record(s)? This action cannot be reversed.`}
        variant="danger"
        confirmText={`Delete ${selectedCount} Clients`}
      />
    </>
  )
}

export default ClientActions
