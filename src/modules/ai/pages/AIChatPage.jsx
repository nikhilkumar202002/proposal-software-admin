import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Send,
  Plus,
  Paperclip,
  Globe,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Trash2,
  ChevronDown,
  FileText,
  Search,
  ArrowRight,
  Share2,
  SlidersHorizontal,
  Bot,
  User,
  PanelLeft,
  ArrowUp,
  ExternalLink,
} from 'lucide-react'
import { RiChatAiFill } from 'react-icons/ri'

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    title: 'Enterprise Digital Modernization',
    timestamp: 'Today',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Draft an executive summary and 3 key milestones for an enterprise digital modernization proposal.',
        time: '11:42 AM',
      },
      {
        id: 'msg-2',
        sender: 'assistant',
        text: `### 1. Executive Summary

We are pleased to submit this commercial offer to partner with your organization on its core **Enterprise Digital Modernization Initiative**. 

In today’s accelerating competitive landscape, legacy monoliths introduce latency and operational risk. Our solution architected by **ProposalOS** establishes a resilient, cloud-native foundation engineered to:
- **Accelerate Time-to-Market** by up to **40%** through automated CI/CD pipelines.
- **Guarantee 99.99% Uptime SLA** via multi-region Kubernetes deployments.
- **Reduce Infrastructure Overhead** by **30–35%** utilizing serverless autoscaling.

---

### 2. Core Project Milestones & Deliverables

| Milestone # | Phase & Deliverables | Unit / Timeline | Suggested Est. |
| :--- | :--- | :--- | :--- |
| **Milestone 01** | **Architecture Discovery & Security Blueprint**<br/>Audit legacy services, zero-trust network design, compliance roadmap (ISO 27001). | 3 Weeks | ₹ 1,50,000 |
| **Milestone 02** | **Infrastructure as Code (IaC) & Cloud Migration**<br/>Terraform provisioning, containerization, staging cutover, automated rollbacks. | 6 Weeks | ₹ 3,20,000 |
| **Milestone 03** | **Production Rollout, Client Dashboard & 24/7 SLA**<br/>Real-time telemetry, user acceptance signoff, staff training & handover. | 4 Weeks | ₹ 2,80,000 |

*All milestone items can be directly itemized into the ProposalOS pricing engine with automatic tax calculation and PDF publishing.*`,
        time: '11:43 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Commercial Milestone Pricing in INR',
    timestamp: 'Yesterday',
    messages: [
      {
        id: 'msg-3',
        sender: 'user',
        text: 'How should I structure payment milestone percentages for a 6-month software contract?',
        time: 'Yesterday',
      },
      {
        id: 'msg-4',
        sender: 'assistant',
        text: `For a 6-month enterprise software agreement, industry best practice recommends a **40-30-20-10** or **30-30-30-10** milestone split:

1. **Initial Mobilization & Architecture Signoff (30%)** — Due upon contract execution and workspace setup.
2. **Core Feature Alpha & Staging Deployment (30%)** — Due upon user demo and preliminary testing.
3. **UAT & Security Audit Signoff (30%)** — Due prior to final production cutover.
4. **Final Warranty & Production Handover (10%)** — Due 30 days post-go-live after successful operational stability.`,
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'B2B White-Label Scope Review',
    timestamp: 'Previous 7 Days',
    messages: [
      {
        id: 'msg-5',
        sender: 'user',
        text: 'What legal clause should I add for white-label agency proposals?',
        time: '3 days ago',
      },
    ],
  },
]

const PROMPT_SUGGESTIONS = [
  {
    title: 'Draft Executive Summary',
    description: 'Write a persuasive, C-level executive summary for a cloud project.',
    prompt: 'Draft a compelling C-level Executive Summary for an enterprise cloud migration proposal.',
    icon: FileText,
  },
  {
    title: 'Itemize Key Deliverables',
    description: 'Generate 4 structured milestones with timeline and scope details.',
    prompt: 'Generate 4 structured project milestones with timelines and technical deliverables.',
    icon: Sparkles,
  },
  {
    title: 'Recommend Pricing Structure',
    description: 'Calculate 3-tier milestone pricing in INR with 18% GST.',
    prompt: 'Recommend commercial milestone pricing and tax breakdown in INR for a 5-month web portal.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Polish & Strengthen Terms',
    description: 'Review SLA warranty and payment terms to sound more authoritative.',
    prompt: 'Rewrite payment terms and 99.99% SLA commitment for an enterprise proposal.',
    icon: Check,
  },
]

const AI_MODELS = [
  { id: 'gpt-4o', name: 'ProposalOS 4o', desc: 'Flagship model for complex drafting & pricing' },
  { id: 'o3-mini', name: 'o3-mini (High Reasoning)', desc: 'Optimized for mathematical milestone quotes' },
  { id: 'gemini-flash', name: 'Gemini 2.5 Flash', desc: 'Instant speed for rapid scope generation' },
]

export const AIChatPage = () => {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [activeConvId, setActiveConvId] = useState(INITIAL_CONVERSATIONS[0].id)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0])
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0]

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages, isTyping])

  // Adjust textarea height automatically
  const handleInputChange = (e) => {
    setInputMessage(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
    }
  }

  const handleCreateNewChat = () => {
    const newId = `conv-${Date.now()}`
    const newChat = {
      id: newId,
      title: 'New Proposal Chat',
      timestamp: 'Just now',
      messages: [],
    }
    setConversations([newChat, ...conversations])
    setActiveConvId(newId)
    setInputMessage('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage
    if (!query.trim()) return

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const updatedMessages = [...(activeConversation.messages || []), userMessage]
    const updatedTitle =
      activeConversation.messages.length === 0
        ? query.slice(0, 32) + (query.length > 32 ? '...' : '')
        : activeConversation.title

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, title: updatedTitle, messages: updatedMessages }
          : c
      )
    )

    setInputMessage('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Simulate ChatGPT-style AI streaming response
    setIsTyping(true)
    setTimeout(() => {
      let aiResponseText = ''
      const lower = query.toLowerCase()

      if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('inr')) {
        aiResponseText = `### Commercial Pricing & Milestone Breakdown

Based on your project scope, here is a structured commercial estimate with standard enterprise terms:

| Phase # | Description | Unit | Unit Price | Tax (18% GST) | Net Amount |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Discovery & Architectural Sprint | Milestone | ₹ 1,50,000 | ₹ 27,000 | ₹ 1,77,000 |
| **02** | Core Platform Development & API | Milestone | ₹ 3,50,000 | ₹ 63,000 | ₹ 4,13,000 |
| **03** | Staging Verification & Cloud Cutover | Milestone | ₹ 2,50,000 | ₹ 45,000 | ₹ 2,95,000 |

**Total Net Investment**: **₹ 7,50,000**  
**Total GST (18%)**: **₹ 1,35,000**  
**Grand Total**: **₹ 8,85,000**

> *Tip: You can use the **Proposal Builder** to load these items directly into your A4 document table.*`
      } else if (lower.includes('milestone') || lower.includes('scope') || lower.includes('deliverable')) {
        aiResponseText = `### Project Scope & Deliverables

Here is an itemized technical roadmap tailored for executive presentation:

1. **Phase 1: Architecture Blueprint & Technical Discovery**
   - High-level system topology and database schema design.
   - Cloud security architecture with ISO 27001 & SOC 2 compliance mapping.
   - Resource sizing and infrastructure cost optimization model.

2. **Phase 2: Core Platform Engineering & Automation**
   - Implementation of REST/GraphQL API gateway.
   - Infrastructure as Code (IaC) with Terraform for automated deployment.
   - Automated test coverage exceeding 85% for business-critical paths.

3. **Phase 3: Production Rollout & Managed SLA**
   - Blue/green zero-downtime production deployment.
   - 24/7 Prometheus & Grafana alerting infrastructure.
   - Comprehensive technical documentation and staff onboarding.`
      } else {
        aiResponseText = `I have analyzed your instruction: **"${query}"**

Here is a drafted proposal section ready for insertion:

> **Enterprise Commitment Statement**  
> Our primary objective is ensuring measurable commercial value, accelerated delivery velocity, and operational reliability for your enterprise. By leveraging modern development practices and physical A4 precision layouts, our team ensures complete transparency from initial proposal to production cutover.

Would you like me to:
- Convert this directly into a **new proposal draft**?
- Adjust the tone for a specific industry (e.g., Financial Services, Healthcare, SaaS)?
- Add itemized commercial pricing rows?`
      }

      const aiMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, messages: [...updatedMessages, aiMessage] }
            : c
        )
      )
      setIsTyping(false)
    }, 850)
  }

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDeleteConversation = (convId, e) => {
    e.stopPropagation()
    const filtered = conversations.filter((c) => c.id !== convId)
    if (filtered.length === 0) {
      handleCreateNewChat()
    } else {
      setConversations(filtered)
      if (activeConvId === convId) {
        setActiveConvId(filtered[0].id)
      }
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden text-gray-900 select-none">
      {/* 1. Left Sub-Sidebar (ChatGPT Thread History) */}
      <div
        className={`${
          isSidebarOpen ? 'w-64 sm:w-72' : 'w-0'
        } transition-all duration-300 ease-in-out border-r border-gray-100 bg-[#F9FAFB] flex flex-col shrink-0 overflow-hidden relative`}
      >
        {/* New Chat Button */}
        <div className="p-3 border-b border-gray-200/60 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreateNewChat}
            className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-gray-100/80 border border-gray-200/80 text-xs font-semibold text-gray-800 transition-colors shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#0055FF] group-hover:scale-110 transition-transform" />
              <span>New Chat</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Ctrl+K</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer"
            title="Close Chat History"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
          <div className="px-2 pt-2 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Recent Conversations
          </div>

          {conversations.map((conv) => {
            const isActive = conv.id === activeConvId
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-blue-50/80 text-[#0055FF] font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-[#0055FF]' : 'text-gray-400'
                    }`}
                  />
                  <span className="truncate">{conv.title}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-600 transition-all cursor-pointer"
                  title="Delete chat"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-gray-200/60 text-[11px] text-gray-500 flex items-center justify-between bg-white/50">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Model Active
          </span>
          <span className="text-gray-400 font-mono text-[10px]">v2.4.0</span>
        </div>
      </div>

      {/* 2. Main ChatGPT Conversation View */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Top Header Bar */}
        <div className="h-14 px-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xs z-20">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer mr-1"
                title="Open Chat History"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            {/* Model Selector Pill (ChatGPT Style) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-xs font-bold text-gray-900 transition-colors cursor-pointer"
              >
                <span className="text-sm font-bold tracking-tight">{selectedModel.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isModelDropdownOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Select AI Model
                  </div>
                  {AI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model)
                        setIsModelDropdownOpen(false)
                      }}
                      className={`w-full flex items-start gap-2.5 px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        selectedModel.id === model.id
                          ? 'bg-blue-50/70 text-[#0055FF]'
                          : 'hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-[#0055FF] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">{model.name}</div>
                        <div className="text-[10px] text-gray-500">{model.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/proposals/new')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-[#0055FF] text-xs font-semibold transition-colors cursor-pointer"
              title="Create new proposal with this content"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open Proposal Builder</span>
            </button>
          </div>
        </div>

        {/* Messages Feed Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 space-y-6">
          {(!activeConversation.messages || activeConversation.messages.length === 0) ? (
            /* ChatGPT Empty State Hero */
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4">
              {/* 3D Glowing Orb Icon */}
              <div className="relative mb-5 group">
                <div
                  className="absolute -inset-4 rounded-full filter blur-xl opacity-60 animate-pulse pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(244, 63, 94, 0.45) 45%, rgba(99, 102, 241, 0.3) 75%, transparent 100%)',
                  }}
                />
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                  style={{
                    background: `
                      radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.1) 25%, transparent 45%),
                      radial-gradient(circle at 26% 45%, rgba(244, 63, 94, 0.72) 0%, rgba(217, 70, 239, 0.35) 35%, transparent 60%),
                      radial-gradient(circle at 50% 40%, #8b5cf6 0%, #6366f1 35%, #4f46e5 68%, #281577 100%)
                    `,
                  }}
                >
                  <RiChatAiFill className="w-8 h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-2">
                What proposal can I draft for you today?
              </h2>
              <p className="text-xs text-gray-500 max-w-md mb-8">
                Generate complete A4 commercial offers, calculate milestone pricing in INR, outline technical deliverables, or refine legal terms.
              </p>

              {/* 4 Quick Prompt Cards (ChatGPT Style 2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {PROMPT_SUGGESTIONS.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt)}
                      className="p-3.5 rounded-2xl border border-gray-200/90 hover:border-[#0055FF]/40 hover:bg-blue-50/30 transition-all text-left shadow-2xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-[#0055FF] group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-gray-900">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-snug">{item.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Active Message Bubbles Feed */
            <div className="max-w-3xl mx-auto space-y-6">
              {activeConversation.messages.map((msg) => {
                const isUser = msg.sender === 'user'
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 text-xs leading-relaxed ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <div className="shrink-0 mt-0.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shadow-xs"
                          style={{
                            background:
                              'radial-gradient(circle at 35% 25%, #8b5cf6 0%, #6366f1 40%, #312e81 100%)',
                          }}
                        >
                          <RiChatAiFill className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`relative rounded-2xl px-4 py-3 max-w-[85%] ${
                        isUser
                          ? 'bg-[#F4F4F5] text-gray-900 rounded-br-xs font-medium'
                          : 'bg-white text-gray-900 space-y-2'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                        {msg.text}
                      </div>

                      {/* Assistant Actions Bar below message (ChatGPT style) */}
                      {!isUser && (
                        <div className="flex items-center gap-2 pt-2 text-gray-400 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="p-1 rounded hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                            title="Copy to clipboard"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => navigate('/proposals/new')}
                            className="p-1 rounded hover:bg-blue-50 hover:text-[#0055FF] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                            title="Insert into Proposal Builder"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Use in Proposal</span>
                          </button>

                          <button
                            type="button"
                            className="p-1 rounded hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            className="p-1 rounded hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                            title="Unhelpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="shrink-0 mt-0.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0055FF] to-[#00AAFF] text-white flex items-center justify-center text-[10px] font-bold">
                          AM
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 flex items-center gap-1.5 text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 3. Bottom Signature ChatGPT Input Box (Floating Pill Container) */}
        <div className="p-4 sm:pb-6 bg-gradient-to-t from-white via-white to-transparent shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-3xl border border-gray-200 bg-white shadow-md focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-200/80 transition-all p-2 flex flex-col gap-2">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Message ProposalOS AI..."
                className="w-full resize-none border-0 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-gray-900 focus:outline-none placeholder:text-gray-400 min-h-[38px] max-h-[160px]"
              />

              {/* Action Tools Inside Input Pill */}
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <button
                    type="button"
                    className="p-1.5 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                    title="Attach proposal or client context"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                    title="Search web & market standards"
                  >
                    <Globe className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                    title="Formatting and tone settings"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Send Button (ChatGPT Rounded Arrow Up) */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    inputMessage.trim() && !isTyping
                      ? 'bg-black text-white hover:bg-gray-800 shadow-xs'
                      : 'bg-gray-100 text-gray-300 pointer-events-none'
                  }`}
                  title="Send Message"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Disclaimer Subtext (ChatGPT style) */}
            <p className="text-[10px] text-gray-400 text-center mt-2">
              ProposalOS AI can make mistakes. Please verify commercial pricing and legal contractual terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChatPage
