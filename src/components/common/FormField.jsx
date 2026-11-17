export const FormField = ({
  label,
  required = false,
  error,
  helperText,
  id,
  children,
  className = '',
}) => {
  return (
    <div className={`w-full flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-gray-700 mb-1.5 select-none"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  )
}

export default FormField
