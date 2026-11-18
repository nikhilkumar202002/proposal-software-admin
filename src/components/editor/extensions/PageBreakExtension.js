import { Node, mergeAttributes } from '@tiptap/core'

export const PageBreakExtension = Node.create({
  name: 'pageBreak',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="page-break"]',
      },
      {
        tag: 'hr[data-type="page-break"]',
      },
      {
        tag: 'div.doc-page-break-node',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'page-break',
        class: 'doc-page-break-node my-4 py-2 border-y-2 border-dashed border-[#0055FF]/60 bg-blue-50/40 text-[#0055FF] font-semibold text-xs flex items-center justify-center gap-2 select-none cursor-pointer',
      }),
      ['span', { class: 'uppercase tracking-wider' }, '— Page Break (A4 Boundary) —'],
    ]
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name }).run()
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.setPageBreak(),
    }
  },
})

export default PageBreakExtension
