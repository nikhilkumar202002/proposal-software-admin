/**
 * ProposalOS AI Module - useAIChat Hook
 * Provides high-level interface for managing chat conversations and message dispatching.
 */

import { useEffect, useMemo } from 'react'
import useChatStore from '../store/chatStore'
import useAIStore from '../store/aiStore'
import { formatContextPayload } from '../utils/promptBuilder'

export function useAIChat() {
  const {
    conversations,
    activeConversationId,
    searchQuery,
    isGenerating,
    editingMessageId,
    isSidebarOpen,
    isLoading,
    error,
    loadConversations,
    setActiveConversationId,
    setSearchQuery,
    toggleSidebar,
    createNewConversation,
    renameConversation,
    deleteConversation,
    sendMessage,
    stopGeneration,
    regenerateResponse,
    editAndResendMessage,
    setEditingMessageId,
  } = useChatStore()

  const { selectedModelId, context } = useAIStore()

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const q = searchQuery.toLowerCase().trim()
    return conversations.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.messages?.some((m) => m.text?.toLowerCase().includes(q))
    )
  }, [conversations, searchQuery])

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || conversations[0] || null
  }, [conversations, activeConversationId])

  const handleSend = (text) => {
    const contextPayload = formatContextPayload(context)
    sendMessage({ text, context: contextPayload, modelId: selectedModelId })
  }

  const handleRegenerate = () => {
    const contextPayload = formatContextPayload(context)
    regenerateResponse(contextPayload, selectedModelId)
  }

  const handleEditAndResend = (messageId, newText) => {
    const contextPayload = formatContextPayload(context)
    editAndResendMessage(messageId, newText, contextPayload, selectedModelId)
  }

  return {
    conversations: filteredConversations,
    activeConversation,
    activeConversationId,
    searchQuery,
    isGenerating,
    editingMessageId,
    isSidebarOpen,
    isLoading,
    error,
    setActiveConversation: setActiveConversationId,
    setSearchQuery,
    toggleSidebar,
    createNewConversation,
    renameConversation,
    deleteConversation,
    sendMessage: handleSend,
    stopGeneration,
    regenerateResponse: handleRegenerate,
    editAndResendMessage: handleEditAndResend,
    setEditingMessageId,
  }
}

export default useAIChat
