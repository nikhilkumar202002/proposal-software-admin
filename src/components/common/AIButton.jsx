import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RiChatAiFill } from 'react-icons/ri'
import {
  X,
  Maximize2,
  Send,
  Sparkles,
  FileText,
  Lightbulb,
  Coins,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react'
import { aiService } from '../../services/ai.service'

const QUICK_PROMPTS = [
  {
    title: 'Executive Summary',
    prompt: 'Draft an executive summary for an enterprise digital modernization proposal.',
    icon: FileText,
  },
  {
    title: 'Scope & Milestones',
    prompt: 'Itemize 3 core technical deliverables and milestones for cloud migration.',
    icon: Lightbulb,
  },
  {
    title: 'Pricing Breakdown',
    prompt: 'Recommend commercial milestone pricing and payment schedule in INR.',
    icon: Coins,
  },
]

export const AIButton = ({ className = '' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [messages, setMessages] = useState([])
  const [copiedIdx, setCopiedIdx] = useState(null)
  const panelRef = useRef(null)
  const inputRef = useRef(null)

  // Hide floating button when already on the full-page AI chat
  if (location.pathname === '/ai' || location.pathname === '/chat') {
    return null
  }

  // Close panel on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  const handleSendPrompt = async (textToSend) => {
    const text = (textToSend || prompt).trim()
    if (!text || isGenerating) return

    const userMsg = { id: `msg-${Date.now()}`, sender: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setPrompt('')
    setIsGenerating(true)

    try {
      const res = await aiService.sendMessage({
        message: text,
        modelId: 'gpt-4o',
        provider: 'openai',
      })

      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: res.reply || res.text || 'Proposal synthesized successfully.',
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      // Local fallback
      await new Promise((r) => setTimeout(r, 650))
      let fallbackText = ''
      const lower = text.toLowerCase()
      if (lower.includes('summary')) {
        fallbackText = `### 1. Executive Summary\n\nWe are pleased to submit this commercial offer to partner on your digital modernization initiative. Our high-velocity platform delivers 99.99% SLA availability and reduces infrastructure overhead by up to 35%.`
      } else if (lower.includes('pricing') || lower.includes('cost') || lower.includes('inr')) {
        fallbackText = `### Commercial Investment Schedule\n\n- **Milestone 01**: Discovery & Architecture — ₹ 1,50,000\n- **Milestone 02**: Platform API Development — ₹ 3,20,000\n- **Milestone 03**: Production Rollout & Handover — ₹ 2,80,000\n\n**Total Estimated**: ₹ 7,50,000 (+18% GST)`
      } else {
        fallbackText = `I have analyzed your request: "${text}".\n\nProposalOS AI is ready to structure this directly into your proposal document canvas or financial schedule.`
      }

      setMessages((prev) => [
        ...prev,
        { id: `msg-${Date.now() + 1}`, sender: 'assistant', text: fallbackText },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const handleOpenFullChat = () => {
    setIsOpen(false)
    navigate('/ai')
  }

  return (
    <div
      ref={panelRef}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 select-none no-print ${className}`}
    >
      {/* Sticky AI Chat Mini Window */}
      {isOpen && (
        <div className="absolute bottom-18 md:bottom-20 right-0 w-[340px] sm:w-[390px] max-h-[540px] bg-white rounded-2xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200 text-xs">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0055FF] to-blue-400 flex items-center justify-center text-white shadow-xs">
                <RiChatAiFill className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white leading-tight">
                  ProposalOS AI Copilot
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-300">GPT-4o • Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleOpenFullChat}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Open full-page chat"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 max-h-[320px] bg-[#F8FAFC]">
            {messages.length === 0 ? (
              <div className="space-y-3 py-2">
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-slate-700 leading-relaxed text-[11px]">
                  <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0055FF]" />
                    How can I assist your proposal?
                  </p>
                  Ask for executive summaries, milestone pricing, deliverable scopes, or click a quick prompt below.
                </div>

                {/* Quick Prompts */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                    Suggested Prompts
                  </span>
                  {QUICK_PROMPTS.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendPrompt(item.prompt)}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 transition-colors text-left group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className="w-3.5 h-3.5 text-[#0055FF] shrink-0" />
                          <span className="text-xs font-semibold text-slate-800 truncate">
                            {item.title}
                          </span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#0055FF] transition-transform group-hover:translate-x-0.5" />
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.sender === 'user'
                return (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-2.5 rounded-xl max-w-[88%] text-[11px] leading-relaxed shadow-2xs ${
                        isUser
                          ? 'bg-[#0055FF] text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs whitespace-pre-line'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {!isUser && (
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.text, idx)}
                          className="text-[10px] text-slate-400 hover:text-[#0055FF] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            )}

            {isGenerating && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0055FF] animate-spin" />
                <span className="text-[11px]">Synthesizing AI response...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-2.5 bg-white border-t border-slate-200/90 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendPrompt()
              }}
              className="relative flex items-center"
            >
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask ProposalOS AI anything..."
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0055FF] focus:ring-1 focus:ring-[#0055FF] bg-slate-50/50"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="absolute right-1.5 p-1 rounded-lg bg-[#0055FF] hover:bg-[#0044CC] text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <button
                type="button"
                onClick={handleOpenFullChat}
                className="hover:text-[#0055FF] font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Open Fullscreen Workspace</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
              <span className="text-slate-400">⌘ + Enter to send</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sticky AI Orb Trigger Button */}
      <div className="relative flex items-center gap-2 group">
        {/* Sticky Label Pill (Hidden on mobile, expands on hover) */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md text-slate-800 text-xs font-semibold hover:border-blue-400 hover:text-[#0055FF] transition-all cursor-pointer group-hover:shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-[#0055FF] animate-pulse" />
            <span>Ask AI Copilot</span>
          </button>
        )}

        {/* Soft background glow / aura */}
        <div
          className="absolute -inset-2 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(244, 63, 94, 0.45) 45%, rgba(99, 102, 241, 0.3) 75%, transparent 100%)',
          }}
        />

        {/* 3D Gradient Sphere Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle ProposalOS AI Assistant"
          className="relative w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform group-hover:scale-105 active:scale-95 focus:outline-none shadow-xl"
          style={{
            background: `
              radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.1) 25%, transparent 45%),
              radial-gradient(circle at 26% 45%, rgba(244, 63, 94, 0.72) 0%, rgba(217, 70, 239, 0.35) 35%, transparent 60%),
              radial-gradient(circle at 50% 40%, #8b5cf6 0%, #6366f1 35%, #4f46e5 68%, #281577 100%)
            `,
            boxShadow: `
              0 14px 34px -4px rgba(99, 102, 241, 0.55),
              0 8px 18px -2px rgba(244, 63, 94, 0.38),
              inset 0 -6px 12px rgba(20, 8, 80, 0.55),
              inset 0 3px 6px rgba(255, 255, 255, 0.5)
            `,
          }}
          title={isOpen ? 'Close AI Assistant' : 'Open ProposalOS AI Copilot'}
        >
          {/* Subtle glossy rim reflection */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 100%)',
            }}
          />

          {/* RiChatAiFill Icon or Close X */}
          <div className="relative z-10 transition-transform duration-200 group-hover:scale-110">
            {isOpen ? (
              <X className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            ) : (
              <RiChatAiFill className="w-7 h-7 sm:w-7.5 sm:h-7.5 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]" />
            )}
          </div>
        </button>
      </div>
    </div>
  )
}

export default AIButton
