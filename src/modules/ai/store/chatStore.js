/**
 * ProposalOS AI Module - Chat Store (Zustand)
 * Manages conversation list, active thread, messages, streaming status, and editing state.
 */

import { create } from 'zustand'
import chatService from '../services/chatService'
import { generateConversationTitle } from '../utils/aiHelpers'

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  searchQuery: '',

  // Streaming & Loading
  isGenerating: false,
  streamedText: '',
  abortController: null,

  // Editing state
  editingMessageId: null,

  // UI state
  isSidebarOpen: true,
  isLoading: false,
  error: null,

  // Fetch initial conversations
  loadConversations: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await chatService.getConversations()
      const list = Array.isArray(data) ? data : []
      const activeId = get().activeConversationId || list[0]?.id || null

      set({
        conversations: list,
        activeConversationId: activeId,
        isLoading: false,
      })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  setActiveConversationId: (id) => {
    set({ activeConversationId: id, editingMessageId: null, streamedText: '' })
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
  },

  // Create new conversation
  createNewConversation: async (title = 'New Proposal Chat', modelId = 'gpt-4o') => {
    try {
      const newConv = await chatService.createConversation({ title, modelId })
      set((state) => ({
        conversations: [newConv, ...state.conversations],
        activeConversationId: newConv.id,
        editingMessageId: null,
      }))
      return newConv
    } catch (err) {
      set({ error: err.message })
    }
  },

  // Rename conversation
  renameConversation: async (id, newTitle) => {
    try {
      await chatService.updateConversation(id, { title: newTitle })
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c
        ),
      }))
    } catch (err) {
      set({ error: err.message })
    }
  },

  // Delete conversation
  deleteConversation: async (id) => {
    try {
      await chatService.deleteConversation(id)
      const filtered = get().conversations.filter((c) => c.id !== id)
      let nextActiveId = get().activeConversationId

      if (nextActiveId === id) {
        nextActiveId = filtered[0]?.id || null
      }

      set({
        conversations: filtered,
        activeConversationId: nextActiveId,
      })

      if (filtered.length === 0) {
        get().createNewConversation()
      }
    } catch (err) {
      set({ error: err.message })
    }
  },

  // Send a message & trigger AI generation (with real-time streaming)
  sendMessage: async ({ text, context = null, modelId = 'gpt-4o', provider = 'openai' }) => {
    if (!text || !text.trim()) return

    const trimmed = text.trim()
    let convId = get().activeConversationId

    // Ensure we have an active conversation
    if (!convId) {
      const newConv = await get().createNewConversation(
        generateConversationTitle(trimmed),
        modelId,
        provider,
        context
      )
      convId = newConv.id
    }

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      modelId,
      createdAt: new Date().toISOString(),
    }

    // Add user message to state immediately
    set((state) => {
      const convList = state.conversations.map((c) => {
        if (c.id === convId) {
          const currentMsgs = c.messages || []
          const shouldUpdateTitle = currentMsgs.length === 0
          return {
            ...c,
            title: shouldUpdateTitle ? generateConversationTitle(trimmed) : c.title,
            messages: [...currentMsgs, userMessage],
            updatedAt: new Date().toISOString(),
          }
        }
        return c
      })
      return { conversations: convList, isGenerating: true, streamedText: '', error: null }
    })

    // Setup AbortController for cancel generation
    const controller = new AbortController()
    set({ abortController: controller })

    try {
      await chatService.streamChat({
        conversationId: convId,
        message: trimmed,
        context,
        modelId,
        provider,
        signal: controller.signal,
        onChunk: (accumulated) => {
          set({ streamedText: accumulated })
        },
        onComplete: (fullText) => {
          const aiMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: fullText,
            modelId,
            createdAt: new Date().toISOString(),
          }

          set((state) => {
            const convList = state.conversations.map((c) => {
              if (c.id === convId) {
                return {
                  ...c,
                  messages: [...(c.messages || []), aiMessage],
                  updatedAt: new Date().toISOString(),
                }
              }
              return c
            })
            return {
              conversations: convList,
              isGenerating: false,
              streamedText: '',
              abortController: null,
            }
          })
        },
        onError: (streamErr) => {
          console.warn('Stream failed, handling error:', streamErr.message)
        },
      })
    } catch (err) {
      if (err.name === 'AbortError') {
        // If aborted while streaming, keep what was generated so far
        const partial = get().streamedText
        if (partial) {
          const partialMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: partial,
            modelId,
            createdAt: new Date().toISOString(),
          }
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === convId
                ? { ...c, messages: [...(c.messages || []), partialMessage] }
                : c
            ),
            isGenerating: false,
            streamedText: '',
            abortController: null,
          }))
        } else {
          set({ isGenerating: false, streamedText: '', abortController: null })
        }
      } else {
        set({ error: err.message, isGenerating: false, streamedText: '', abortController: null })
      }
    }
  },

  // Stop Generation
  stopGeneration: () => {
    const controller = get().abortController
    if (controller) {
      controller.abort()
      set({ isGenerating: false, abortController: null })
    }
  },

  // Regenerate last response
  regenerateResponse: async (context = null, modelId = 'gpt-4o') => {
    const activeConv = get().conversations.find((c) => c.id === get().activeConversationId)
    if (!activeConv || !activeConv.messages?.length) return

    // Find last user message
    const msgs = [...activeConv.messages]
    let lastUserMsg = null
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].sender === 'user') {
        lastUserMsg = msgs[i]
        break
      }
    }

    if (!lastUserMsg) return

    // Remove last assistant message if present
    if (msgs[msgs.length - 1].sender === 'assistant') {
      msgs.pop()
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === activeConv.id ? { ...c, messages: msgs } : c
        ),
      }))
    }

    // Re-send user message
    get().sendMessage({ text: lastUserMsg.text, context, modelId })
  },

  // Edit user message and re-send
  editAndResendMessage: async (messageId, newText, context = null, modelId = 'gpt-4o') => {
    const activeConv = get().conversations.find((c) => c.id === get().activeConversationId)
    if (!activeConv) return

    // Truncate messages up to the edited message
    const index = activeConv.messages.findIndex((m) => m.id === messageId)
    if (index === -1) return

    const remaining = activeConv.messages.slice(0, index)
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === activeConv.id ? { ...c, messages: remaining } : c
      ),
      editingMessageId: null,
    }))

    get().sendMessage({ text: newText, context, modelId })
  },

  setEditingMessageId: (id) => set({ editingMessageId: id }),
}))

export default useChatStore
