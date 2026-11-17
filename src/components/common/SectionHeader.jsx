import Breadcrumb from './Breadcrumb'

export const SectionHeader = ({
  title,
  description,
  breadcrumbs,
  children,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-3 mb-6 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className="mb-0.5" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {title && (
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {(action || children) && (
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            {action || children}
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionHeader
