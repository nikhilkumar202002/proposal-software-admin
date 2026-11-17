import { useState, useRef } from 'react'
import { Modal, Input, Button } from '@/components/common'
import { Image as ImageIcon, UploadCloud, Link as LinkIcon, X } from 'lucide-react'

export const ImageInsertModal = ({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
}) => {
  const [tab, setTab] = useState('url') // 'url' | 'upload'
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [title, setTitle] = useState('')
  const [previewSrc, setPreviewSrc] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, SVG, WebP).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image exceeds 5MB size limit.')
      return
    }

    setError('')
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      setPreviewSrc(result)
      setUrl(result)
      if (!alt) setAlt(file.name.replace(/\.[^/.]+$/, ''))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    const targetSrc = previewSrc || url.trim()
    if (!targetSrc) {
      setError('Please provide an image URL or choose a file.')
      return
    }

    onSubmit({
      src: targetSrc,
      alt: alt.trim(),
      title: title.trim(),
    })
    handleClose()
  }

  const handleClose = () => {
    setUrl('')
    setAlt('')
    setTitle('')
    setPreviewSrc('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Insert Document Image"
      description="Embed a diagram, architecture chart, or branding asset into the proposal."
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Insert Image
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Tab switch */}
        <div className="flex rounded-lg bg-gray-100 p-1 select-none">
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'url'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Image URL
          </button>
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'upload'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Local Image
          </button>
        </div>

        {tab === 'url' ? (
          <Input
            label="Image Web Address (URL)"
            placeholder="https://example.com/assets/diagram.png"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setPreviewSrc(e.target.value)
              if (error) setError('')
            }}
            leftIcon={ImageIcon}
            error={error}
          />
        ) : (
          <div>
            <span className="block text-xs font-semibold text-gray-700 mb-1.5">
              Choose File
            </span>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center bg-gray-50/50 hover:border-[#FB6C00] hover:bg-orange-50/20 transition-all cursor-pointer select-none"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="w-6 h-6 text-[#FB6C00] mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-gray-900">
                Click to browse an image
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                PNG, JPG, WebP or SVG up to 5MB
              </p>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
          </div>
        )}

        {/* Live Preview */}
        {previewSrc && (
          <div className="relative rounded-xl border border-gray-200 bg-gray-50/50 p-2 overflow-hidden flex items-center justify-center max-h-44">
            <img
              src={previewSrc}
              alt="Preview"
              onError={() => setError('Unable to load image from given source.')}
              className="max-h-40 rounded object-contain"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewSrc('')
                setUrl('')
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-900/60 text-white hover:bg-gray-900"
              title="Remove preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Alt Text (Accessibility)"
            placeholder="Architecture Diagram"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />

          <Input
            label="Caption / Title"
            placeholder="Figure 1.1 Infrastructure Map"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  )
}

export default ImageInsertModal
