import { useRef, useState } from 'react'
import { Upload, Trash2, RotateCcw, Image } from 'lucide-react'
import logoDefault from '../../../assets/Domine-Dude_black.png'

export const CompanyLogoUpload = ({
  logoUrl = '',
  onUpload = () => {},
  onRemove = () => {},
  disabled = false,
  className = '',
}) => {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const handleFileChange = async (file) => {
    if (!file) return
    setUploadError(null)

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size exceeds 2MB limit.')
      return
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('File must be an image (PNG, JPG, SVG, or WEBP).')
      return
    }

    try {
      await onUpload(file)
    } catch (err) {
      setUploadError(err.message || 'Failed to process image')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileChange(file)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Logo Preview Card */}
        <div className="relative w-44 h-24 rounded-xl border border-gray-200 bg-gray-50/60 p-3 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs group">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company Logo Preview"
              className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 gap-1">
              <Image className="w-8 h-8 stroke-[1.5]" />
              <span className="text-[11px] font-medium">No Logo Uploaded</span>
            </div>
          )}
        </div>

        {/* Upload Drop Zone & Actions */}
        <div className="flex-1 w-full space-y-2.5">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#0055FF] bg-blue-50/50'
                : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              disabled={disabled}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-700">
              <Upload className="w-4 h-4 text-[#0055FF]" />
              <span>Click to upload or drag & drop</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              PNG, JPG, SVG, or WEBP (Transparent background recommended, Max 2MB)
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {logoUrl && (
              <button
                type="button"
                onClick={() => onRemove()}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Logo</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onUpload(logoDefault)}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          </div>

          {uploadError && (
            <p className="text-xs text-red-600 font-medium">{uploadError}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyLogoUpload
