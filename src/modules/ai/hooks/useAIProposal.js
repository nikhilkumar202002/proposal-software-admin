/**
 * ProposalOS AI Module - useAIProposal Hook
 * Manages guided AI proposal generation, section preview, approval workflow, and ProposalOS store integration.
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import proposalAIService from '../services/proposalAIService'
import proposalService from '../../../services/proposal.service'
import useProposalStore from '../../proposals/store/proposalStore'
import useAIStore from '../store/aiStore'
import { markdownToTipTapDoc } from '../utils/proposalConverter'

export function useAIProposal() {
  const navigate = useNavigate()
  const { proposals, fetchProposals, addProposal } = useProposalStore()
  const { selectedModelId } = useAIStore()

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0) // 0: Idle, 1: Blueprint, 2: Scope, 3: Pricing, 4: Ready
  const [generatedProposal, setGeneratedProposal] = useState(null)
  const [approvedSections, setApprovedSections] = useState({
    executiveSummary: true,
    projectOverview: true,
    objectives: true,
    scopeOfWork: true,
    deliverables: true,
    technologyStack: true,
    timeline: true,
    pricing: true,
    maintenanceSupport: true,
    termsConditions: true,
    conclusion: true,
    assumptions: true,
  })
  const [approvedPricingItems, setApprovedPricingItems] = useState([])
  const [regeneratingSectionKey, setRegeneratingSectionKey] = useState(null)
  const [isSavingToBackend, setIsSavingToBackend] = useState(false)
  const [error, setError] = useState(null)

  const generateProposal = useCallback(
    async (formData) => {
      setIsGenerating(true)
      setError(null)
      setGenerationStep(1)

      try {
        setGenerationStep(1)
        await new Promise((r) => setTimeout(r, 300))

        setGenerationStep(2)
        await new Promise((r) => setTimeout(r, 300))

        setGenerationStep(3)
        const result = await proposalAIService.generateCompleteProposal({
          ...formData,
          prompt: formData.requirements || formData.prompt || '',
          modelId: selectedModelId,
          existingProposals: proposals,
        })

        setGeneratedProposal(result)
        const initialPricingApproved = (result.pricingItems || result.pricing?.items || []).map((it) => it.id)
        setApprovedPricingItems(initialPricingApproved)
        setGenerationStep(4)
      } catch (err) {
        setError(err.message || 'Failed to synthesize proposal with AI.')
        setGenerationStep(0)
      } finally {
        setIsGenerating(false)
      }
    },
    [selectedModelId, proposals]
  )

  const toggleSectionApproval = (sectionKey) => {
    setApprovedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const updateSectionContent = (sectionKey, newContent) => {
    if (!generatedProposal) return
    setGeneratedProposal((prev) => {
      const updatedSections = {
        ...prev.sections,
        [sectionKey]: newContent,
      }
      return {
        ...prev,
        sections: updatedSections,
      }
    })
  }

  const regenerateSection = async (sectionKey, userPrompt = '') => {
    if (!generatedProposal) return
    setRegeneratingSectionKey(sectionKey)
    try {
      const context = generatedProposal.sections?.[sectionKey] || ''
      const rewritten = await proposalAIService.regenerateSection({
        section: sectionKey,
        context,
        prompt: userPrompt,
        proposalTitle: generatedProposal.title,
        modelId: selectedModelId,
      })

      if (rewritten) {
        updateSectionContent(sectionKey, rewritten)
      }
    } catch (err) {
      console.error(`Failed to regenerate section [${sectionKey}]:`, err)
    } finally {
      setRegeneratingSectionKey(null)
    }
  }

  const togglePricingItemApproval = (itemId) => {
    setApprovedPricingItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const approveAllPricing = () => {
    if (!generatedProposal) return
    const allIds = (generatedProposal.pricingItems || generatedProposal.pricing?.items || []).map((it) => it.id)
    setApprovedPricingItems(allIds)
  }

  const updatePricingItem = (indexOrId, updates) => {
    if (!generatedProposal) return
    setGeneratedProposal((prev) => {
      const items = [...(prev.pricingItems || prev.pricing?.items || [])]
      const idx = typeof indexOrId === 'number' ? indexOrId : items.findIndex((it) => it.id === indexOrId)
      if (idx === -1) return prev

      items[idx] = {
        ...items[idx],
        ...updates,
      }

      // Recalculate line total
      const qty = Number(items[idx].quantity || 1)
      const price = Number(items[idx].unitPrice || items[idx].unit_price || 0)
      const taxRate = Number(items[idx].tax || items[idx].tax_rate || 0)
      items[idx].total = qty * price * (1 + taxRate / 100)

      return {
        ...prev,
        pricingItems: items,
        pricing: {
          ...prev.pricing,
          items,
        },
      }
    })
  }

  const updateCurrency = (newCurrency) => {
    if (!generatedProposal) return
    setGeneratedProposal((prev) => ({
      ...prev,
      currency: newCurrency,
      pricing: {
        ...prev.pricing,
        currency: newCurrency,
      },
    }))
  }

  const updateDeliverables = (newDeliverablesList) => {
    if (!generatedProposal) return
    setGeneratedProposal((prev) => ({
      ...prev,
      sectionsRaw: {
        ...prev.sectionsRaw,
        deliverables: newDeliverablesList,
      },
      sections: {
        ...prev.sections,
        deliverables: newDeliverablesList.join('\n'),
      },
    }))
  }

  const updateTechnologies = (newTechList) => {
    if (!generatedProposal) return
    setGeneratedProposal((prev) => ({
      ...prev,
      sectionsRaw: {
        ...prev.sectionsRaw,
        technologyStack: newTechList,
      },
      sections: {
        ...prev.sections,
        technologyStack: newTechList.join(', '),
      },
    }))
  }

  const updateTimeline = (newTimelineList) => {
    if (!generatedProposal) return
    setGeneratedProposal((prev) => ({
      ...prev,
      sectionsRaw: {
        ...prev.sectionsRaw,
        timeline: newTimelineList,
      },
      sections: {
        ...prev.sections,
        timeline: newTimelineList.map((t) => `${t.phase || 'Phase'} (${t.duration || 'TBD'}): ${t.description || ''}`).join('\n'),
      },
    }))
  }

  /**
   * Imports the generated & approved proposal directly into ProposalOS backend and store
   */
  const importIntoProposalOS = async (redirectTo = 'preview') => {
    if (!generatedProposal) return
    setIsSavingToBackend(true)
    setError(null)

    // Filter pricing items to only approved ones
    const filteredItems = (generatedProposal.pricingItems || generatedProposal.pricing?.items || []).filter((it) =>
      approvedPricingItems.includes(it.id)
    )

    const finalPricing = {
      ...generatedProposal.pricing,
      items: filteredItems,
    }

    // Assemble payload for backend POST /api/proposals
    const payload = {
      title: generatedProposal.title || 'AI Generated Proposal',
      proposal_type: generatedProposal.proposalType || 'direct',
      client_id: Number(generatedProposal.client?.id || generatedProposal.clientId || 1),
      proposal_date: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: generatedProposal.currency || 'USD',
      content: generatedProposal.content || markdownToTipTapDoc('', generatedProposal.title),
      items: filteredItems.map((it, idx) => ({
        description: it.description || `Milestone ${idx + 1}`,
        quantity: Number(it.quantity || 1),
        unit: it.unit || 'Milestone',
        unit_price: Number(it.unitPrice ?? it.unit_price ?? 0),
        tax_rate: Number(it.tax ?? it.tax_rate ?? 18),
        discount_value: Number(it.discount ?? it.discount_value ?? 0),
      })),
      payment_milestones: (generatedProposal.paymentTerms || generatedProposal.paymentMilestones || []).map((term, idx) => ({
        title: term.title || `Milestone ${idx + 1}`,
        percentage: Number(term.percentage || 0),
        due_description: term.due_description || term.dueDescription || '',
      })),
    }

    try {
      // 1. Save to Laravel MySQL Backend API
      let savedProposal
      try {
        savedProposal = await proposalService.createProposal(payload)
      } catch (apiErr) {
        console.warn('Backend proposal creation failed, saving to local state:', apiErr)
        savedProposal = {
          ...generatedProposal,
          id: `prop-${Date.now()}`,
          number: `PROP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
          status: 'draft',
          pricing: finalPricing,
          date: payload.proposal_date,
          validUntil: payload.valid_until,
        }
      }

      // 2. Add to Zustand proposalStore
      if (addProposal) {
        addProposal(savedProposal)
      }

      // 3. Navigate
      const targetId = savedProposal.id || savedProposal.number
      if (redirectTo === 'edit' || redirectTo === 'editor') {
        navigate(`/proposals/${targetId}/edit`)
      } else {
        navigate(`/proposals/${targetId}/preview`)
      }

      return savedProposal
    } catch (err) {
      setError(`Failed to import proposal: ${err.message}`)
      throw err
    } finally {
      setIsSavingToBackend(false)
    }
  }

  const resetGeneration = () => {
    setGeneratedProposal(null)
    setGenerationStep(0)
    setError(null)
    setApprovedPricingItems([])
  }

  return {
    isGenerating,
    generationStep,
    currentStep: generationStep,
    generatedProposal,
    proposalData: generatedProposal,
    approvedSections,
    approvedPricingItems,
    regeneratingSectionKey,
    isSavingToBackend,
    error,
    generateProposal,
    toggleSectionApproval,
    updateSectionContent,
    regenerateSection,
    togglePricingItemApproval,
    approveAllPricing,
    updatePricingItem,
    updateCurrency,
    updateDeliverables,
    updateTechnologies,
    updateTimeline,
    importIntoProposalOS,
    resetGeneration,
    resetProposal: resetGeneration,
  }
}

export default useAIProposal
