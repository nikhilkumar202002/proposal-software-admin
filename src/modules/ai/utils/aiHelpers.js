/**
 * ProposalOS AI Module - General AI Helpers & Model Configurations
 * Brand: ProposalOS (Primary Color: #FB6C00)
 */

export const BRAND_CONFIG = {
  name: 'ProposalOS',
  primaryColor: '#FB6C00',
  secondaryColor: '#E05D00',
  accentColor: '#FF8833',
}

export const AI_MODELS = [
  {
    id: 'gpt-4o',
    name: 'ProposalOS 4o',
    provider: 'openai',
    contextWindow: 128000,
    costPer1kInput: 0.005,
    costPer1kOutput: 0.015,
    recommendedFor: 'Complete proposal drafting, C-level executive summaries & complex pricing',
    badge: 'Recommended',
    isDefault: true,
  },
  {
    id: 'o3-mini',
    name: 'o3-mini (High Reasoning)',
    provider: 'openai',
    contextWindow: 200000,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.012,
    recommendedFor: 'Mathematical pricing calculations, deliverable breakdowns & contract logic',
    badge: 'Reasoning',
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    contextWindow: 200000,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    recommendedFor: 'Persuasive sales copywriting, nuanced technical scope & legal clarity',
    badge: 'Writing',
  },
  {
    id: 'gemini-2-5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    contextWindow: 1000000,
    costPer1kInput: 0.0005,
    costPer1kOutput: 0.0015,
    recommendedFor: 'Rapid summarization, quick section improvements & translations',
    badge: 'Fast',
  },
]

export const AI_ACTION_TYPES = {
  GENERATE_COMPLETE: 'generate_complete_proposal',
  EXECUTIVE_SUMMARY: 'generate_executive_summary',
  SCOPE_OF_WORK: 'generate_scope_of_work',
  DELIVERABLES: 'generate_deliverables',
  PROJECT_TIMELINE: 'generate_project_timeline',
  SUGGEST_PRICING: 'suggest_pricing',
  PAYMENT_MILESTONES: 'generate_payment_milestones',
  IMPROVE_CONTENT: 'improve_proposal_content',
  EXPAND_CONTENT: 'expand_content',
  SUMMARIZE_CONTENT: 'summarize_content',
  TRANSLATE_CONTENT: 'translate_content',
  REVIEW_PROPOSAL: 'review_existing_proposal',
  SUGGEST_IMPROVEMENTS: 'suggest_proposal_improvements',
}

/**
 * Estimate token count from raw text string
 */
export function estimateTokens(text = '') {
  if (!text) return 0
  // Approximately 4 characters per token in English text
  return Math.ceil(text.length / 4)
}

/**
 * Estimate cost in USD from token counts and model config
 */
export function calculateEstimatedCost(inputTokens = 0, outputTokens = 0, modelId = 'gpt-4o') {
  const model = AI_MODELS.find((m) => m.id === modelId) || AI_MODELS[0]
  const inputCost = (inputTokens / 1000) * model.costPer1kInput
  const outputCost = (outputTokens / 1000) * model.costPer1kOutput
  return Number((inputCost + outputCost).toFixed(5))
}

/**
 * Format timestamp into relative display text ("Just now", "Today", "Yesterday", etc.)
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Just now'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

/**
 * Clean and truncate title for conversation display
 */
export function generateConversationTitle(query = '') {
  if (!query) return 'New Conversation'
  const cleaned = query.replace(/[#*`_]/g, '').trim()
  return cleaned.length > 36 ? `${cleaned.slice(0, 36)}...` : cleaned
}
