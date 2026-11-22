/**
 * ProposalOS AI Module - Proposal Data Converter & TipTap AST Generator
 * Transforms AI-generated proposals into the exact proposal data structure used by manual proposals.
 */

import { generateProposalNumber, getStoredCompanyDetails, getStoredCurrencySettings } from '../../proposals/utils/proposalHelpers'

/**
 * Converts markdown string paragraphs, headings and lists into TipTap ProseMirror AST nodes
 */
export function markdownToTipTapDoc(markdownText = '', proposalTitle = 'Enterprise Commercial Offer') {
  const content = []

  // Document Title Heading
  content.push({
    type: 'heading',
    attrs: { level: 1 },
    content: [{ type: 'text', text: proposalTitle }],
  })

  if (!markdownText) {
    return { type: 'doc', content }
  }

  const lines = markdownText.split('\n')
  let currentList = null

  const flushList = () => {
    if (currentList && currentList.content.length > 0) {
      content.push(currentList)
      currentList = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    if (!trimmed) {
      flushList()
      continue
    }

    // Headings: ###, ##, #
    if (trimmed.startsWith('#')) {
      flushList()
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/)
      if (match) {
        const level = Math.min(3, Math.max(1, match[1].length))
        content.push({
          type: 'heading',
          attrs: { level },
          content: [{ type: 'text', text: match[2].trim() }],
        })
        continue
      }
    }

    // Bullet List Items: - or *
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.substring(2).trim()
      if (!currentList) {
        currentList = {
          type: 'bulletList',
          content: [],
        }
      }
      currentList.content.push({
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: itemText }],
          },
        ],
      })
      continue
    }

    // Numbered List Items: 1., 2.
    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '').trim()
      if (!currentList) {
        currentList = {
          type: 'orderedList',
          content: [],
        }
      }
      currentList.content.push({
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: itemText }],
          },
        ],
      })
      continue
    }

    // Standard Paragraph
    flushList()
    content.push({
      type: 'paragraph',
      content: [{ type: 'text', text: trimmed }],
    })
  }

  flushList()
  return { type: 'doc', content }
}

/**
 * Converts structured AI response into an official ProposalOS ProposalModel instance
 */
