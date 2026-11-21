import { useState } from 'react'
import ChatSidebar from './ChatSidebar'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import AIErrorMessage from '../common/AIErrorMessage'

export default function ChatLayout({
  // Conversations
  conversations,
  activeConversationId,
  activeConversation,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,

  // Sidebar
  isSidebarOpen,
  onToggleSidebar,

  // Model & Context
  selectedModel,
  onSelectModel,
  activeContext,
  onOpenContextSelector,

  // Messages & Streaming
  messages,
  isGenerating,
  streamedText,
  error,
  onClearError,

  // Actions
  onSendMessage,
  onStopGeneration,
  onSelectPrompt,
  onCopyMessage,
  onRegenerate,
  onEditSubmit,
  onDeleteMessage,
  onUseInProposal,
}) {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-800 overflow-hidden font-sans">
      {/* Collapsible Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
        onNewChat={onNewChat}
        onRenameConversation={onRenameConversation}
        onDeleteConversation={onDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={onToggleSidebar}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white relative">
        {/* Top Header */}
        <ChatHeader
          selectedModel={selectedModel}
          onSelectModel={onSelectModel}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={onToggleSidebar}
          onNewChat={onNewChat}
          activeContext={activeContext}
          onOpenContextSelector={onOpenContextSelector}
        />

        {/* Global Error Banner if any */}
        {error && (
          <div className="px-4 py-2 border-b border-rose-200 bg-rose-50/80">
            <AIErrorMessage
              message={error}
              onDismiss={onClearError}
              onRetry={onRegenerate}
            />
          </div>
        )}

        {/* Messages Feed */}
        <ChatMessages
          messages={messages}
          isGenerating={isGenerating}
          streamedText={streamedText}
          activeContext={activeContext}
          onSelectPrompt={onSelectPrompt}
          onCopy={onCopyMessage}
          onRegenerate={onRegenerate}
          onEditSubmit={onEditSubmit}
          onDeleteMessage={onDeleteMessage}
          onUseInProposal={onUseInProposal}
        />

        {/* Bottom Floating Chat Input */}
        <ChatInput
          onSendMessage={onSendMessage}
          onStopGeneration={onStopGeneration}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  )
}
