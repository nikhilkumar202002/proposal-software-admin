import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import ChatWelcome from './ChatWelcome'
import TypingIndicator from './TypingIndicator'

export default function ChatMessages({
  messages = [],
  isGenerating = false,
  streamedText = '',
  activeContext,
  onSelectPrompt,
  onCopy,
  onRegenerate,
  onEditSubmit,
  onDeleteMessage,
  onUseInProposal,
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamedText, isGenerating])

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <ChatWelcome onSelectPrompt={onSelectPrompt} activeContext={activeContext} />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 space-y-6">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          onCopy={onCopy}
          onRegenerate={onRegenerate}
          onEditSubmit={onEditSubmit}
          onDelete={onDeleteMessage}
          onUseInProposal={onUseInProposal}
        />
      ))}

      {/* Live Stream message placeholder */}
      {isGenerating && streamedText && (
        <ChatMessage
          message={{
            id: 'streaming-preview',
            role: 'assistant',
            sender: 'assistant',
            content: streamedText,
            timestamp: 'Just now',
          }}
          onCopy={onCopy}
        />
      )}

      {/* Typing indicator when waiting for first token */}
      {isGenerating && !streamedText && (
        <TypingIndicator statusText="ProposalOS AI is crafting response..." />
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  )
}
