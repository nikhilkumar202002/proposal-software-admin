import { useState, useRef, useEffect } from 'react'
import {
  Table as TableIcon,
  Plus,
  Trash2,
  Columns,
  Rows,
  Merge,
  Split,
  ChevronDown,
} from 'lucide-react'

export const TableToolbar = ({ editor }) => {
  const [isGridOpen, setIsGridOpen] = useState(false)
  const [gridHover, setGridHover] = useState({ rows: 3, cols: 3 })
  const gridRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target)) {
        setIsGridOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!editor) return null

  const isTableActive = editor.isActive('table')

  const handleInsertGrid = (rows, cols) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setIsGridOpen(false)
  }

  const insertProposalPreset = (type) => {
    setIsGridOpen(false)
    if (type === 'pricing') {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 5, cols: 4, withHeaderRow: true })
        .run()
    } else if (type === 'timeline') {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 4, cols: 3, withHeaderRow: true })
        .run()
    } else if (type === 'deliverables') {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 4, cols: 4, withHeaderRow: true })
        .run()
    }
  }

  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {/* Insert Table Grid Picker */}
      <div className="relative" ref={gridRef}>
        <button
          type="button"
          onClick={() => setIsGridOpen(!isGridOpen)}
          className={`h-7 px-2 rounded flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer ${
            isTableActive
              ? 'bg-blue-50 text-[#0055FF] font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title="Insert Table"
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>Table</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>

        {isGridOpen && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-200/90 p-3 z-50 animate-in fade-in-50 zoom-in-95 select-none">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Select Dimensions ({gridHover.rows} × {gridHover.cols})
            </span>

            {/* Grid 6x6 */}
            <div className="grid grid-cols-6 gap-1 p-1 bg-gray-50 rounded-lg border border-gray-100 mb-3">
              {Array.from({ length: 6 }).map((_, rIdx) =>
                Array.from({ length: 6 }).map((_, cIdx) => {
                  const isHighlighted =
                    rIdx < gridHover.rows && cIdx < gridHover.cols
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onMouseEnter={() =>
                        setGridHover({ rows: rIdx + 1, cols: cIdx + 1 })
                      }
                      onClick={() => handleInsertGrid(rIdx + 1, cIdx + 1)}
                      className={`w-6 h-6 rounded border transition-colors cursor-pointer ${
                        isHighlighted
                          ? 'bg-[#0055FF] border-[#0055FF]'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  )
                })
              )}
            </div>

            {/* Quick Proposal Table Presets */}
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Proposal Presets
              </span>
              <button
                type="button"
                onClick={() => insertProposalPreset('pricing')}
                className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#0055FF] rounded font-medium transition-colors"
              >
                📊 Commercial Pricing Matrix (4 Cols)
              </button>
              <button
                type="button"
                onClick={() => insertProposalPreset('timeline')}
                className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#0055FF] rounded font-medium transition-colors"
              >
                ⏱ Project Timeline Schedule (3 Cols)
              </button>
              <button
                type="button"
                onClick={() => insertProposalPreset('deliverables')}
                className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#0055FF] rounded font-medium transition-colors"
              >
                📋 Deliverables & Acceptance (4 Cols)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table modification controls (Active when cursor is inside table) */}
      {isTableActive && (
        <div className="flex items-center gap-0.5 pl-1.5 ml-1 border-l border-gray-200">
          {/* Row tools */}
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Add Row Above"
          >
            <div className="relative">
              <Rows className="w-3.5 h-3.5" />
              <Plus className="w-2 h-2 text-[#0055FF] absolute -top-1 -right-1 stroke-[3]" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Add Row Below"
          >
            <div className="relative">
              <Rows className="w-3.5 h-3.5" />
              <Plus className="w-2 h-2 text-[#0055FF] absolute -bottom-1 -right-1 stroke-[3]" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="p-1.5 rounded text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Row"
          >
            <Rows className="w-3.5 h-3.5" />
          </button>

          {/* Column tools */}
          <div className="h-4 w-px bg-gray-200 mx-0.5" />
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Add Column Left"
          >
            <div className="relative">
              <Columns className="w-3.5 h-3.5" />
              <Plus className="w-2 h-2 text-[#0055FF] absolute -top-1 -left-1 stroke-[3]" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Add Column Right"
          >
            <div className="relative">
              <Columns className="w-3.5 h-3.5" />
              <Plus className="w-2 h-2 text-[#0055FF] absolute -top-1 -right-1 stroke-[3]" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="p-1.5 rounded text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Column"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>

          {/* Merge & Split */}
          <div className="h-4 w-px bg-gray-200 mx-0.5" />
          <button
            type="button"
            onClick={() => editor.chain().focus().mergeCells().run()}
            className="p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Merge Cells"
          >
            <Merge className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().splitCell().run()}
            className="p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Split Cell"
          >
            <Split className="w-3.5 h-3.5" />
          </button>

          {/* Delete Table */}
          <div className="h-4 w-px bg-gray-200 mx-0.5" />
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="p-1.5 rounded text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Entire Table"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      )}
    </div>
  )
}

export default TableToolbar
