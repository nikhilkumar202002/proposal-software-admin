import { useState, useRef } from 'react'
import { UploadCloud, File, X, CheckCircle2, AlertCircle } from 'lucide-react'

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const FileUpload = ({
  label,
  accept,
  maxSize = 10, // in MB
  multiple = false,
  files = [],
  onFilesChange = () => {},
  uploading = false,
  progress = 0,
  error: customError,
  helperText = 'PDF, DOCX, PNG, JPG up to 10MB',
  disabled = false,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [internalError, setInternalError] = useState('')
  const inputRef = useRef(null)

  const maxSizeBytes = maxSize * 1024 * 1024

  const handleFiles = (incomingFileList) => {
    setInternalError('')
    const incoming = Array.from(incomingFileList)

    // Validate size
    for (const f of incoming) {
      if (f.size > maxSizeBytes) {
        setInternalError(`File "${f.name}" exceeds the maximum allowed size of ${maxSize}MB.`)
        return
      }
    }

    if (multiple) {
      onFilesChange([...files, ...incoming])
    } else {
      onFilesChange(incoming.slice(0, 1))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemove = (index, e) => {
    e.stopPropagation()
    const updated = files.filter((_, i) => i !== index)
    onFilesChange(updated)
  }

  const error = customError || internalError

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {label && (
        <span className="block text-xs font-semibold text-gray-700 mb-1.5 select-none">
          {label}
        </span>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer select-none ${
          disabled
            ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
            : isDragOver
            ? 'border-[#0055FF] bg-blue-50/50'
            : error
            ? 'border-red-300 bg-red-50/20 hover:border-red-400'
            : 'border-gray-200 bg-white hover:border-[#0055FF]/60 hover:bg-blue-50/20'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0055FF] flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6 stroke-[2]" />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-gray-900">
            <span className="text-[#0055FF] hover:underline">Click to upload</span> or drag and drop
          </p>

          <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>
        </div>

        {/* Progress Bar when uploading */}
        {uploading && (
          <div className="mt-4 w-full">
            <div className="flex justify-between text-[11px] font-medium text-gray-600 mb-1">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#0055FF] h-1.5 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File List Preview */}
      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
          {files.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-2.5 px-3 hover:bg-gray-50/80 transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <File className="w-4 h-4 text-[#0055FF] shrink-0" />
                <div className="truncate">
                  <p className="font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-400">{formatBytes(file.size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <button
                  type="button"
                  onClick={(e) => handleRemove(idx, e)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FileUpload
