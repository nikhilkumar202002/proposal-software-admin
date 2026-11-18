import { forwardRef } from 'react'

export const Textarea = forwardRef(function Textarea(
  {
    label,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    rows = 4,
    minRows,
    maxRows,
    maxLength,
    showCharacterCount = false,
    value,
    defaultValue,
    onChange,
    className = '',
    textareaClassName = '',
    id,
    ...props
  },
  ref
) {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  // Calculate character count
  const currentLength = typeof value === 'string' ? value.length : 0

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5 select-none">
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {(showCharacterCount || maxLength) && (
            <span className="text-[11px] text-gray-400">
              {currentLength}
              {maxLength ? ` / ${maxLength}` : ' characters'}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <textarea
          ref={ref}
          id={inputId(textareaId)}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          style={{
            minHeight: minRows ? `${minRows * 1.5}rem` : undefined,
            maxHeight: maxRows ? `${maxRows * 1.5}rem` : undefined,
          }}
          className={`w-full text-sm rounded-lg border bg-white p-3 transition-all text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed resize-y ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
              : 'border-gray-200 hover:border-gray-300 focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/15'
          } ${textareaClassName}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  )
})

function inputId(id) {
  return id
}

export default Textarea
