import api from '../../../services/api'
import {
  createNewProposalModel,
  DEFAULT_COMPANY_DETAILS,
} from '../utils/proposalHelpers'

const STORAGE_KEY = 'proposalos_proposals_data'

/**
 * Seed initial sample proposals for offline / standalone mode
 */
function getInitialSeedProposals() {
  const p1 = createNewProposalModel([])
  p1.id = 'prop-2026-081'
  p1.number = 'PROP-2026-081'
  p1.title = 'Enterprise Cloud Infrastructure Modernization'
  p1.projectName = 'Cloud DevOps & High Availability'
  p1.status = 'signed'
  p1.currency = 'INR'
  p1.client = {
    name: 'Mark Henderson',
    companyName: 'Acme Technologies Inc.',
    email: 'mark@acme.io',
    phone: '+1 (555) 382-9102',
    address: '100 Montgomery St, Suite 1200, San Francisco, CA 94104',
    taxNumber: 'US-EIN-94301928',
  }
  p1.company = { ...DEFAULT_COMPANY_DETAILS }
  p1.pricing = {
    currency: 'INR',
    globalDiscount: 0,
    items: [
      { id: '1', description: 'Terraform Multi-Zone Architecture', quantity: 1, unit: 'Milestone', unitPrice: 180000, discount: 0, tax: 18 },
      { id: '2', description: 'Kubernetes Cluster Provisioning', quantity: 1, unit: 'Milestone', unitPrice: 160000, discount: 0, tax: 18 },
    ],
  }

  const p2 = createNewProposalModel([p1])
  p2.id = 'prop-2026-080'
  p2.number = 'PROP-2026-080'
  p2.title = 'Enterprise Brand Identity & Design System'
  p2.projectName = 'UI/UX Redesign'
  p2.status = 'viewed'
  p2.currency = 'INR'
  p2.client = {
    name: 'Rohan Mehta',
    companyName: 'Apex Global Corp',
    email: 'rohan.mehta@apexglobal.com',
    phone: '+91 98201 12345',
    address: 'Level 14, Commercial Plaza, Bandra-Kurla Complex, Mumbai',
    taxNumber: '27AAACE5678B1Z2',
  }
  p2.pricing = {
    currency: 'INR',
    globalDiscount: 5,
    items: [
      { id: '1', description: 'Design System & Component Library', quantity: 1, unit: 'Package', unitPrice: 195000, discount: 5, tax: 18 },
    ],
  }

  const p3 = createNewProposalModel([p1, p2])
  p3.id = 'prop-2026-079'
  p3.number = 'PROP-2026-079'
  p3.title = 'Custom AI Automation & Agent Pipeline'
  p3.projectName = 'Intelligent Processing'
  p3.status = 'under_review'
  p3.currency = 'INR'
  p3.client = {
    name: 'Sarah Jenkins',
    companyName: 'NextEra Logistics Ltd.',
    email: 's.jenkins@nextera.co',
    phone: '+44 20 7946 0912',
    address: '30 St Mary Axe, City of London, London EC3A 8EP',
    taxNumber: 'GB-VAT-99281726',
  }

  const p4 = createNewProposalModel([p1, p2, p3])
  p4.id = 'prop-2026-078'
  p4.number = 'PROP-2026-078'
  p4.title = 'Cybersecurity Audit & Compliance Review'
  p4.projectName = 'SOC 2 Type II Readiness'
  p4.status = 'draft'
  p4.currency = 'INR'
  p4.client = {
    name: 'David Miller',
    companyName: 'Starlight Financial',
    email: 'dmiller@starlight.finance',
    phone: '+91 98111 22334',
    address: 'Connaught Place, New Delhi 110001',
    taxNumber: '07AAACS4321D1Z4',
  }

  return [p1, p2, p3, p4]
}

function loadLocalProposals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.error('Error reading localStorage proposals:', err)
  }
  const seeds = getInitialSeedProposals()
  saveLocalProposals(seeds)
  return seeds
}

function saveLocalProposals(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (err) {
    console.error('Error saving to localStorage:', err)
  }
}

