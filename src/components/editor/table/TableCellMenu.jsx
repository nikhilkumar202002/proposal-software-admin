import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Merge,
  Split,
  Plus,
  Trash2,
} from 'lucide-react'

export const TableCellMenu = ({ editor }) => {
  if (!editor || !editor.isActive('table')) return null

  return (
    <div className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-md border border-gray-200 select-none text-xs">
      {/* Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className="p-1 rounded hover:bg-gray-100 text-gray-600"
        title="Align Left"
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className="p-1 rounded hover:bg-gray-100 text-gray-600"
        title="Align Center"
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className="p-1 rounded hover:bg-gray-100 text-gray-600"
        title="Align Right"
      >
        <AlignRight className="w-3.5 h-3.5" />
      </button>

      <div className="h-3.5 w-px bg-gray-200 mx-0.5" />

      {/* Row operations */}
      <button
        type="button"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        className="p-1 rounded hover:bg-gray-100 text-gray-600 flex items-center gap-0.5"
        title="Insert Row Below"
      >
        <Plus className="w-3 h-3 text-[#FB6C00]" />
        <span>Row</span>
      </button>

      {/* Column operations */}
      <button
        type="button"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        className="p-1 rounded hover:bg-gray-100 text-gray-600 flex items-center gap-0.5"
        title="Insert Column Right"
      >
        <Plus className="w-3 h-3 text-[#FB6C00]" />
        <span>Col</span>
      </button>

      <div className="h-3.5 w-px bg-gray-200 mx-0.5" />

      {/* Merge & Split */}
      <button
        type="button"
        onClick={() => editor.chain().focus().mergeCells().run()}
        className="p-1 rounded hover:bg-gray-100 text-gray-600"
        title="Merge Selected Cells"
      >
        <Merge className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().splitCell().run()}
        className="p-1 rounded hover:bg-gray-100 text-gray-600"
        title="Split Cell"
      >
        <Split className="w-3.5 h-3.5" />
      </button>

      <div className="h-3.5 w-px bg-gray-200 mx-0.5" />

      {/* Delete Row */}
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteRow().run()}
        className="p-1 rounded hover:bg-red-50 text-red-500"
        title="Delete Current Row"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default TableCellMenu
