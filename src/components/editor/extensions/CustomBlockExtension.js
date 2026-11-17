import { Node, mergeAttributes } from '@tiptap/core'

export const CustomBlockExtension = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'info', // 'info' | 'success' | 'warning' | 'danger'
        parseHTML: (element) => element.getAttribute('data-callout-type') || 'info',
        renderHTML: (attributes) => ({
          'data-callout-type': attributes.type,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-callout-type]',
      },
      {
        tag: 'div.doc-callout',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const type = HTMLAttributes['data-callout-type'] || 'info'
    const colorClasses = {
      info: 'bg-blue-50/70 border-blue-200 text-blue-900',
      success: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
      warning: 'bg-amber-50/70 border-amber-200 text-amber-900',
      danger: 'bg-red-50/70 border-red-200 text-red-900',
    }[type] || 'bg-gray-50 border-gray-200 text-gray-900'

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: `doc-callout my-4 p-4 rounded-xl border-l-4 ${colorClasses}`,
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attributes)
        },
      toggleCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, attributes)
        },
    }
  },
})

export default CustomBlockExtension
