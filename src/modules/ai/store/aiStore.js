/**
 * ProposalOS AI Module - Global AI State Store (Zustand)
 * Manages active AI models, context awareness (selected client/proposal), and usage metrics.
 */

import { create } from 'zustand'
import { AI_MODELS } from '../utils/aiHelpers'
import { aiService as centralAIService } from '../../../services/ai.service'
import aiService from '../services/aiService'

export const useAIStore = create((set, get) => ({
  // Active Model & Provider Configuration
  selectedModelId: 'gpt-4o',
  models: AI_MODELS,
  activeProvider: 'openai',
  providers: [],

  // Aliases for selector components
  get selectedModel() {
    return get().getSelectedModel?.() || get().models[0]
  },

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
  isLoadingModels: false,
  isLoadingProviders: false,
  error: null,

  // Actions
  setModelId: (modelId) => {
    set({ selectedModelId: modelId })
  },

  setModel: (modelId) => {
    set({ selectedModelId: modelId })
  },

  setProvider: async (provider) => {
    set({ activeProvider: provider })
    try {
      await centralAIService.updateProvider({ provider })
    } catch (err) {
      console.warn('Backend updateProvider failed, keeping local state:', err.message)
    }
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

  fetchModels: async () => {
    set({ isLoadingModels: true })
    try {
      const res = await centralAIService.getModels()
      if (Array.isArray(res.data) && res.data.length > 0) {
        set({
          models: res.data,
          activeProvider: res.active_provider || get().activeProvider,
          isLoadingModels: false,
        })
      } else {
        set({ isLoadingModels: false })
      }
    } catch (err) {
      set({ isLoadingModels: false })
    }
  },

  fetchProviders: async () => {
    set({ isLoadingProviders: true })
    try {
      const res = await centralAIService.getProviders()
      if (Array.isArray(res.providers) && res.providers.length > 0) {
        set({
          providers: res.providers,
          activeProvider: res.active_provider || get().activeProvider,
          isLoadingProviders: false,
        })
      } else {
        set({ isLoadingProviders: false })
      }
    } catch (err) {
      set({ isLoadingProviders: false })
    }
  },

  fetchUsage: async () => {
    set({ isLoadingUsage: true, error: null })
    try {
      const data = await centralAIService.getUsage()
      if (data && (data.totalRequests !== undefined || data.totalTokens !== undefined)) {
        set({ usage: data, isLoadingUsage: false })
      } else {
        const localData = await aiService.getUsageMetrics()
        set({ usage: localData, isLoadingUsage: false })
      }
    } catch {
      const localData = await aiService.getUsageMetrics()
      set({ usage: localData, isLoadingUsage: false })
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))

export default useAIStore
