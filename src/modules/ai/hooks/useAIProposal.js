/**
 * ProposalOS AI Module - useAIProposal Hook
 * Manages guided AI proposal generation, section preview, approval workflow, and ProposalOS store integration.
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import proposalAIService from '../services/proposalAIService'
import useProposalStore from '../../proposals/store/proposalStore'
import useAIStore from '../store/aiStore'

export function useAIProposal() {
  const navigate = useNavigate()
  const { proposals, fetchProposals } = useProposalStore()
  const { selectedModelId } = useAIStore()

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0) // 0: Idle, 1: Blueprint, 2: Scope, 3: Pricing, 4: Ready
  const [generatedProposal, setGeneratedProposal] = useState(null)
  const [approvedSections, setApprovedSections] = useState({
    executiveSummary: true,
    scopeOfWork: true,
    deliverables: true,
    pricing: true,
  })
  const [approvedPricingItems, setApprovedPricingItems] = useState([])
  const [error, setError] = useState(null)

  const generateProposal = useCallback(
    async (formData) => {
      setIsGenerating(true)
      setError(null)
      setGenerationStep(1)

      try {
        // Step 1: Blueprint synthesis
        setGenerationStep(1)
        await new Promise((r) => setTimeout(r, 400))

        // Step 2: Scope generation
        setGenerationStep(2)
        await new Promise((r) => setTimeout(r, 400))

        // Step 3: Pricing calculation
        setGenerationStep(3)
        const result = await proposalAIService.generateCompleteProposal({
          ...formData,
          modelId: selectedModelId,
          existingProposals: proposals,
        })

        // Step 4: Final validation & ready
        setGeneratedProposal(result)
        const initialPricingApproved = (result.pricing?.items || []).map((it) => it.id)
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

  const togglePricingItemApproval = (itemId) => {
    setApprovedPricingItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  /**
   * Imports the generated & approved proposal directly into ProposalOS proposal store
   */
  const importIntoProposalOS = async (redirectTo = 'preview') => {
    if (!generatedProposal) return

    // Filter pricing items to only approved ones
    const filteredItems = (generatedProposal.pricing?.items || []).filter((it) =>
      approvedPricingItems.includes(it.id)
    )

    const finalProposal = {
      ...generatedProposal,
      pricing: {
        ...generatedProposal.pricing,
        items: filteredItems,
      },
      updatedAt: new Date().toISOString(),
    }

    try {
      // Save to localStorage proposal storage
      const storageKey = 'proposal_os_proposals'
      const raw = localStorage.getItem(storageKey)
      const list = raw ? JSON.parse(raw) : []
      list.unshift(finalProposal)
      localStorage.setItem(storageKey, JSON.stringify(list))

      // Refresh proposal store
      await fetchProposals()

      // Navigate to existing Preview or Edit page
      if (redirectTo === 'edit') {
        navigate(`/proposals/${finalProposal.id}/edit`)
      } else {
        navigate(`/proposals/${finalProposal.id}/preview`)
      }

      return finalProposal
    } catch (err) {
      setError(`Failed to import proposal: ${err.message}`)
    }
  }

  const resetGeneration = () => {
    setGeneratedProposal(null)
    setGenerationStep(0)
    setError(null)
  }

  return {
    isGenerating,
    generationStep,
    generatedProposal,
    approvedSections,
    approvedPricingItems,
    error,
    generateProposal,
    toggleSectionApproval,
    togglePricingItemApproval,
    importIntoProposalOS,
    resetGeneration,
  }
}

export default useAIProposal