export const proposalService = {
  /**
   * GET /api/proposals
   * List all proposals with optional query params (search, status)
   */
  async getProposals(params = {}) {
    try {
      const res = await api.get('/proposals', { params })
      return res.data?.data || res.data
    } catch (err) {
      console.warn('API /api/proposals unreachable, using local store:', err.message)
      let list = loadLocalProposals()
      if (params.search) {
        const q = params.search.toLowerCase()
        list = list.filter(
          (p) =>
            p.title?.toLowerCase().includes(q) ||
            p.number?.toLowerCase().includes(q) ||
            p.client?.name?.toLowerCase().includes(q) ||
            p.client?.companyName?.toLowerCase().includes(q)
        )
      }
      if (params.status && params.status !== 'all') {
        list = list.filter((p) => p.status === params.status)
      }
      return list
    }
  },

  /**
   * GET /api/proposals/{id}
   * Fetch single proposal details
   */
  async getProposal(id) {
    try {
      const res = await api.get(`/proposals/${id}`)
      return res.data?.data || res.data
    } catch (err) {
      console.warn(`API /api/proposals/${id} unreachable, searching local store:`, err.message)
      const list = loadLocalProposals()
      const found = list.find((p) => String(p.id) === String(id) || p.number === id)
      if (!found) {
        throw new Error(`Proposal with ID ${id} not found`, { cause: err })
      }
      return found
    }
  },

  /**
   * POST /api/proposals
   * Create new proposal
   */
  async createProposal(proposalData) {
    try {
      const res = await api.post('/proposals', proposalData)
      return res.data?.data || res.data
    } catch (err) {
      console.warn('API /api/proposals [POST] unreachable, creating in local store:', err.message)
      const list = loadLocalProposals()
      const newProposal = {
        ...createNewProposalModel(list),
        ...proposalData,
        id: proposalData.id || `prop-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      list.unshift(newProposal)
      saveLocalProposals(list)
      return newProposal
    }
  },

  /**
   * PUT /api/proposals/{id}
   * Update existing proposal
   */
  async updateProposal(id, updates) {
    try {
      const res = await api.put(`/proposals/${id}`, updates)
      return res.data?.data || res.data
    } catch (err) {
      console.warn(`API /api/proposals/${id} [PUT] unreachable, updating in local store:`, err.message)
      const list = loadLocalProposals()
      const index = list.findIndex((p) => String(p.id) === String(id) || p.number === id)
      if (index === -1) {
        throw new Error(`Proposal ${id} not found`, { cause: err })
      }
      const updated = {
        ...list[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      list[index] = updated
      saveLocalProposals(list)
      return updated
    }
  },

  /**
   * DELETE /api/proposals/{id}
   * Delete proposal
   */
  async deleteProposal(id) {
    try {
      const res = await api.delete(`/proposals/${id}`)
      return res.data
    } catch (err) {
      console.warn(`API /api/proposals/${id} [DELETE] unreachable, deleting in local store:`, err.message)
      let list = loadLocalProposals()
      list = list.filter((p) => String(p.id) !== String(id) && p.number !== id)
      saveLocalProposals(list)
      return { success: true }
    }
  },

  /**
   * POST /api/proposals/{id}/duplicate
   * Clone proposal with new proposal number and draft status
   */
  async duplicateProposal(id) {
    try {
      const res = await api.post(`/proposals/${id}/duplicate`)
      return res.data?.data || res.data
    } catch (err) {
      console.warn(`API /api/proposals/${id}/duplicate unreachable, duplicating in local store:`, err.message)
      const list = loadLocalProposals()
      const source = list.find((p) => String(p.id) === String(id) || p.number === id)
      if (!source) throw new Error(`Source proposal ${id} not found`, { cause: err })

      const year = new Date().getFullYear()
      const newNumber = `PROP-${year}-${String(list.length + 1).padStart(3, '0')}-COPY`

      const clone = {
        ...JSON.parse(JSON.stringify(source)),
        id: `prop-${Date.now()}`,
        number: newNumber,
        title: `${source.title} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      list.unshift(clone)
      saveLocalProposals(list)
      return clone
    }
  },

  /**
   * POST /api/proposals/{id}/pdf
   * Generate or download PDF
   */
  async downloadPdf(id, proposalData = null) {
    try {
      const response = await api.post(
        `/proposals/${id}/pdf`,
        proposalData ? { proposal: proposalData } : {},
        { responseType: 'blob' }
      )
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Proposal-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      return { success: true }
    } catch (err) {
      console.warn('Backend PDF endpoint unavailable, falling back to print dialog:', err.message)
      window.print()
      return { success: true, method: 'print' }
    }
  },
}

export default proposalService
