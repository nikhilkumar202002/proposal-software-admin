import { useState, useEffect, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link2,
  Highlighter,
} from 'lucide-react'

export const EditorBubbleMenu = ({ editor }) => {
  const [position, setPosition] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!editor) return

    const updatePosition = () => {
      const { state, view } = editor
      const { selection } = state

      // Only show when text is selected (non-empty selection) and editor is focused
      if (selection.empty || !view.hasFocus()) {
        setPosition(null)
        return
      }

      // Check if inside a node that shouldn't show bubble menu (like code block or image)
      if (editor.isActive('image')) {
        setPosition(null)
        return
      }

      try {
        const { from, to } = selection
        const start = view.coordsAtPos(from)
        const end = view.coordsAtPos(to)

        // Middle of selection coordinates
        const left = (start.left + end.right) / 2
        const top = start.top - 46 // 46px above selection

        setPosition({ left, top })
      } catch {
        setPosition(null)
      }
    }

    editor.on('selectionUpdate', updatePosition)
    editor.on('blur', () => setPosition(null))

    return () => {
      editor.off('selectionUpdate', updatePosition)
    }
  }, [editor])

  if (!editor || !position) return null

  const isBold = editor.isActive('bold')
  const isItalic = editor.isActive('italic')
  const isUnderline = editor.isActive('underline')
  const isStrike = editor.isActive('strike')
  const isLink = editor.isActive('link')
  const isHighlight = editor.isActive('highlight')

  const btnClass = (active) =>
    `p-1.5 rounded transition-colors cursor-pointer ${
      active
        ? 'bg-orange-50 text-[#FB6C00]'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`

  const handleLinkToggle = () => {
    if (isLink) {
      editor.chain().focus().unsetLink().run()
    } else {
      const url = window.prompt('Enter destination URL:')
      if (url) {
        editor.chain().focus().setLink({ href: url }).run()
      }
    }
  }

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${position.left}px`,
        top: `${position.top}px`,
        transform: 'translateX(-50%)',
      }}
      className="z-50 bg-white rounded-xl shadow-xl border border-gray-200/90 p-1 flex items-center gap-0.5 animate-in fade-in-50 zoom-in-95 select-none"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(isBold)}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(isItalic)}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(isUnderline)}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(isStrike)}
        title="Strikethrough"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <div className="h-4 w-px bg-gray-200 mx-0.5" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={btnClass(isHighlight)}
        title="Highlight Text"
      >
        <Highlighter className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={handleLinkToggle}
        className={btnClass(isLink)}
        title={isLink ? 'Remove Link' : 'Add Link'}
      >
        <Link2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default EditorBubbleMenu
