/**
 * ProposalOS AI Module - Global AI State Store (Zustand)
 * Manages active AI models, context awareness (selected client/proposal), and usage metrics.
 */

import { create } from 'zustand'
import { AI_MODELS } from '../utils/aiHelpers'
import aiService from '../services/aiService'

export const useAIStore = create((set, get) => ({
  // Active Model Configuration
  selectedModelId: 'gpt-4o',
  models: AI_MODELS,

  // Selected Context for Context Awareness
  context: {
    selectedClientId: null,
    selectedClient: null,
    selectedProposalId: null,
    selectedProposal: null,
    includeCompanyDetails: true,
  },

  // Usage Telemetry
  usage: {
    totalRequests: 0,
    totalTokens: 0,
    totalCost: 0,
    monthlyLimit: 500000,
    recentLogs: [],
  },

  isLoadingUsage: false,
  error: null,

  // Actions
  setModelId: (modelId) => {
    set({ selectedModelId: modelId })
  },

  getSelectedModel: () => {
    const id = get().selectedModelId
    return get().models.find((m) => m.id === id) || get().models[0]
  },

  setContext: (updates) => {
    set((state) => ({
      context: {
        ...state.context,
        ...updates,
      },
    }))
  },

  clearContext: () => {
    set({
      context: {
        selectedClientId: null,
        selectedClient: null,
        selectedProposalId: null,
        selectedProposal: null,
        includeCompanyDetails: true,
      },
    })
  },

  fetchUsage: async () => {
    set({ isLoadingUsage: true, error: null })
    try {
      const data = await aiService.getUsageMetrics()
      set({ usage: data, isLoadingUsage: false })
    } catch (err) {
      set({ error: err.message, isLoadingUsage: false })
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))

export default useAIStore