export function convertAIResponseToProposalModel(aiData = {}, existingProposals = []) {
  const company = getStoredCompanyDetails()
  const currencySettings = getStoredCurrencySettings()
  const defaultCurrency = aiData.currency || currencySettings.defaultCurrency || 'INR'
  const validityDays = currencySettings.defaultValidityDays || 30

  const today = new Date().toISOString().split('T')[0]
  const validDate = new Date()
  validDate.setDate(validDate.getDate() + validityDays)
  const validUntil = validDate.toISOString().split('T')[0]

  const proposalNumber = generateProposalNumber(existingProposals)
  const title = aiData.proposal_title || aiData.title || 'Enterprise Commercial Offer'
  const projectName = aiData.projectName || title
  const serviceType = aiData.serviceType || aiData.service_type || 'Digital Modernization & Enterprise Architecture'
  const proposalType = (aiData.proposalType || aiData.proposal_type) === 'b2b' ? 'b2b' : 'direct'

  // Extract structured canonical sections
  const execSummary = aiData.executive_summary || aiData.executiveSummary || ''
  const projectOverview = aiData.project_overview || aiData.projectOverview || ''
  const objectives = Array.isArray(aiData.objectives)
    ? aiData.objectives
    : typeof aiData.objectives === 'string'
    ? aiData.objectives.split('\n').filter(Boolean)
    : []
  const scopeOfWork = Array.isArray(aiData.scope_of_work || aiData.scopeOfWork)
    ? (aiData.scope_of_work || aiData.scopeOfWork)
    : typeof (aiData.scope_of_work || aiData.scopeOfWork) === 'string'
    ? (aiData.scope_of_work || aiData.scopeOfWork).split('\n').filter(Boolean)
    : []
  const deliverables = Array.isArray(aiData.deliverables)
    ? aiData.deliverables
    : typeof aiData.deliverables === 'string'
    ? aiData.deliverables.split('\n').filter(Boolean)
    : []
  const techStack = Array.isArray(aiData.technology_stack || aiData.technologyStack)
    ? (aiData.technology_stack || aiData.technologyStack)
    : typeof (aiData.technology_stack || aiData.technologyStack) === 'string'
    ? (aiData.technology_stack || aiData.technologyStack).split(',').map((t) => t.trim()).filter(Boolean)
    : []
  const timeline = Array.isArray(aiData.timeline)
    ? aiData.timeline
    : typeof aiData.timeline === 'string'
    ? [{ phase: 'Phase 1', duration: 'Full Project', description: aiData.timeline }]
    : []
  const maintenance = aiData.maintenance_support || aiData.maintenanceSupport || ''
  const termsConditions = Array.isArray(aiData.terms_conditions || aiData.termsConditions)
    ? (aiData.terms_conditions || aiData.termsConditions)
    : typeof (aiData.terms_conditions || aiData.termsConditions) === 'string'
    ? (aiData.terms_conditions || aiData.termsConditions).split('\n').filter(Boolean)
    : []
  const conclusion = aiData.conclusion || ''
  const assumptions = Array.isArray(aiData.assumptions)
    ? aiData.assumptions
    : typeof aiData.assumptions === 'string'
    ? aiData.assumptions.split('\n').filter(Boolean)
    : []

  // Convert markdown content into TipTap ProseMirror document
  const rawContentText = [
    execSummary ? `### 1. Executive Summary\n\n${execSummary}` : '',
    projectOverview ? `\n\n### 2. Project Overview\n\n${projectOverview}` : '',
    objectives.length > 0 ? `\n\n### 3. Project Objectives\n\n${objectives.map((o) => `• ${o}`).join('\n')}` : '',
    scopeOfWork.length > 0 ? `\n\n### 4. Scope of Work\n\n${scopeOfWork.map((s) => `• ${s}`).join('\n')}` : '',
    deliverables.length > 0 ? `\n\n### 5. Deliverables\n\n${deliverables.map((d) => `• ${d}`).join('\n')}` : '',
    techStack.length > 0 ? `\n\n### 6. Technology Stack\n\n${techStack.join(', ')}` : '',
    timeline.length > 0 ? `\n\n### 7. Timeline\n\n${timeline.map((t) => `${t.phase || 'Phase'} (${t.duration || 'TBD'}): ${t.description || ''}`).join('\n')}` : '',
    maintenance ? `\n\n### 8. Maintenance & SLA Support\n\n${maintenance}` : '',
    termsConditions.length > 0 ? `\n\n### 9. Commercial Terms & SLA\n\n${termsConditions.map((t) => `• ${t}`).join('\n')}` : '',
    conclusion ? `\n\n### 10. Conclusion\n\n${conclusion}` : '',
    assumptions.length > 0 ? `\n\n### Assumptions\n\n${assumptions.map((a) => `• ${a}`).join('\n')}` : '',
  ].filter(Boolean).join('\n\n')

  const docContent = aiData.content && aiData.content.type === 'doc'
    ? aiData.content
    : markdownToTipTapDoc(rawContentText || '', title)

  // Standardize pricing items to match pricingStore & calculateProposalTotals schema
  const rawItems = aiData.pricing_items || aiData.pricing?.items || []
  const standardizedItems = rawItems.length > 0
    ? rawItems.map((item, index) => ({
        id: `item-ai-${Date.now()}-${index + 1}`,
        description: item.description || `Deliverable Milestone ${index + 1}`,
        quantity: Number(item.quantity) || 1,
        unit: item.unit || 'Milestone',
        unitPrice: Number(item.unit_price ?? item.unitPrice ?? 0),
        discount: Number(item.discount_value ?? item.discount ?? 0),
        tax: Number(item.tax_rate ?? item.tax ?? 18),
        approved: true,
      }))
    : [
        {
          id: `item-ai-1`,
          description: 'Phase 1: Architecture Blueprint & Technical Discovery',
          quantity: 1,
          unit: 'Milestone',
          unitPrice: 150000,
          discount: 0,
          tax: 18,
          approved: true,
        },
        {
          id: `item-ai-2`,
          description: 'Phase 2: Core Platform Development & API Integration',
          quantity: 1,
          unit: 'Milestone',
          unitPrice: 350000,
          discount: 0,
          tax: 18,
          approved: true,
        },
        {
          id: `item-ai-3`,
          description: 'Phase 3: Production Cutover, UAT & 24/7 SLA Handover',
          quantity: 1,
          unit: 'Milestone',
          unitPrice: 250000,
          discount: 0,
          tax: 18,
          approved: true,
        },
      ]

  const paymentTerms = Array.isArray(aiData.payment_terms || aiData.paymentMilestones)
    ? (aiData.payment_terms || aiData.paymentMilestones).map((term, idx) => ({
        id: `term-${idx + 1}`,
        title: term.title || `Milestone ${idx + 1}`,
        percentage: Number(term.percentage || 0),
        due_description: term.due_description || term.dueDescription || '',
        dueDescription: term.due_description || term.dueDescription || '',
      }))
    : []

  const sections = {
    executiveSummary: execSummary,
    projectOverview,
    objectives: objectives.join('\n'),
    scopeOfWork: scopeOfWork.join('\n'),
    deliverables: deliverables.join('\n'),
    technologyStack: techStack.join(', '),
    timeline: timeline.map((t) => `${t.phase || 'Phase'} (${t.duration || 'TBD'}): ${t.description || ''}`).join('\n'),
    maintenanceSupport: maintenance,
    termsConditions: termsConditions.join('\n'),
    conclusion,
    assumptions: assumptions.join('\n'),
  }

  const sectionsRaw = {
    objectives,
    scopeOfWork,
    deliverables,
    technologyStack: techStack,
    timeline,
    termsConditions,
    assumptions,
  }

  return {
    id: `prop-${Date.now()}`,
    number: proposalNumber,
    title,
    projectName,
    serviceType,
    date: today,
    validUntil,
    status: 'draft',
    proposalType,
    showCompanyLogo: proposalType === 'direct',
    currency: defaultCurrency,
    client: {
      name: aiData.client?.name || aiData.client?.client_name || '',
      companyName: aiData.client?.companyName || aiData.client?.company_name || '',
      email: aiData.client?.email || '',
      phone: aiData.client?.phone || '',
      address: aiData.client?.address || '',
      taxNumber: aiData.client?.taxNumber || '',
    },
    company: { ...company },
    content: docContent,
    sections,
    sectionsRaw,
    pricingItems: standardizedItems,
    paymentTerms,
    pricing: {
      currency: defaultCurrency,
      globalDiscount: Number(aiData.pricing?.globalDiscount) || 0,
      items: standardizedItems,
    },
    notes: aiData.notes || 'Generated with ProposalOS AI Copilot. Please verify terms and commercial pricing before client distribution.',
    createdAt: new Date().toISOString(),
    isAiGenerated: true,
  }
}

