import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatLayout from '../components/chat/ChatLayout'
import AIContextSelector from '../components/assistant/AIContextSelector'
import ProposalImportModal from '../components/proposal/ProposalImportModal'
import { useAIChat } from '../hooks/useAIChat'
import { useAIContext } from '../hooks/useAIContext'
import { useAIStore } from '../store/aiStore'
import { useProposalStore } from '../../proposals/store/proposalStore'
import { parseProposalFromMarkdown } from '../utils/proposalConverter'

export default function AIChatPage() {
  const navigate = useNavigate()
  const { addProposal } = useProposalStore()

  // Chat Hook
  const {
    conversations,
    activeConversationId,
    activeConversation,
    messages,
    isGenerating,
    streamedText,
    error,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    toggleSidebar,
    selectConversation,
    newChat,
    renameConversation,
    deleteConversation,
    sendMessage,
    stopGeneration,
    regenerateLastMessage,
    editMessage,
    deleteMessage,
  } = useAIChat()

  // AI Store & Context
  const { selectedModel, setModel } = useAIStore()
  const { activeContext, setContext } = useAIContext()

  // Modals state
  const [isContextModalOpen, setIsContextModalOpen] = useState(false)
  const [importProposalData, setImportProposalData] = useState(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Quick Action: "Use in Proposal" from AI response
  const handleUseInProposal = (message) => {
    const parsed = parseProposalFromMarkdown(message.content || message.text || '')
    // Attach client context if available
    if (activeContext.client) {
      parsed.client = activeContext.client
      parsed.clientId = activeContext.client.id
      parsed.clientName = activeContext.client.name || activeContext.client.companyName
    }
    setImportProposalData(parsed)
    setIsImportModalOpen(true)
  }

  // Header Action: "Generate Proposal" from current conversation
  const handleGenerateProposalFromChat = () => {
    const conversationSummary = (messages || [])
      .map((m) => `${m.sender === 'user' ? 'Client Requirements' : 'AI Proposal Consultant'}: ${m.text || m.content || ''}`)
      .join('\n\n')

    navigate('/ai/generator', {
      state: {
        fromChat: true,
        initialPrompt: conversationSummary,
        client: activeContext?.client || null,
        title: activeConversation?.title && activeConversation.title !== 'New Proposal Chat'
          ? activeConversation.title
          : '',
      },
    })
  }

  // Handle confirming import into ProposalOS
  const handleConfirmImport = async (destination) => {
    if (!importProposalData) return
    setIsImporting(true)

    try {
      // Add proposal to ProposalOS store
      const newProposalRecord = {
        ...importProposalData,
        id: `prop-${Date.now()}`,
        status: 'draft',
        date: new Date().toISOString().split('T')[0],
      }

      addProposal(newProposalRecord)
      setIsImportModalOpen(false)

      if (destination === 'preview') {
        navigate(`/proposals/${newProposalRecord.id}/preview`)
      } else {
        navigate(`/proposals/${newProposalRecord.id}/edit`)
      }
    } catch (err) {
      console.error('Import error:', err)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <>
      <ChatLayout
        conversations={conversations}
        activeConversationId={activeConversationId}
        activeConversation={activeConversation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectConversation={selectConversation}
        onNewChat={newChat}
        onRenameConversation={renameConversation}
        onDeleteConversation={deleteConversation}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        selectedModel={selectedModel}
        onSelectModel={setModel}
        activeContext={activeContext}
        onOpenContextSelector={() => setIsContextModalOpen(true)}
        messages={messages}
        isGenerating={isGenerating}
        streamedText={streamedText}
        error={error}
        onClearError={() => {}}
        onSendMessage={sendMessage}
        onStopGeneration={stopGeneration}
        onSelectPrompt={(prompt) => sendMessage(prompt)}
        onCopyMessage={(content) => navigator.clipboard.writeText(content)}
        onRegenerate={regenerateLastMessage}
        onEditSubmit={editMessage}
        onDeleteMessage={deleteMessage}
        onUseInProposal={handleUseInProposal}
        onGenerateProposal={handleGenerateProposalFromChat}
      />

      {/* AI Context Selector Modal */}
      <AIContextSelector
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
        activeContext={activeContext}
        onSaveContext={setContext}
      />

      {/* Proposal Import Confirmation Modal */}
      <ProposalImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        proposalData={importProposalData}
        onConfirmImport={handleConfirmImport}
        isImporting={isImporting}
      />
    </>
  )
}
