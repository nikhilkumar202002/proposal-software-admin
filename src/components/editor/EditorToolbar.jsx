import { useState } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  RemoveFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Minus,
  Scissors,
  Image as ImageIcon,
  Link2,
  Undo2,
  Redo2,
  ChevronDown,
  Info,
} from 'lucide-react'
import TableToolbar from './table/TableToolbar'
import LinkInsertModal from './modals/LinkInsertModal'
import ImageInsertModal from './modals/ImageInsertModal'
import { useEditorCommands } from './hooks/useEditorCommands'

export const EditorToolbar = ({ editor, className = '' }) => {
  const commands = useEditorCommands(editor)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isHeadingDropdownOpen, setIsHeadingDropdownOpen] = useState(false)

  if (!editor) return null

  // Active status checks
  const isBold = editor.isActive('bold')
  const isItalic = editor.isActive('italic')
  const isUnderline = editor.isActive('underline')
  const isStrike = editor.isActive('strike')
  const isCode = editor.isActive('code')

  const isAlignLeft = editor.isActive({ textAlign: 'left' })
  const isAlignCenter = editor.isActive({ textAlign: 'center' })
  const isAlignRight = editor.isActive({ textAlign: 'right' })
  const isAlignJustify = editor.isActive({ textAlign: 'justify' })

  const isBulletList = editor.isActive('bulletList')
  const isOrderedList = editor.isActive('orderedList')
  const isBlockquote = editor.isActive('blockquote')
  const isLink = editor.isActive('link')

  // Current heading label
  const currentHeading = [1, 2, 3, 4].find((l) =>
    editor.isActive('heading', { level: l })
  )
  const headingLabel = currentHeading ? `Heading ${currentHeading}` : 'Paragraph'

  const btnBase =
    'h-7 px-2 rounded flex items-center justify-center text-xs font-medium transition-colors select-none cursor-pointer'
  const activeClass = 'bg-orange-50 text-[#FB6C00] font-semibold border border-orange-200 shadow-2xs'
  const inactiveClass = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent'

  const handleLinkSubmit = ({ href, target }) => {
    commands.setLink({ href, target })
  }

  const handleImageSubmit = ({ src, alt, title }) => {
    commands.insertImage({ src, alt, title })
  }

  return (
    <>
      <div
        className={`bg-white border-b border-gray-200 px-3 py-1.5 flex items-center gap-1 flex-wrap text-xs select-none ${className}`}
        role="toolbar"
        aria-label="Document formatting toolbar"
      >
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            disabled={!editor.can().undo()}
            onClick={commands.undo}
            className={`${btnBase} ${inactiveClass} disabled:opacity-30 disabled:pointer-events-none p-1.5`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!editor.can().redo()}
            onClick={commands.redo}
            className={`${btnBase} ${inactiveClass} disabled:opacity-30 disabled:pointer-events-none p-1.5`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-gray-200 mx-1" />

        {/* Headings Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsHeadingDropdownOpen(!isHeadingDropdownOpen)}
            className={`${btnBase} ${currentHeading ? activeClass : inactiveClass} gap-1 min-w-[96px] justify-between`}
            title="Text Style"
          >
            <span>{headingLabel}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {isHeadingDropdownOpen && (
            <div
              className="absolute top-[calc(100%+4px)] left-0 w-36 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in-50 zoom-in-95"
              onMouseLeave={() => setIsHeadingDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  commands.setHeading(0)
                  setIsHeadingDropdownOpen(false)
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer ${
                  !currentHeading ? 'text-[#FB6C00] font-bold bg-orange-50/50' : 'text-gray-700'
                }`}
              >
                Paragraph
              </button>
              <button
                type="button"
                onClick={() => {
                  commands.setHeading(1)
                  setIsHeadingDropdownOpen(false)
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 font-bold cursor-pointer ${
                  currentHeading === 1 ? 'text-[#FB6C00] bg-orange-50/50' : 'text-gray-800'
                }`}
              >
                Heading 1
              </button>
              <button
                type="button"
                onClick={() => {
                  commands.setHeading(2)
                  setIsHeadingDropdownOpen(false)
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 font-semibold cursor-pointer ${
                  currentHeading === 2 ? 'text-[#FB6C00] bg-orange-50/50' : 'text-gray-800'
                }`}
              >
                Heading 2
              </button>
              <button
                type="button"
                onClick={() => {
                  commands.setHeading(3)
                  setIsHeadingDropdownOpen(false)
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 font-medium cursor-pointer ${
                  currentHeading === 3 ? 'text-[#FB6C00] bg-orange-50/50' : 'text-gray-800'
                }`}
              >
                Heading 3
              </button>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-gray-200 mx-1" />

        {/* Inline Text Formatting */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={commands.toggleBold}
            className={`${btnBase} ${isBold ? activeClass : inactiveClass} p-1.5`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={commands.toggleItalic}
            className={`${btnBase} ${isItalic ? activeClass : inactiveClass} p-1.5`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={commands.toggleUnderline}
            className={`${btnBase} ${isUnderline ? activeClass : inactiveClass} p-1.5`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={commands.toggleStrike}
            className={`${btnBase} ${isStrike ? activeClass : inactiveClass} p-1.5`}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={commands.toggleCode}
            className={`${btnBase} ${isCode ? activeClass : inactiveClass} p-1.5`}
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={commands.clearFormatting}
            className={`${btnBase} ${inactiveClass} p-1.5 text-gray-500`}
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-gray-200 mx-1" />

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => commands.setTextAlign('left')}
            className={`${btnBase} ${isAlignLeft ? activeClass : inactiveClass} p-1.5`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => commands.setTextAlign('center')}
            className={`${btnBase} ${isAlignCenter ? activeClass : inactiveClass} p-1.5`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => commands.setTextAlign('right')}
            className={`${btnBase} ${isAlignRight ? activeClass : inactiveClass} p-1.5`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => commands.setTextAlign('justify')}
            className={`${btnBase} ${isAlignJustify ? activeClass : inactiveClass} p-1.5`}
            title="Justify Text"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-gray-200 mx-1" />

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={commands.toggleBulletList}
            className={`${btnBase} ${isBulletList ? activeClass : inactiveClass} p-1.5`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={commands.toggleOrderedList}
            className={`${btnBase} ${isOrderedList ? activeClass : inactiveClass} p-1.5`}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={commands.toggleBlockquote}
            className={`${btnBase} ${isBlockquote ? activeClass : inactiveClass} p-1.5`}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCallout({ type: 'info' }).run()}
            className={`${btnBase} ${editor.isActive('callout') ? activeClass : inactiveClass} p-1.5`}
            title="Proposal Callout Box"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-gray-200 mx-1" />

        {/* Table System */}
        <TableToolbar editor={editor} />

        <div className="h-4 w-px bg-gray-200 mx-1" />

        {/* Inserts: Link, Image, Divider, Page Break */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setIsLinkModalOpen(true)}
            className={`${btnBase} ${isLink ? activeClass : inactiveClass} p-1.5`}
            title="Insert Link"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsImageModalOpen(true)}
            className={`${btnBase} ${inactiveClass} p-1.5`}
            title="Insert Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={commands.insertDivider}
            className={`${btnBase} ${inactiveClass} p-1.5`}
            title="Horizontal Divider"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Manual Page Break Button */}
          <button
            type="button"
            onClick={commands.insertPageBreak}
            className={`${btnBase} text-[#FB6C00] hover:bg-orange-50 font-semibold border border-orange-200/80 p-1.5 gap-1`}
            title="Insert Manual A4 Page Break (Ctrl+Enter)"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Break</span>
          </button>
        </div>
      </div>

      {/* Insert Link Modal */}
      <LinkInsertModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSubmit={handleLinkSubmit}
        onRemove={commands.unsetLink}
        initialUrl={editor.getAttributes('link').href || ''}
      />

      {/* Insert Image Modal */}
      <ImageInsertModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSubmit={handleImageSubmit}
      />
    </>
  )
}

export default EditorToolbar
