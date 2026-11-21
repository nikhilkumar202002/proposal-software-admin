/**
 * ProposalOS AI Module - General AI Service & Usage Tracker
 * Interacts with Laravel API endpoints or falls back to local storage and mock telemetry.
 */

import api from '../../../services/api'
import { calculateEstimatedCost, estimateTokens } from '../utils/aiHelpers'

const USAGE_STORAGE_KEY = 'proposalos_ai_usage_logs'

export const aiService = {
  /**
   * Fetch cumulative AI usage metrics
   * GET /api/ai/usage
   */
  getUsageMetrics: async () => {
    try {
      const response = await api.get('/ai/usage')
      return response.data
    } catch {
      // Fallback to local storage usage logs
      const raw = localStorage.getItem(USAGE_STORAGE_KEY)
      const logs = raw ? JSON.parse(raw) : []

      const totalRequests = logs.length
      const totalTokens = logs.reduce((acc, l) => acc + (l.totalTokens || 0), 0)
      const totalCost = logs.reduce((acc, l) => acc + (l.cost || 0), 0)

      return {
        totalRequests,
        totalTokens,
        totalCost: Number(totalCost.toFixed(4)),
        monthlyLimit: 500000,
        recentLogs: logs.slice(-10).reverse(),
      }
    }
  },

  /**
   * Record an AI request log locally or to backend
   */
  logUsage: async ({ modelId, prompt, responseText, actionType }) => {
    const inputTokens = estimateTokens(prompt)
    const outputTokens = estimateTokens(responseText)
    const totalTokens = inputTokens + outputTokens
    const cost = calculateEstimatedCost(inputTokens, outputTokens, modelId)

    const logEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      modelId,
      actionType: actionType || 'chat',
      inputTokens,
      outputTokens,
      totalTokens,
      cost,
    }

    try {
      const raw = localStorage.getItem(USAGE_STORAGE_KEY)
      const logs = raw ? JSON.parse(raw) : []
      logs.push(logEntry)
      // Keep up to 200 recent logs
      if (logs.length > 200) logs.shift()
      localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(logs))
    } catch {
      // Ignore localStorage errors
    }

    return logEntry
  },
}

export default aiService
