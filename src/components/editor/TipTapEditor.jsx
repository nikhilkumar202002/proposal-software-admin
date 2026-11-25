import { useEffect } from 'react'
import { useEditor } from '@tiptap/react'
import { getEditorExtensions } from './extensions/editorExtensions'
import EditorToolbar from './EditorToolbar'
import EditorBubbleMenu from './EditorBubbleMenu'
import EditorFloatingMenu from './EditorFloatingMenu'
import EditorContent from './EditorContent'
import { useEditorContent } from './hooks/useEditorContent'
import './styles/editor.css'

export const TipTapEditor = ({
  content,
  initialContent,
  onChange,
  onUpdate,
  editable = true,
  placeholder = 'Draft proposal content, agreements, or terms here...',
  showToolbar = true,
  showBubbleMenu = true,
  showFloatingMenu = true,
  showStatsBar = true,
  debounceMs = 300,
  className = '',
  editorClassName = '',
}) => {
  const editor = useEditor({
    extensions: getEditorExtensions({ placeholder }),
    content: content || initialContent || '',
    editable,
    immediatelyRender: false,
  })

  // Hook for stats and debounced change notifications
  useEditorContent({
    editor,
    onUpdate: (json) => {
      if (onChange) onChange(json)
      if (onUpdate) onUpdate(json)
    },
    debounceMs,
  })

  // Synchronize external content prop changes (e.g. async fetch from API or template append)
  useEffect(() => {
    if (!editor || !content) return
    const currentJson = editor.getJSON()
    if (JSON.stringify(currentJson) !== JSON.stringify(content)) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  const charCount = editor?.storage.characterCount?.characters?.() || 0
  const wordCount = editor?.storage.characterCount?.words?.() || 0

  return (
    <div className={`tiptap-editor-wrapper bg-white rounded-xl border border-gray-200/90 shadow-2xs ${className}`}>
      {/* Top Formatting Toolbar */}
      {showToolbar && editable && (
        <EditorToolbar editor={editor} />
      )}

      {/* Contextual Bubble Menu */}
      {showBubbleMenu && editable && (
        <EditorBubbleMenu editor={editor} />
      )}

      {/* Line Floating Menu */}
      {showFloatingMenu && editable && (
        <EditorFloatingMenu editor={editor} />
      )}

      {/* Editor Content Area */}
      <div className={`p-2 flex-1 overflow-y-auto ${editorClassName}`}>
        <EditorContent editor={editor} />
      </div>

      {/* Bottom Status & Word Count Bar */}
      {showStatsBar && (
        <div className="px-4 py-2 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 select-none">
          <div className="flex items-center gap-3">
            <span>
              Words: <strong className="text-gray-700">{wordCount}</strong>
            </span>
            <span>•</span>
            <span>
              Characters: <strong className="text-gray-700">{charCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              Press <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px]">Ctrl+Enter</kbd> for A4 Page Break
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TipTapEditor
