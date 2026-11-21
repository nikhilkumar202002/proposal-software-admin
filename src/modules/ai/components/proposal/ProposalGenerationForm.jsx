import { useState } from 'react'
import {
  Sparkles,
  IndianRupee,
  Calendar,
} from 'lucide-react'
import { useClientStore } from '../../../clients/store/clientStore'

const SERVICE_PRESETS = [
  'Enterprise Cloud & DevOps Migration',
  'Full-Stack Custom SaaS Platform',
  'AI & Generative Chatbot Integration',
  'UI/UX Redesign & Design System',
  'Cybersecurity & ISO 27001 Audit',
  'Mobile App Development (iOS & Android)',
]

export default function ProposalGenerationForm({
  onSubmit,
  isGenerating = false,
  initialValues = {},
}) {
  const { clients } = useClientStore()

  const [formData, setFormData] = useState({
    title: initialValues.title || 'Enterprise Digital Modernization Proposal',
    clientId: initialValues.clientId || (clients[0]?.id || ''),
    clientName: initialValues.clientName || (clients[0]?.name || clients[0]?.companyName || 'Valued Client'),
    proposalType: initialValues.proposalType || 'direct', // 'direct' | 'b2b'
    serviceType: initialValues.serviceType || 'Enterprise Cloud & DevOps Migration',
    budgetEstimate: initialValues.budgetEstimate || '₹ 7,50,000 - ₹ 12,00,000',
    timeline: initialValues.timeline || '12 Weeks (3 Sprints)',
    requirements:
      initialValues.requirements ||
      'Migrate legacy monolithic systems to a scalable microservices architecture with AWS Kubernetes, automated CI/CD pipelines, ISO 27001 compliance, and 99.99% uptime SLA.',
    milestoneCount: 3,
  })

  const handleClientChange = (e) => {
    const cid = e.target.value
    const selected = clients.find((c) => String(c.id) === String(cid))
    setFormData((prev) => ({
      ...prev,
      clientId: cid,
      clientName: selected?.name || selected?.companyName || 'Valued Client',
    }))
  }

  const handlePresetSelect = (preset) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: preset,
      title: `${preset} Proposal`,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0055FF] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              AI Proposal Generator Wizard
            </h3>
            <p className="text-xs text-slate-500">
              Configure parameters to draft a structured proposal ready for TipTap
            </p>
          </div>
        </div>

        {/* Proposal Type Toggle */}
        <div className="flex p-1 rounded-xl bg-slate-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, proposalType: 'direct' })}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              formData.proposalType === 'direct'
                ? 'bg-[#0055FF] text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Direct Client
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, proposalType: 'b2b' })}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              formData.proposalType === 'b2b'
                ? 'bg-[#0055FF] text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            B2B Partner
          </button>
        </div>
      </div>

      {/* Quick Service Presets */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Select Industry Blueprint
        </label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className={`px-3 py-1.5 text-xs rounded-xl border transition-all cursor-pointer ${
                formData.serviceType === preset
                  ? 'border-[#0055FF] bg-blue-50 text-[#0055FF] font-semibold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Proposal Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Proposal Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0055FF]"
          />
        </div>

        {/* Client Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Client *
          </label>
          <select
            value={formData.clientId}
            onChange={handleClientChange}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0055FF]"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.companyName || `Client #${c.id}`}
              </option>
            ))}
            {clients.length === 0 && <option value="">Valued Enterprise Client</option>}
          </select>
        </div>

        {/* Budget Estimate */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Commercial Budget Range (INR)
          </label>
          <div className="relative">
            <IndianRupee className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={formData.budgetEstimate}
              onChange={(e) => setFormData({ ...formData, budgetEstimate: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0055FF]"
            />
          </div>
        </div>

        {/* Delivery Timeline */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Timeline
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0055FF]"
            />
          </div>
        </div>
      </div>

      {/* Project Scope & Requirements */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Detailed Requirements & Key Objectives *
        </label>
        <textarea
          rows={4}
          required
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          placeholder="Specify deliverables, tech stack preferences, compliance requirements, and specific client pain points..."
          className="w-full p-3.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0055FF] leading-relaxed"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex items-center justify-end">
        <button
          type="submit"
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0055FF] hover:bg-[#0044CC] text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Generating Structured Proposal...' : 'Generate Full Proposal Blueprint'}</span>
        </button>
      </div>
    </form>
  )
}
