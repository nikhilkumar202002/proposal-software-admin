import { api, API_BASE_URL, ensureAuthenticated } from './api.js'

/**
 * Normalizes an individual chat message from backend schema
 * @param {Object} raw
 * @returns {Object|null}
 */
export function normalizeMessage(raw) {
  if (!raw || typeof raw !== 'object') return null
  const text = raw.text || raw.content || raw.message || ''
  const sender = raw.sender || (raw.role === 'assistant' ? 'assistant' : 'user')
  const role = raw.role || (sender === 'user' ? 'user' : 'assistant')

  return {
    id: raw.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    sender,
    role,
    text,
    content: text,
    modelId: raw.modelId || raw.model_id || 'gpt-4o',
    tokensUsed: raw.tokensUsed ?? raw.tokens_used ?? null,
    cost: Number(raw.cost ?? 0),
    metadata: raw.metadata || null,
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
    created_at: raw.createdAt || raw.created_at || new Date().toISOString(),
  }
}

/**
 * Normalizes an AI conversation record from backend schema
 * @param {Object} raw
 * @returns {Object|null}
 */
export function normalizeConversation(raw) {
  if (!raw || typeof raw !== 'object') return null
  const rawMessages = Array.isArray(raw.messages) ? raw.messages : []

  return {
    id: raw.id || `conv-${raw.db_id || Date.now()}`,
    db_id: raw.db_id ?? raw.id ?? null,
    dbId: raw.db_id ?? raw.id ?? null,
    title: raw.title || 'Untitled Proposal Discussion',
    modelId: raw.modelId || raw.model_id || 'gpt-4o',
    model_id: raw.modelId || raw.model_id || 'gpt-4o',
    provider: raw.provider || 'openai',
    context: raw.context || {},
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
    created_at: raw.createdAt || raw.created_at || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.updated_at || new Date().toISOString(),
    updated_at: raw.updatedAt || raw.updated_at || new Date().toISOString(),
    messages: rawMessages.map(normalizeMessage).filter(Boolean),
  }
}

/**
 * ProposalOS AI API Services
 * Implements complete backend endpoint matrix for AI chat, proposal synthesis, pricing, and provider management.
 */
export const aiService = {
  /**
   * GET /ai/conversations
   * Fetch all AI chat conversations
   * @param {Object} [params={}]
   * @returns {Promise<Array>}
   */
  async getConversations(params = {}) {
    const response = await api.get('/ai/conversations', { params })
    const resData = response.data || {}
    const list = Array.isArray(resData.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : []
    return list.map(normalizeConversation).filter(Boolean)
  },

  /**
   * GET /ai/conversations/:id
   * Fetch a single conversation with messages
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async getConversation(id) {
    const response = await api.get(`/ai/conversations/${id}`)
    const resData = response.data || {}
    const raw = resData.data || resData.conversation || resData
    return normalizeConversation(raw)
  },

  /**
   * POST /ai/conversations
   * Create a new conversation thread
   * @param {Object} data - { title, modelId, provider, context }
   * @returns {Promise<Object>}
   */
  async createConversation(data = {}) {
    const payload = {
      title: data.title || 'New Proposal Discussion',
      modelId: data.modelId || data.model_id || 'gpt-4o',
      provider: data.provider || 'openai',
      context: data.context || {},
    }
    const response = await api.post('/ai/conversations', payload)
    const resData = response.data || {}
    const raw = resData.data || resData.conversation || resData
    return normalizeConversation(raw)
  },

  /**
   * PATCH /ai/conversations/:id
   * Update conversation title, model, or context
   * @param {string|number} id
   * @param {Object} data - { title, modelId, context }
   * @returns {Promise<Object>}
   */
  async updateConversation(id, data = {}) {
    const payload = {}
    if (data.title !== undefined) payload.title = data.title
    if (data.modelId !== undefined || data.model_id !== undefined) {
      payload.modelId = data.modelId || data.model_id
    }
    if (data.context !== undefined) payload.context = data.context

    const response = await api.patch(`/ai/conversations/${id}`, payload)
    const resData = response.data || {}
    const raw = resData.data || resData.conversation || resData
    return normalizeConversation(raw)
  },

  /**
   * DELETE /ai/conversations/:id
   * Remove a conversation thread
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async deleteConversation(id) {
    const response = await api.delete(`/ai/conversations/${id}`)
    return response.data
  },

  /**
   * POST /ai/chat
   * Standard synchronous chat message generation
   * @param {Object} data - { message, conversationId, modelId, provider, context }
   * @returns {Promise<Object>}
   */
  async sendMessage(data = {}) {
    const payload = {
      message: data.message || data.text || '',
      conversationId: data.conversationId || data.conversation_id || null,
      modelId: data.modelId || data.model_id || 'gpt-4o',
      provider: data.provider || 'openai',
      context: data.context || {},
    }
    const response = await api.post('/ai/chat', payload)
    const resData = response.data || {}
    const replyText =
      resData.data?.reply ||
      resData.data?.message ||
      resData.data?.text ||
      resData.reply ||
      resData.message ||
      resData.text ||
      ''

    return {
      reply: replyText,
      text: replyText,
      modelId: resData.data?.modelId || resData.modelId || payload.modelId,
      provider: resData.data?.provider || resData.provider || payload.provider,
      tokensUsed: resData.data?.tokensUsed || resData.tokensUsed || null,
      cost: resData.data?.cost ?? resData.cost ?? 0,
      conversationId: payload.conversationId,
      raw: resData,
    }
  },

  /**
   * POST /ai/chat/stream
   * Stream interactive AI chat completion via Server-Sent Events / ReadableStream
   * @param {Object} data - { message, conversationId, modelId, provider, context }
   * @param {Object} [callbacks] - { onChunk, onComplete, onError, signal }
   * @returns {Promise<string>}
   */
  async streamChat(data = {}, { onChunk = () => {}, onComplete = () => {}, onError = () => {}, signal } = {}) {
    const payload = {
      message: data.message || data.text || '',
      conversationId: data.conversationId || data.conversation_id || null,
      modelId: data.modelId || data.model_id || 'gpt-4o',
      provider: data.provider || 'openai',
      context: data.context || {},
    }

    try {
      const token =
        (typeof localStorage !== 'undefined' &&
          (localStorage.getItem('proposalos_token') ||
            localStorage.getItem('token') ||
            localStorage.getItem('access_token'))) ||
        (await ensureAuthenticated().catch(() => null))

      const headers = {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream, application/json, text/plain',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const streamUrl = `${API_BASE_URL}/ai/chat/stream`
      const response = await fetch(streamUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal,
      })

      if (!response.ok) {
        throw new Error(`Stream request failed with status: ${response.status}`)
      }

      // If response is not a stream (e.g. server returned json directly), handle gracefully
      const contentType = response.headers.get('content-type') || ''
      if (!response.body || contentType.includes('application/json')) {
        const json = await response.json()
        const text = json.data?.reply || json.reply || json.text || ''
        onChunk(text)
        onComplete(text)
        return text
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let accumulatedText = ''
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith(':')) continue

          if (trimmed.startsWith('data:')) {
            const dataStr = trimmed.replace(/^data:\s*/, '')
            if (dataStr === '[DONE]') continue

            try {
              const parsed = JSON.parse(dataStr)
              const chunk =
                parsed.chunk ||
                parsed.text ||
                parsed.delta?.content ||
                parsed.reply ||
                ''
              if (chunk) {
                accumulatedText += chunk
                onChunk(accumulatedText, chunk)
              }
            } catch {
              // Raw text chunk
              accumulatedText += dataStr
              onChunk(accumulatedText, dataStr)
            }
          } else {
            // Non-SSE chunk stream
            accumulatedText += trimmed
            onChunk(accumulatedText, trimmed)
          }
        }
      }

      if (buffer.trim()) {
        accumulatedText += buffer.trim()
        onChunk(accumulatedText, buffer.trim())
      }

      onComplete(accumulatedText)
      return accumulatedText
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err
      }
      // Graceful fallback to standard sendMessage if stream endpoint is unavailable
      try {
        const res = await aiService.sendMessage(data)
        const full = res.reply || res.text || ''
        onChunk(full, full)
        onComplete(full)
        return full
      } catch (fallbackErr) {
        onError(fallbackErr)
        throw fallbackErr
      }
    }
  },

  /**
   * POST /ai/generate-proposal
   * Generate structured proposal (supports synchronous generation & asynchronous background jobs)
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async generateProposal(data = {}) {
    const payload = {
      title: data.title || 'Enterprise Commercial Proposal',
      prompt: data.prompt || data.requirements || '',
      client: data.client || null,
      serviceType: data.serviceType || data.service_type || null,
      budget: data.budget ? Number(data.budget) : undefined,
      timeline: data.timeline || undefined,
      currency: data.currency || 'USD',
      proposalType: data.proposalType || data.proposal_type || 'direct',
      modelId: data.modelId || data.model_id || 'gpt-4o',
      industry: data.industry || undefined,
      async: Boolean(data.async),
    }

    const response = await api.post('/ai/generate-proposal', payload)
    const resData = response.data || {}
    return resData.data || resData
  },

  /**
   * POST /ai/regenerate-section
   * Regenerate specific proposal section with focused prompt & context
   * @param {Object} data - { section, context, prompt, proposal_title, modelId }
   * @returns {Promise<Object>}
   */
  async regenerateSection(data = {}) {
    const payload = {
      section: data.section,
      context: data.context || '',
      prompt: data.prompt || '',
      proposal_title: data.proposal_title || data.proposalTitle || '',
      modelId: data.modelId || data.model_id || 'gpt-4o',
    }

    const response = await api.post('/ai/regenerate-section', payload)
    const resData = response.data || {}
    const content =
      resData.data?.content ||
      resData.content ||
      resData.data?.text ||
      resData.text ||
      ''
    return {
      content,
      data: resData.data || resData,
    }
  },

  /**
   * POST /proposals/calculate-pricing
   * Calculate financial breakdown and taxes via backend ProposalPricingService
   * @param {Object} data - { items, discount_type, discount_value, additional_charges }
   * @returns {Promise<Object>}
   */
  async calculatePricing(data = {}) {
    const payload = {
      items: (data.items || []).map((it) => ({
        description: it.description || '',
        quantity: Number(it.quantity ?? 1),
        unit: it.unit || 'Milestone',
        unit_price: Number(it.unit_price ?? it.unitPrice ?? 0),
        discount_type: it.discount_type || it.discountType || null,
        discount_value: Number(it.discount_value ?? it.discountValue ?? 0),
        tax_rate: Number(it.tax_rate ?? it.taxRate ?? it.tax ?? 18),
      })),
      discount_type: data.discount_type || data.discountType || null,
      discount_value: Number(data.discount_value ?? data.discountValue ?? 0),
      additional_charges: Number(data.additional_charges ?? data.additionalCharges ?? 0),
    }

    const response = await api.post('/proposals/calculate-pricing', payload)
    const resData = response.data || {}
    return resData.data || resData
  },

  /**
   * POST /ai/improve-content
   * Improve tone, impact, or clarity of proposal text
   * @param {Object} data - { content, tone }
   * @returns {Promise<Object>}
   */
  async improveContent(data = {}) {
    const payload = {
      content: data.content || '',
      tone: data.tone || data.goal || 'executive',
    }

    const response = await api.post('/ai/improve-content', payload)
    const resData = response.data || {}
    return resData.data || resData
  },

  /**
   * GET /ai/jobs/:uuid
   * Query asynchronous background job status
   * @param {string} uuid
   * @returns {Promise<Object>}
   */
  async getJobStatus(uuid) {
    const response = await api.get(`/ai/jobs/${uuid}`)
    return response.data || {}
  },

  /**
   * Poll asynchronous job status until finished
   * @param {string} uuid
   * @param {Object} [options]
   * @returns {Promise<Object>}
   */
  async pollJob(uuid, { intervalMs = 1500, maxAttempts = 40 } = {}) {
    let attempts = 0
    while (attempts < maxAttempts) {
      attempts += 1
      const res = await this.getJobStatus(uuid)
      const jobData = res.data || res
      const status = (jobData.status || '').toLowerCase()

      if (status === 'completed' || status === 'done' || status === 'success') {
        return jobData
      }
      if (status === 'failed' || status === 'error') {
        throw new Error(jobData.error_message || 'Asynchronous AI job execution failed.')
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
    throw new Error('AI job status query timed out.')
  },

  /**
   * GET /ai/usage
   * Retrieve total requests, tokens, costs, and recent telemetry
   * @returns {Promise<Object>}
   */
  async getUsage() {
    const response = await api.get('/ai/usage')
    return response.data || {}
  },

  /**
   * GET /ai/models
   * Fetch active provider model registry with pricing and context windows
   * @returns {Promise<Object>}
   */
  async getModels() {
    const response = await api.get('/ai/models')
    return response.data || {}
  },

  /**
   * GET /ai/providers
   * List configured foundation model providers
   * @returns {Promise<Object>}
   */
  async getProviders() {
    const response = await api.get('/ai/providers')
    return response.data || {}
  },

  /**
   * PUT /ai/providers
   * Switch active foundation model provider
   * @param {Object} data - { provider }
   * @returns {Promise<Object>}
   */
  async updateProvider(data = {}) {
    const payload = {
      provider: data.provider || 'openai',
    }
    const response = await api.put('/ai/providers', payload)
    return response.data || {}
  },
}

export const {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  sendMessage,
  streamChat,
  generateProposal,
  regenerateSection,
  calculatePricing,
  improveContent,
  getJobStatus,
  pollJob,
  getUsage,
  getModels,
  getProviders,
  updateProvider,
} = aiService

export default aiService
