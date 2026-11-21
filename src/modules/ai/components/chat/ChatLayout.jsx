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
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
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
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-slate-900/40 relative">
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
          <div className="px-4 py-2 border-b border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40">
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
