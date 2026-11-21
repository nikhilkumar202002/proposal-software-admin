// Pages
export { default as AIChatPage } from './pages/AIChatPage'
export { default as AIProposalGenerator } from './pages/AIProposalGenerator'
export { default as AISettingsPage } from './pages/AISettingsPage'

// Components - Chat
export { default as ChatLayout } from './components/chat/ChatLayout'
export { default as ChatSidebar } from './components/chat/ChatSidebar'
export { default as ChatHeader } from './components/chat/ChatHeader'
export { default as ChatMessages } from './components/chat/ChatMessages'
export { default as ChatMessage } from './components/chat/ChatMessage'
export { default as ChatInput } from './components/chat/ChatInput'
export { default as ChatWelcome } from './components/chat/ChatWelcome'
export { default as TypingIndicator } from './components/chat/TypingIndicator'
export { default as SuggestedPrompts } from './components/chat/SuggestedPrompts'
export { default as MessageActions } from './components/chat/MessageActions'

// Components - Proposal
export { default as ProposalGenerationForm } from './components/proposal/ProposalGenerationForm'
export { default as ProposalPreview } from './components/proposal/ProposalPreview'
export { default as ProposalSectionCard } from './components/proposal/ProposalSectionCard'
export { default as ProposalImportModal } from './components/proposal/ProposalImportModal'
export { default as ProposalGenerationStatus } from './components/proposal/ProposalGenerationStatus'

// Components - Assistant
export { default as AIAssistantPanel } from './components/assistant/AIAssistantPanel'
export { default as AIActionMenu } from './components/assistant/AIActionMenu'
export { default as AIContextSelector } from './components/assistant/AIContextSelector'
export { default as AIConfirmationModal } from './components/assistant/AIConfirmationModal'

// Components - Common
export { default as AIModelSelector } from './components/common/AIModelSelector'
export { default as AIErrorMessage } from './components/common/AIErrorMessage'
export { default as AIUsageIndicator } from './components/common/AIUsageIndicator'
export { default as AIEmptyState } from './components/common/AIEmptyState'

// Hooks
export { useAIChat } from './hooks/useAIChat'
export { useAIProposal } from './hooks/useAIProposal'
export { useAIStreaming } from './hooks/useAIStreaming'
export { useAIContext } from './hooks/useAIContext'

// Services
export { default as aiService } from './services/aiService'
export { default as chatService } from './services/chatService'
export { default as proposalAIService } from './services/proposalAIService'

// Stores
export { useAIStore } from './store/aiStore'
export { useChatStore } from './store/chatStore'

// Utils
export * from './utils/aiHelpers'
export * from './utils/promptBuilder'
export * from './utils/responseParser'
export * from './utils/proposalConverter'
