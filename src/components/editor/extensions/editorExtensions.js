import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import CharacterCount from '@tiptap/extension-character-count'
import PageBreakExtension from './PageBreakExtension'
import CustomBlockExtension from './CustomBlockExtension'

export function getEditorExtensions(options = {}) {
  const {
    placeholder = 'Start drafting your proposal content...',
    enablePageBreaks = true,
    enableCustomBlocks = true,
    enableTables = true,
  } = options

  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4],
      },
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-[#0055FF] underline font-medium hover:text-[#0044CC] cursor-pointer',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'rounded-xl max-w-full my-4 border border-gray-100 object-contain mx-auto',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph', 'table'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return `Heading ${node.attrs.level}...`
        }
        return placeholder
      },
    }),
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    CharacterCount,
  ]

  if (enableTables) {
    extensions.push(
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'doc-table border border-gray-200 rounded-lg overflow-hidden my-4',
        },
      }),
      TableRow,
      TableHeader,
      TableCell
    )
  }

  if (enablePageBreaks) {
    extensions.push(PageBreakExtension)
  }

  if (enableCustomBlocks) {
    extensions.push(CustomBlockExtension)
  }

  return extensions
}

export default getEditorExtensions
