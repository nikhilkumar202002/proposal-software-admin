import { useState } from 'react'
import { Modal, Input, Button } from '@/components/common'
import { Link2, Trash2 } from 'lucide-react'

const LinkInsertModalContent = ({
  onClose,
  onSubmit,
  onRemove,
  initialUrl = '',
  initialText = '',
}) => {
  const [url, setUrl] = useState(initialUrl || '')
  const [text, setText] = useState(initialText || '')
  const [openInNewTab, setOpenInNewTab] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!url.trim()) {
      setError('Please provide a valid web address or link.')
      return
    }

    let formattedUrl = url.trim()
    if (
      !/^https?:\/\//i.test(formattedUrl) &&
      !formattedUrl.startsWith('/') &&
      !formattedUrl.startsWith('#')
    ) {
      formattedUrl = `https://${formattedUrl}`
    }

    onSubmit({
      href: formattedUrl,
      text: text.trim() || formattedUrl,
      target: openInNewTab ? '_blank' : '_self',
    })
    onClose()
  }

  const handleRemove = () => {
    onRemove()
    onClose()
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={initialUrl ? 'Edit Hyperlink' : 'Insert Hyperlink'}
      description="Add a destination URL for your selected text or create a new link."
      size="sm"
      footer={
        <div className="flex items-center justify-between w-full">
          {initialUrl ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              leftIcon={Trash2}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
            >
              Remove Link
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              {initialUrl ? 'Update' : 'Insert Link'}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Link Target (URL)"
          placeholder="https://example.com/agreement.pdf"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (error) setError('')
          }}
          leftIcon={Link2}
          error={error}
          required
          autoFocus
        />

        <Input
          label="Display Text (Optional)"
          placeholder="e.g. View Master Terms & Conditions"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex items-center gap-2 pt-1 select-none">
          <input
            id="open-in-new-tab"
            type="checkbox"
            checked={openInNewTab}
            onChange={(e) => setOpenInNewTab(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#0055FF] focus:ring-[#0055FF] cursor-pointer"
          />
          <label
            htmlFor="open-in-new-tab"
            className="text-xs font-medium text-gray-700 cursor-pointer"
          >
            Open link in new browser tab
          </label>
        </div>
      </form>
    </Modal>
  )
}

export const LinkInsertModal = ({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  onRemove = () => {},
  initialUrl = '',
  initialText = '',
}) => {
  if (!isOpen) return null

  return (
    <LinkInsertModalContent
      onClose={onClose}
      onSubmit={onSubmit}
      onRemove={onRemove}
      initialUrl={initialUrl}
      initialText={initialText}
    />
  )
}

export default LinkInsertModal
