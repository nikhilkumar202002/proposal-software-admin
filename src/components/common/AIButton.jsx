import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, Wand2, Lightbulb, Check, FileText, ArrowRight } from 'lucide-react'

export const AIButton = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const panelRef = useRef(null)

  // Close when clicking outside panel
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

  const quickPrompts = [
    {
      title: 'Executive Summary',
      prompt: 'Draft an executive summary for an enterprise digital modernization proposal.',
      icon: FileText,
    },
    {
      title: 'Scope Deliverables',
      prompt: 'Itemize 4 core milestones and technical scope deliverables for cloud migration.',
      icon: Lightbulb,
    },
    {
      title: 'Pricing Strategy',
      prompt: 'Recommend commercial milestone pricing and payment schedule in INR.',
      icon: Wand2,
    },
  ]

  const handleGenerate = (textToGenerate) => {
    const query = textToGenerate || prompt
    if (!query.trim()) return

    setIsGenerating(true)
    setGeneratedResult(null)

    setTimeout(() => {
      setIsGenerating(false)
      if (query.toLowerCase().includes('summary')) {
        setGeneratedResult(
          '1. Executive Summary\n\nWe are delighted to submit this commercial offer for your cloud and digital transformation engagement. Our tailored architecture modernizes core operational pipelines, enhances platform uptime to 99.99%, and reduces infrastructure costs by up to 34% within the first 6 months.'
        )
      } else if (query.toLowerCase().includes('scope') || query.toLowerCase().includes('deliverable')) {
        setGeneratedResult(
          '2. Scope & Key Milestones\n\n• Milestone 1: Discovery, Architecture Blueprint & Security Audit\n• Milestone 2: Infrastructure as Code (IaC) & Cloud Foundation\n• Milestone 3: Core API Services & Microservices Deployment\n• Milestone 4: Client Dashboard, UAT Testing & Production Cutover'
        )
      } else {
        setGeneratedResult(
          `Generated Proposal Insight for: "${query}"\n\nProposalOS AI has analyzed client parameters. Recommend structuring engagement around 3 progressive payment milestones with 30-day validity and standard enterprise SLA guarantees.`
        )
      }
    }, 700)
  }

  const handleCopy = () => {
    if (!generatedResult) return
    navigator.clipboard.writeText(generatedResult)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      ref={panelRef}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 select-none no-print ${className}`}
    >
      {/* Floating AI Orb Button matching the user design */}
      <div className="relative group">
        {/* Soft background glow / aura */}
        <div
          className="absolute -inset-2.5 rounded-full filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(244, 63, 94, 0.45) 45%, rgba(99, 102, 241, 0.3) 75%, transparent 100%)',
          }}
        />

        {/* 3D Gradient Sphere Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Proposal Copilot"
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform group-hover:scale-105 active:scale-95 focus:outline-none"
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
          title={isOpen ? 'Close AI Copilot' : 'Open AI Proposal Copilot'}
        >
          {/* Subtle glossy rim reflection */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 100%)',
            }}
          />

          {/* White Sparkle Stars Icon Matching User Image */}
          <div className="relative z-10 transition-transform duration-200 group-hover:rotate-12">
            <svg
              viewBox="0 0 40 40"
              className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
              fill="currentColor"
            >
              {/* Primary large 4-point star on left */}
              <path d="M 17 6 C 17 12 13 16 7 16 C 13 16 17 20 17 26 C 17 20 21 16 27 16 C 21 16 17 12 17 6 Z" />
              {/* Top-right medium star */}
              <path d="M 27 8 C 27 11 25 13 22 13 C 25 13 27 15 27 18 C 27 15 29 13 32 13 C 29 13 27 11 27 8 Z" />
              {/* Bottom-right small star */}
              <path d="M 26 23 C 26 25.5 24.5 27 22 27 C 24.5 27 26 28.5 26 31 C 26 28.5 27.5 27 30 27 C 27.5 27 26 25.5 26 23 Z" />
            </svg>
          </div>
        </button>
      </div>

      {/* Floating Interactive AI Assistant Dialog Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[330px] sm:w-[380px] bg-white border border-gray-200/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-[#0055FF] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-tight">ProposalOS AI Copilot</h4>
                <p className="text-[10px] text-white/80">Draft, refine & price proposals</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Panel Body */}
          <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto text-xs">
            {/* Quick Prompt Chips */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Quick AI Prompts
              </span>
              <div className="space-y-1.5">
                {quickPrompts.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrompt(item.prompt)
                        handleGenerate(item.prompt)
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-blue-50/70 border border-gray-100 hover:border-blue-200 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="text-xs font-semibold text-gray-800 truncate">
                          {item.title}
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-[#0055FF] transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Generated Result Container */}
            {isGenerating && (
              <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-100 text-center space-y-2">
                <div className="inline-flex items-center gap-2 text-violet-700 font-semibold text-xs">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing proposal content...</span>
                </div>
                <p className="text-[11px] text-gray-500">Applying calibrated A4 formatting & pricing</p>
              </div>
            )}

            {generatedResult && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3" /> AI Output Ready
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[11px] font-semibold text-[#0055FF] hover:underline cursor-pointer"
                  >
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
                <div className="text-xs text-gray-800 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto p-2 bg-white rounded-lg border border-gray-100 font-sans">
                  {generatedResult}
                </div>
              </div>
            )}

            {/* Input Prompt Box */}
            <div className="pt-1">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleGenerate()
                    }
                  }}
                  placeholder="Ask AI to draft, rewrite or calculate..."
                  className="w-full pr-10 pl-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={!prompt.trim() || isGenerating}
                  className="absolute right-1.5 p-1.5 rounded-lg bg-[#0055FF] text-white hover:bg-[#0044CC] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Generate"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIButton
