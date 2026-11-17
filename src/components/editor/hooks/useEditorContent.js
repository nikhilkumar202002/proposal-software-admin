import { useEffect, useRef, useCallback } from 'react'
import useEditorStore from '../store/editorStore'

export function useEditorContent({
  editor,
  onUpdate,
  debounceMs = 400,
}) {
  const debounceTimerRef = useRef(null)
  const setContent = useEditorStore((s) => s.setContent)
  const setStats = useEditorStore((s) => s.setStats)
  const setActiveFormatting = useEditorStore((s) => s.setActiveFormatting)

  // Update active formatting states from TipTap editor
  const syncFormatting = useCallback(() => {
    if (!editor) return

    setActiveFormatting({
      isBold: editor.isActive('bold'),
      isItalic: editor.isActive('italic'),
      isUnderline: editor.isActive('underline'),
      isStrike: editor.isActive('strike'),
      isCode: editor.isActive('code'),
      headingLevel: [1, 2, 3, 4].find((l) => editor.isActive('heading', { level: l })) || 0,
      alignment: editor.isActive({ textAlign: 'center' })
        ? 'center'
        : editor.isActive({ textAlign: 'right' })
        ? 'right'
        : editor.isActive({ textAlign: 'justify' })
        ? 'justify'
        : 'left',
      isBulletList: editor.isActive('bulletList'),
      isOrderedList: editor.isActive('orderedList'),
      isBlockquote: editor.isActive('blockquote'),
      isLink: editor.isActive('link'),
      isTable: editor.isActive('table'),
    })

    const characterCount = editor.storage.characterCount?.characters?.() || 0
    const wordCount = editor.storage.characterCount?.words?.() || 0
    setStats({ characterCount, wordCount })
  }, [editor, setActiveFormatting, setStats])

  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      syncFormatting()

      const json = editor.getJSON()
      setContent(json)

      if (onUpdate) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        debounceTimerRef.current = setTimeout(() => {
          onUpdate(json)
        }, debounceMs)
      }
    }

    const handleSelectionUpdate = () => {
      syncFormatting()
    }

    editor.on('update', handleUpdate)
    editor.on('selectionUpdate', handleSelectionUpdate)

    return () => {
      editor.off('update', handleUpdate)
      editor.off('selectionUpdate', handleSelectionUpdate)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [editor, onUpdate, debounceMs, setContent, syncFormatting])

  const getJSON = useCallback(() => {
    return editor ? editor.getJSON() : null
  }, [editor])

  const getHTML = useCallback(() => {
    return editor ? editor.getHTML() : ''
  }, [editor])

  return {
    getJSON,
    getHTML,
    syncFormatting,
  }
}

export default useEditorContent
