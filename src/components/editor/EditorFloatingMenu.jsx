import { useState, useEffect, useRef } from 'react'
import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Table as TableIcon,
  Scissors,
  Info,
  Plus,
} from 'lucide-react'

export const EditorFloatingMenu = ({ editor }) => {
  const [position, setPosition] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!editor) return

    const updatePosition = () => {
      const { state, view } = editor
      const { selection } = state
      const { $from, empty } = selection

      // Only show when selection is empty and at the start of an empty block/paragraph
      const isCurrentNodeEmpty =
        $from.parent.type.name === 'paragraph' &&
        $from.parent.textContent.length === 0

      if (!empty || !isCurrentNodeEmpty || !view.hasFocus()) {
        setPosition(null)
        setIsOpen(false)
        return
      }

      try {
        const coords = view.coordsAtPos($from.pos)
        // Position immediately to the left or above the empty line
        const left = coords.left - 32
        const top = coords.top - 2
        setPosition({ left, top })
      } catch {
        setPosition(null)
      }
    }

    editor.on('selectionUpdate', updatePosition)
    editor.on('blur', () => {
      setTimeout(() => {
        if (!menuRef.current?.contains(document.activeElement)) {
          setPosition(null)
          setIsOpen(false)
        }
      }, 150)
    })

    return () => {
      editor.off('selectionUpdate', updatePosition)
    }
  }, [editor])

  if (!editor || !position) return null

  const handleAction = (callback) => {
    callback()
    setIsOpen(false)
  }

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      className="z-40 select-none"
    >
      {/* Small '+' Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-2xs hover:border-[#FB6C00] text-gray-400 hover:text-[#FB6C00] flex items-center justify-center transition-colors cursor-pointer"
        title="Insert block"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div className="absolute top-8 left-0 w-52 bg-white rounded-xl shadow-xl border border-gray-200/90 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 text-xs">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Quick Insert
          </div>

          <button
            type="button"
            onClick={() =>
              handleAction(() => editor.chain().focus().toggleHeading({ level: 1 }).run())
            }
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-gray-700 hover:bg-orange-50 hover:text-[#FB6C00] transition-colors"
          >
            <Heading1 className="w-4 h-4 text-gray-400" />
            <span>Heading 1</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleAction(() => editor.chain().focus().toggleHeading({ level: 2 }).run())
            }
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-gray-700 hover:bg-orange-50 hover:text-[#FB6C00] transition-colors"
          >
            <Heading2 className="w-4 h-4 text-gray-400" />
            <span>Heading 2</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleAction(() => editor.chain().focus().toggleBulletList().run())
            }
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-gray-700 hover:bg-orange-50 hover:text-[#FB6C00] transition-colors"
          >
            <List className="w-4 h-4 text-gray-400" />
            <span>Bullet List</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleAction(() => editor.chain().focus().toggleOrderedList().run())
            }
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-gray-700 hover:bg-orange-50 hover:text-[#FB6C00] transition-colors"
          >
            <ListOrdered className="w-4 h-4 text-gray-400" />
            <span>Numbered List</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleAction(() =>
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              )
            }
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-gray-700 hover:bg-orange-50 hover:text-[#FB6C00] transition-colors"
          >
            <TableIcon className="w-4 h-4 text-gray-400" />
            <span>Table (3 × 3)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleAction(() =>
                editor.chain().focus().toggleCallout({ type: 'info' }).run()
              )
            }
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-gray-700 hover:bg-orange-50 hover:text-[#FB6C00] transition-colors"
          >
            <Info className="w-4 h-4 text-gray-400" />
            <span>Proposal Notice Box</span>
          </button>

          <div className="my-1 border-t border-gray-100" />

          <button
            type="button"
            onClick={() =>
              handleAction(() => editor.chain().focus().setPageBreak().run())
            }
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[#FB6C00] hover:bg-orange-50 font-medium transition-colors"
          >
            <Scissors className="w-4 h-4" />
            <span>A4 Page Break</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default EditorFloatingMenu