/**
 * Parses markdown response text into structured proposal object with TipTap content
 */
export function parseProposalFromMarkdown(markdownText = '') {
  // Extract title if starts with # or ### 1.
  let title = 'Enterprise Commercial Offer'
  const titleMatch = markdownText.match(/^#\s+(.+)$/m) || markdownText.match(/###\s+(?:1\.\s+)?(.+)/m)
  if (titleMatch) {
    title = titleMatch[1].replace(/\*\*/g, '').trim()
  }

  // Extract executive summary, scope, deliverables
  const execMatch = markdownText.match(/###\s+(?:1\.\s+)?Executive Summary[\s\S]*?(?=###|$)/i)
  const scopeMatch = markdownText.match(/###\s+(?:2\.\s+)?(?:Scope|Project Scope)[\s\S]*?(?=###|$)/i)
  const delivMatch = markdownText.match(/###\s+(?:3\.\s+)?(?:Deliverables|Milestones)[\s\S]*?(?=###|$)/i)

  // Default pricing items
  const pricingItems = [
    {
      id: `item-1`,
      description: 'Phase 1: Architecture Discovery & Technical Blueprint',
      quantity: 1,
      unit: 'Milestone',
      unitPrice: 150000,
      tax: 18,
      approved: true,
    },
    {
      id: `item-2`,
      description: 'Phase 2: Platform Implementation & Core Integrations',
      quantity: 1,
      unit: 'Milestone',
      unitPrice: 320000,
      tax: 18,
      approved: true,
    },
    {
      id: `item-3`,
      description: 'Phase 3: Production Rollout, Security SLA & Handover',
      quantity: 1,
      unit: 'Milestone',
      unitPrice: 280000,
      tax: 18,
      approved: true,
    },
  ]

  const docContent = markdownToTipTapDoc(markdownText, title)

  return {
    title,
    proposalType: 'direct',
    currency: 'INR',
    content: docContent,
    sections: {
      executiveSummary: execMatch ? execMatch[0] : '',
      scopeOfWork: scopeMatch ? scopeMatch[0] : '',
      deliverables: delivMatch ? delivMatch[0] : '',
    },
    pricingItems,
  }
}
