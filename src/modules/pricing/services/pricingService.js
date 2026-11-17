import api from '../../../services/api'
import { calculatePricingSummary } from '../utils/pricingCalculations'

const STORAGE_KEY_PRICING_PRESETS = 'proposal_pricing_presets'

/**
 * Standard Deliverable Item Presets
 */
export const DEFAULT_ITEM_PRESETS = [
  {
    description: 'System Architecture & Technical Discovery',
    quantity: 1,
    unit: 'Milestone',
    unitPrice: 120000,
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 18,
  },
  {
    description: 'Cloud Infrastructure & Microservices API Setup',
    quantity: 1,
    unit: 'Milestone',
    unitPrice: 280000,
    discountType: 'percentage',
    discountValue: 5,
    taxRate: 18,
  },
  {
    description: 'Web Application & Responsive UI Implementation',
    quantity: 1,
    unit: 'Milestone',
    unitPrice: 350000,
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 18,
  },
  {
    description: 'Senior Software Engineer (Hourly Retainer)',
    quantity: 80,
    unit: 'Hours',
    unitPrice: 3500,
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 18,
  },
  {
    description: 'UI/UX Interactive Prototyping & Design System',
    quantity: 1,
    unit: 'Package',
    unitPrice: 150000,
    discountType: 'fixed',
    discountValue: 15000,
    taxRate: 18,
  },
  {
    description: 'Quality Assurance, Load Testing & Security Audit',
    quantity: 1,
    unit: 'Service',
    unitPrice: 95000,
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 18,
  },
  {
    description: 'Post-Launch SLA Support & Dedicated Maintenance',
    quantity: 3,
    unit: 'Month',
    unitPrice: 45000,
    discountType: 'percentage',
    discountValue: 10,
    taxRate: 18,
  },
]

/**
 * Standard Milestone Template Presets
 */
export const DEFAULT_MILESTONE_PRESETS = [
  {
    name: '3-Stage Standard Project',
    milestones: [
      { id: 'm-1', name: 'Project Kickoff & Advance', type: 'percentage', value: 40 },
      { id: 'm-2', name: 'Beta Delivery & User Acceptance', type: 'percentage', value: 40 },
      { id: 'm-3', name: 'Final Production Deployment', type: 'percentage', value: 20 },
    ],
  },
  {
    name: '50-50 Split',
    milestones: [
      { id: 'm-1', name: 'Initial Deposit / Advance', type: 'percentage', value: 50 },
      { id: 'm-2', name: 'Project Completion & Handover', type: 'percentage', value: 50 },
    ],
  },
  {
    name: 'Monthly Retainer Model',
    milestones: [
      { id: 'm-1', name: 'Month 1 Advance Retainer', type: 'percentage', value: 33.33 },
      { id: 'm-2', name: 'Month 2 Retainer', type: 'percentage', value: 33.33 },
      { id: 'm-3', name: 'Month 3 Retainer', type: 'percentage', value: 33.34 },
    ],
  },
]

export const pricingService = {
  /**
   * Fetch pricing details for a proposal from API or fallback
   */
  async getPricing(proposalId) {
    try {
      const response = await api.get(`/proposals/${proposalId}/pricing`)
      return response.data?.data || response.data
    } catch {
      return null
    }
  },

  /**
   * Save or sync pricing for a proposal
   */
  async savePricing(proposalId, pricingData) {
    try {
      const response = await api.put(`/proposals/${proposalId}/pricing`, pricingData)
      return response.data?.data || response.data
    } catch {
      return pricingData
    }
  },

  /**
   * Get user-saved item presets from localStorage or defaults
   */
  getPresets() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRICING_PRESETS)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // fallback
    }
    return DEFAULT_ITEM_PRESETS
  },

  /**
   * Save new preset item to local library
   */
  savePreset(item) {
    try {
      const presets = this.getPresets()
      const updated = [item, ...presets]
      localStorage.setItem(STORAGE_KEY_PRICING_PRESETS, JSON.stringify(updated))
      return updated
    } catch {
      return DEFAULT_ITEM_PRESETS
    }
  },

  /**
   * Calculate summary helper exposed on service
   */
  calculate(pricingData) {
    return calculatePricingSummary(pricingData)
  },
}

export default pricingService
