/**
 * ProposalOS AI Module - Context-Aware Prompt Builder
 * Assembles specialized system and user prompts injecting relevant proposal, client, and company context.
 */

/**
 * Sanitize and format context payload to send only strictly necessary fields
 */
export function formatContextPayload({ client = null, proposal = null, company = null, currentProposal = null }) {
  const activeProposal = proposal || currentProposal
  const lines = []

  if (company) {
    lines.push(`[Authoring Organization Details]:`)
    lines.push(`Company Name: ${company.name || 'ProposalOS Enterprise'}`)
    if (company.email) lines.push(`Email: ${company.email}`)
    if (company.phone) lines.push(`Phone: ${company.phone}`)
    if (company.website) lines.push(`Website: ${company.website}`)
  }

  if (client) {
    lines.push(`\n[Client & Target Organization Details]:`)
    lines.push(`Client Name: ${client.name || 'Valued Client'}`)
    lines.push(`Company / Account: ${client.companyName || client.name || 'Client Corporation'}`)
    if (client.email) lines.push(`Email: ${client.email}`)
    if (client.taxNumber) lines.push(`Tax ID / GSTIN: ${client.taxNumber}`)
    if (client.city) lines.push(`Location: ${client.city}`)
  }

  if (activeProposal) {
    lines.push(`\n[Active Proposal Context]:`)
    lines.push(`Title: ${activeProposal.title || 'Enterprise Commercial Offer'}`)
    lines.push(`Proposal Number: ${activeProposal.number || 'DRAFT'}`)
    lines.push(`Project Name: ${activeProposal.projectName || 'Technology Engagement'}`)
    lines.push(`Service Type: ${activeProposal.serviceType || 'Digital Modernization'}`)
    lines.push(`Type: ${activeProposal.proposalType === 'b2b' ? 'B2B White-Label (No Agency Logo)' : 'Direct Client'}`)
    lines.push(`Currency: ${activeProposal.currency || activeProposal.pricing?.currency || 'INR'}`)

    if (activeProposal.pricing?.items?.length) {
      lines.push(`\n[Current Pricing Deliverables]:`)
      activeProposal.pricing.items.forEach((it, i) => {
        lines.push(`- Item ${i + 1}: ${it.description} | Qty: ${it.quantity} ${it.unit} | Unit Price: ${it.unitPrice} | Tax: ${it.tax || 18}%`)
      })
    }
  }

  return lines.join('\n')
}

/**
 * Base System Prompt for ProposalOS AI
 */
export const SYSTEM_PROMPT = `You are ProposalOS AI Copilot, an elite enterprise proposal architect, commercial pricing strategist, and legal scope analyst.
Your primary role is generating high-converting, professional, physical A4-formatted business proposals, structured commercial quotes, and deliverables schedules.

Follow these strict output principles:
1. Enterprise Authority: Use confident, professional, and clear C-level language.
2. Structured Formatting: Use clean GitHub Flavored Markdown with bold key terms, bullet points, and markdown tables.
3. Realistic Financials: When providing pricing, default to INR (₹) or the requested transaction currency with realistic itemized tax breakdowns (e.g. 18% GST).
4. Physical Page Discipline: Format sections so they translate gracefully into calibrated A4 pages without awkward orphan blocks.
5. JSON Output on Demand: When structured data is requested, return valid JSON conforming to the requested schema. Never output markdown around raw JSON responses when JSON format is requested.`

/**
 * Prompt builders for specific ProposalOS actions
 */
export const promptBuilders = {
  generateCompleteProposal: ({ topic, clientName, companyName, budget, timeline, serviceType, currency = 'INR', proposalType = 'direct' }) => {
    return `Generate a comprehensive, end-to-end commercial proposal for the following project:
Project Title / Domain: ${topic || 'Enterprise Software Modernization'}
Client Name: ${clientName || 'Valued Client'}
Authoring Company: ${companyName || 'ProposalOS Solutions'}
Service Type: ${serviceType || 'Cloud Architecture & Digital Solutions'}
Budget Range: ${budget || 'Flexible / Estimated'}
Timeline: ${timeline || '3 - 6 Months'}
Target Currency: ${currency}
Proposal Format: ${proposalType === 'b2b' ? 'B2B White-Label' : 'Direct Client'}

Please provide:
1. Executive Summary & Value Proposition
2. Scope of Work & 4 Core Deliverable Milestones
3. Technical Architecture & Approach
4. Structured Commercial Deliverables Pricing Table (with Milestone, Qty, Unit Price, 18% Tax, Line Total)
5. Project Governance, Payment Terms & SLA Warranty`
  },

  generateExecutiveSummary: ({ projectTitle, clientName, painPoints, goals }) => {
    return `Draft a C-level Executive Summary for a proposal titled "${projectTitle || 'Enterprise Technology Solution'}".
Target Client: ${clientName || 'the client organization'}
Client Pain Points: ${painPoints || 'Legacy system bottlenecks, high latency, operational scaling challenges'}
Desired Outcomes: ${goals || '40% velocity increase, 99.99% SLA uptime, automated CI/CD and cost efficiency'}

Structure it with:
- The Strategic Imperative (Why now)
- Our Proposed Transformation Solution
- Quantifiable Business & Financial Impact (Bullet points with bold metrics)`
  },

  generateScopeOfWork: ({ serviceType, projectTitle, requirements }) => {
    return `Itemize a detailed Scope of Work (SOW) for "${projectTitle || 'Enterprise Engagement'}" focusing on "${serviceType || 'Technical Modernization'}".
Specific Requirements: ${requirements || 'Full lifecycle architecture, API integration, cloud deployment, security audit, and documentation'}

Structure into 3 sequential work packages with deliverables, technical dependencies, and client responsibilities.`
  },

  generatePricingMilestones: ({ projectScope, estimatedTotal, currency = 'INR' }) => {
    return `Recommend a structured commercial payment milestone schedule and itemized deliverables table for:
Scope: ${projectScope || 'Enterprise Cloud & Web Platform Modernization'}
Estimated Total Budget: ${estimatedTotal || '₹ 7,50,000'}
Currency: ${currency}

Provide a markdown table with columns:
| Milestone # | Deliverable Name | Description | Payment % | Net Amount | Tax (18%) | Total |

Follow standard enterprise milestone splits (e.g. 30% Mobilization, 30% Architecture/Alpha, 30% Beta/UAT, 10% Production Cutover).`
  },

  improveContent: ({ content, goal = 'professional' }) => {
    const goals = {
      professional: 'Refine tone to be more executive, authoritative, and persuasive.',
      concise: 'Make this content crisp, concise, and eliminate redundancies while keeping all facts.',
      expand: 'Expand on the technical depth, commercial value, and risk mitigation strategies.',
      persuasive: 'Make this sound like a high-converting winning sales proposal.',
    }
    return `Please rewrite and enhance the following proposal text:
Goal: ${goals[goal] || goals.professional}

Original Text:
"""
${content}
"""`
  },

  reviewProposal: ({ proposalText }) => {
    return `Conduct a rigorous commercial and technical review of this proposal:
"""
${proposalText}
"""

Provide an executive critique covering:
1. Strengths & Persuasiveness Score (1-10)
2. Ambiguities or Missing Scope Risks
3. Commercial & Payment Terms Recommendations
4. Concrete Actionable Suggestions to Improve Win Rate`
  },
}
