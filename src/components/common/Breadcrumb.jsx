import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export const Breadcrumb = ({
  items = [],
  showHome = true,
  homeHref = '/',
  separator: Separator = ChevronRight,
  className = '',
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs select-none ${className}`}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {showHome && (
          <li className="flex items-center">
            <Link
              to={homeHref}
              className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100/70 transition-colors"
              title="Home"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const target = item.to || item.href

          return (
            <li key={item.label || index} className="flex items-center gap-1.5">
              {(showHome || index > 0) && (
                <Separator className="w-3 h-3 text-gray-300 shrink-0" />
              )}

              {isLast || !target ? (
                <span
                  className="font-medium text-gray-900 truncate max-w-[200px]"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={target}
                  className="font-medium text-gray-500 hover:text-gray-900 transition-colors truncate max-w-[160px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
