import { useCallback } from 'react'

export function useEditorCommands(editor) {
  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run()
  }, [editor])

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run()
  }, [editor])

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run()
  }, [editor])

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run()
  }, [editor])

  const toggleCode = useCallback(() => {
    editor?.chain().focus().toggleCode().run()
  }, [editor])

  const clearFormatting = useCallback(() => {
    editor?.chain().focus().unsetAllMarks().clearNodes().run()
  }, [editor])

  const setHeading = useCallback(
    (level) => {
      if (level === 0) {
        editor?.chain().focus().setParagraph().run()
      } else {
        editor?.chain().focus().toggleHeading({ level }).run()
      }
    },
    [editor]
  )

  const setTextAlign = useCallback(
    (alignment) => {
      editor?.chain().focus().setTextAlign(alignment).run()
    },
    [editor]
  )

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run()
  }, [editor])

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run()
  }, [editor])

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run()
  }, [editor])

  const insertDivider = useCallback(() => {
    editor?.chain().focus().setHorizontalRule().run()
  }, [editor])

  const insertPageBreak = useCallback(() => {
    editor?.chain().focus().setPageBreak().run()
  }, [editor])

  const insertTable = useCallback(
    ({ rows = 3, cols = 3, withHeaderRow = true } = {}) => {
      editor?.chain().focus().insertTable({ rows, cols, withHeaderRow }).run()
    },
    [editor]
  )

  const insertImage = useCallback(
    ({ src, alt = '', title = '' }) => {
      if (!src) return
      editor?.chain().focus().setImage({ src, alt, title }).run()
    },
    [editor]
  )

  const setLink = useCallback(
    ({ href, target = '_blank' }) => {
      if (!href) {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href, target })
        .run()
    },
    [editor]
  )

  const unsetLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
  }, [editor])

  const undo = useCallback(() => {
    editor?.chain().focus().undo().run()
  }, [editor])

  const redo = useCallback(() => {
    editor?.chain().focus().redo().run()
  }, [editor])

  return {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrike,
    toggleCode,
    clearFormatting,
    setHeading,
    setTextAlign,
    toggleBulletList,
    toggleOrderedList,
    toggleBlockquote,
    insertDivider,
    insertPageBreak,
    insertTable,
    insertImage,
    setLink,
    unsetLink,
    undo,
    redo,
  }
}

export default useEditorCommands
