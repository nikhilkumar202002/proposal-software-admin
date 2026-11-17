import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  change,
  trend = 'up', // 'up' | 'down' | 'neutral'
  description,
  className = '',
}) => {
  const trendConfig = {
    up: {
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 text-emerald-700',
    },
    down: {
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50 text-red-700',
    },
    neutral: {
      icon: Minus,
      color: 'text-gray-500',
      bg: 'bg-gray-100 text-gray-700',
    },
  }

  const currentTrend = trendConfig[trend] || trendConfig.neutral
  const TrendIcon = currentTrend.icon

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </span>

        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FB6C00] flex items-center justify-center shrink-0 shadow-2xs">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {change && (
            <div className={`inline-flex items-center gap-1 text-xs font-medium ${currentTrend.color}`}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{change}</span>
            </div>
          )}

          {description && (
            <span className="text-xs text-gray-400">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsCard
