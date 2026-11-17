import { EditorContent as TipTapContent } from '@tiptap/react'
import TableCellMenu from './table/TableCellMenu'

export const EditorContent = ({ editor, className = '' }) => {
  if (!editor) return null

  return (
    <div className={`relative w-full ${className}`}>
      {/* Floating Table Cell Context Menu (appears when inside a table cell) */}
      <div className="sticky top-2 z-20 flex justify-end pr-4 pointer-events-auto">
        <TableCellMenu editor={editor} />
      </div>

      {/* Main ProseMirror Editable Area */}
      <TipTapContent
        editor={editor}
        className="tiptap-prosemirror w-full min-h-[420px] focus:outline-none"
      />
    </div>
  )
}

export default EditorContent
