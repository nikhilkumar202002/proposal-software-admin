import { useEffect } from 'react'
import { Activity, Zap, DollarSign } from 'lucide-react'
import useAIStore from '../../store/aiStore'

export const AIUsageIndicator = ({ className = '', compact = false }) => {
  const { usage, fetchUsage, isLoadingUsage } = useAIStore()

  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  const percentage = Math.min(
    100,
    Math.round(((usage.totalTokens || 0) / (usage.monthlyLimit || 500000)) * 100)
  )

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 text-[11px] text-gray-500 ${className}`}>
        <span className="flex items-center gap-1 font-semibold text-gray-700">
          <Zap className="w-3 h-3 text-[#0055FF]" />
          <span>{(usage.totalTokens || 0).toLocaleString()} tokens</span>
        </span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-600 font-mono">${(usage.totalCost || 0).toFixed(4)}</span>
      </div>
    )
  }

  return (
    <div
      className={`p-3 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-2 select-none ${className}`}
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <Activity className="w-3.5 h-3.5 text-[#0055FF]" />
          <span>AI Quota & Usage</span>
        </div>
        <span className="text-[11px] font-mono text-gray-500 font-semibold">
          {percentage}% Used
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-400 to-[#0055FF] h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5 font-mono">
        <span>{(usage.totalTokens || 0).toLocaleString()} / {(usage.monthlyLimit || 500000).toLocaleString()} tokens</span>
        <span className="font-semibold text-gray-700">${(usage.totalCost || 0).toFixed(4)}</span>
      </div>
    </div>
  )
}

export default AIUsageIndicator
