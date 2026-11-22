/**
 * ProposalOS AI Module - Chat & Conversation Service
 * Manages conversation CRUD and chat message generation with backend endpoints or mock storage fallback.
 */

import { aiService as centralAIService } from '../../../services/ai.service'
import aiService from './aiService'
import { SYSTEM_PROMPT } from '../utils/promptBuilder'

const CHAT_STORAGE_KEY = 'proposalos_ai_conversations'

const DEFAULT_CONVERSATIONS = [
  {
    id: 'conv-01M81YM71EPFS5P8HCVE1KETSJ',
    db_id: 5,
    title: 'Enterprise E-Commerce Modernization',
    modelId: 'gpt-4o',
    provider: 'openai',
    context: {
      clientName: 'Apex Global',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg-01M81YM71GXHWQ71BCEK5WGWN7',
        sender: 'user',
        text: 'We need an e-commerce proposal. The stack is Next.js, Laravel, and MySQL with Stripe checkout and 8 weeks delivery.',
        modelId: 'gpt-4o',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'msg-init-2',
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
        modelId: 'gpt-4o',
        createdAt: new Date().toISOString(),
      },
    ],
  },
]

export const chatService = {
  /**
   * Get all conversations
   * GET /api/ai/conversations
   */
  getConversations: async () => {
    try {
      const list = await centralAIService.getConversations()
      if (Array.isArray(list) && list.length > 0) {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(list))
        return list
      }
      // If backend returned empty list, check local storage
      const raw = localStorage.getItem(CHAT_STORAGE_KEY)
      if (raw) return JSON.parse(raw)
      return list
    } catch {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY)
      if (!raw) {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(DEFAULT_CONVERSATIONS))
        return DEFAULT_CONVERSATIONS
      }
      return JSON.parse(raw)
    }
  },

  /**
   * Create a new conversation
   * POST /api/ai/conversations
   */
  createConversation: async ({
    title = 'New Proposal Chat',
    modelId = 'gpt-4o',
    provider = 'openai',
    context = {},
  }) => {
    try {
      const response = await centralAIService.createConversation({
        title,
        modelId,
        provider,
        context,
      })
      if (response?.id) {
        return response
      }
      throw new Error('Invalid conversation response')
    } catch {
      const convos = await chatService.getConversations()
      const newConv = {
        id: `conv-${Date.now()}`,
        db_id: Date.now(),
        title,
        modelId,
        provider,
        context,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      }
      convos.unshift(newConv)
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(convos))
      return newConv
    }
  },

  /**
   * Rename or update a conversation
   * PATCH /api/ai/conversations/{id}
   */
  updateConversation: async (id, { title, modelId, context }) => {
    try {
      const response = await centralAIService.updateConversation(id, {
        title,
        modelId,
        context,
      })
      if (response?.id) return response
    } catch (err) {
      console.warn('Backend updateConversation fallback:', err.message)
    }

    const convos = await chatService.getConversations()
    const index = convos.findIndex((c) => c.id === id || c.db_id === id)
    if (index !== -1) {
      convos[index] = {
        ...convos[index],
        ...(title !== undefined ? { title } : {}),
        ...(modelId !== undefined ? { modelId } : {}),
        ...(context !== undefined ? { context } : {}),
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(convos))
      return convos[index]
    }
    throw new Error('Conversation not found')
  },

  /**
   * Delete a conversation
   * DELETE /api/ai/conversations/{id}
   */
  deleteConversation: async (id) => {
    try {
      await centralAIService.deleteConversation(id)
    } catch (err) {
      console.warn('Backend deleteConversation fallback:', err.message)
    }

    const convos = await chatService.getConversations()
    const filtered = convos.filter((c) => c.id !== id && c.db_id !== id)
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(filtered))
    return { success: true }
  },

  /**
   * Send a chat message (Synchronous)
   * POST /api/ai/chat
   */
  sendMessage: async ({
    conversationId,
    message,
    context = null,
    modelId = 'gpt-4o',
    provider = 'openai',
  }) => {
    try {
      const response = await centralAIService.sendMessage({
        conversationId,
        message,
        context,
        modelId,
        provider,
      })

      await aiService.logUsage({
        modelId,
        prompt: message,
        responseText: response.reply,
        actionType: 'chat',
      })

      return response
    } catch {
      // Realistic simulated AI response generator
      await new Promise((r) => setTimeout(r, 650))
      let reply = ''
      const lower = message.toLowerCase()

      if (lower.includes('price') || lower.includes('quote') || lower.includes('cost') || lower.includes('inr')) {
        reply = `### Commercial Pricing & Milestone Breakdown

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
      } else if (lower.includes('scope') || lower.includes('deliverable') || lower.includes('milestone')) {
        reply = `### Project Scope & Deliverables

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
        reply = `I have analyzed your instruction: **"${message}"**

Here is a drafted proposal section ready for insertion:

> **Enterprise Commitment Statement**  
> Our primary objective is ensuring measurable commercial value, accelerated delivery velocity, and operational reliability for your enterprise. By leveraging modern development practices and physical A4 precision layouts, our team ensures complete transparency from initial proposal to production cutover.

Would you like me to:
- Convert this directly into a **new proposal draft**?
- Adjust the tone for a specific industry (e.g., Financial Services, Healthcare, SaaS)?
- Add itemized commercial pricing rows?`
      }

      await aiService.logUsage({
        modelId,
        prompt: message,
        responseText: reply,
        actionType: 'chat',
      })

      return {
        reply,
        text: reply,
        modelId,
        provider,
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Stream interactive AI response
   * POST /api/ai/chat/stream
   */
  streamChat: async ({
    conversationId,
    message,
    context = null,
    modelId = 'gpt-4o',
    provider = 'openai',
    onChunk = () => {},
    onComplete = () => {},
    onError = () => {},
    signal,
  }) => {
    return centralAIService.streamChat(
      {
        conversationId,
        message,
        context,
        modelId,
        provider,
      },
      {
        onChunk,
        onComplete: async (fullText) => {
          await aiService.logUsage({
            modelId,
            prompt: message,
            responseText: fullText,
            actionType: 'chat_stream',
          })
          onComplete(fullText)
        },
        onError,
        signal,
      }
    )
  },
}

export default chatService
