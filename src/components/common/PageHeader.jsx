import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export const PageHeader = ({
  title,
  subtitle,
  onBack,
  backTo,
  badge,
  actions,
  children,
  className = '',
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backTo) {
      navigate(backTo)
    } else {
      navigate(-1)
    }
  }

  const showBackButton = Boolean(onBack || backTo)

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 mb-6 border-b border-gray-200/80 ${className}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {(actions || children) && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {actions || children}
        </div>
      )}
    </div>
  )
}

export default PageHeader
