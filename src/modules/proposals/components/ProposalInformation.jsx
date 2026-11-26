import { useState, useEffect, useMemo } from 'react'
import {
  FileText,
  RefreshCw,
  Layers,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  Tag,
  Cpu,
  X,
  Loader2,
} from 'lucide-react'
import { Input, DatePicker, Select } from '../../../components/common'
import { generateProposalNumber, PROPOSAL_STATUSES } from '../utils/proposalHelpers'
import {
  serviceTypeService,
  technologyService,
} from '../../../services/techservice.service'

export const ProposalInformation = ({
  proposal,
  onChange = () => {},
  className = '',
}) => {
  if (!proposal) return null

  // Live options from backend
  const [serviceTypes, setServiceTypes] = useState([])
  const [technologies, setTechnologies] = useState([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)

  useEffect(() => {
    let isMounted = true
    setIsLoadingOptions(true)

    Promise.all([
      serviceTypeService.getServiceTypes().catch(() => []),
      technologyService.getTechnologies().catch(() => []),
    ])
      .then(([stList, techList]) => {
        if (!isMounted) return
        setServiceTypes(Array.isArray(stList) ? stList : [])
        setTechnologies(Array.isArray(techList) ? techList : [])
      })
      .finally(() => {
        if (isMounted) setIsLoadingOptions(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleRegenerateNumber = () => {
    const fresh = generateProposalNumber([])
    onChange({ number: fresh })
  }

  const isB2B = proposal.proposalType === 'b2b' || proposal.showCompanyLogo === false

  const statusOptions = PROPOSAL_STATUSES.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  // Service Type options for Select dropdown
  const serviceTypeOptions = useMemo(() => {
    return serviceTypes.map((st) => ({
      value: st.id,
      label: st.name,
    }))
  }, [serviceTypes])

  // Current selected Service Type ID
  const selectedServiceTypeId = useMemo(() => {
    if (Array.isArray(proposal.service_type_ids) && proposal.service_type_ids.length > 0) {
      return Number(proposal.service_type_ids[0])
    }
    if (Array.isArray(proposal.serviceTypeIds) && proposal.serviceTypeIds.length > 0) {
      return Number(proposal.serviceTypeIds[0])
    }
    if (Array.isArray(proposal.service_types) && proposal.service_types.length > 0) {
      return Number(proposal.service_types[0]?.id || proposal.service_types[0])
    }
    if (proposal.serviceType && serviceTypes.length > 0) {
      const found = serviceTypes.find(
        (st) => st.name?.toLowerCase() === proposal.serviceType.toLowerCase()
      )
      if (found) return found.id
    }
    return ''
  }, [proposal.service_type_ids, proposal.serviceTypeIds, proposal.service_types, proposal.serviceType, serviceTypes])

  const handleServiceTypeChange = (selectedId) => {
    if (!selectedId) {
      onChange({
        serviceType: '',
        service_type_ids: [],
        serviceTypeIds: [],
        service_types: [],
      })
      return
    }
    const idNum = Number(selectedId)
    const found = serviceTypes.find((st) => Number(st.id) === idNum)
    const name = found ? found.name : ''
    onChange({
      serviceType: name,
      service_type_ids: [idNum],
      serviceTypeIds: [idNum],
      service_types: found ? [found] : [{ id: idNum, name }],
    })
  }

  // Selected technologies list
  const selectedTechList = useMemo(() => {
    const idSet = new Set()
    if (Array.isArray(proposal.technology_ids)) {
      proposal.technology_ids.forEach((id) => idSet.add(Number(id)))
    }
    if (Array.isArray(proposal.technologyIds)) {
      proposal.technologyIds.forEach((id) => idSet.add(Number(id)))
    }
    if (Array.isArray(proposal.technologies)) {
      proposal.technologies.forEach((t) => {
        if (typeof t === 'object' && t !== null && t.id) {
          idSet.add(Number(t.id))
        } else if (t) {
          idSet.add(Number(t))
        }
      })
    }

    const list = []
    idSet.forEach((id) => {
      const found = technologies.find((t) => Number(t.id) === id)
      if (found) {
        list.push(found)
      } else {
        const fromProp = Array.isArray(proposal.technologies)
          ? proposal.technologies.find((t) => Number(t?.id) === id)
          : null
        list.push({ id, name: fromProp?.name || `Technology #${id}` })
      }
    })
    return list
  }, [proposal.technology_ids, proposal.technologyIds, proposal.technologies, technologies])

  // Available technology options (excluding already selected)
  const availableTechOptions = useMemo(() => {
    const selectedIds = new Set(selectedTechList.map((t) => Number(t.id)))
    return technologies
      .filter((t) => !selectedIds.has(Number(t.id)))
      .map((t) => ({ value: t.id, label: t.name }))
  }, [technologies, selectedTechList])

  const handleAddTechnology = (techId) => {
    if (!techId) return
    const idNum = Number(techId)
    const existingIds = selectedTechList.map((t) => Number(t.id))
    if (!existingIds.includes(idNum)) {
      const nextIds = [...existingIds, idNum]
      const found = technologies.find((t) => Number(t.id) === idNum)
      const nextObjs = found
        ? [...selectedTechList, found]
        : [...selectedTechList, { id: idNum, name: `Tech #${idNum}` }]
      onChange({
        technology_ids: nextIds,
        technologyIds: nextIds,
        technologies: nextObjs,
      })
    }
  }

  const handleRemoveTechnology = (idToRemove) => {
    const nextList = selectedTechList.filter((t) => Number(t.id) !== Number(idToRemove))
    const nextIds = nextList.map((t) => Number(t.id))
    onChange({
      technology_ids: nextIds,
      technologyIds: nextIds,
      technologies: nextList,
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs space-y-6">
        {/* Card Header & Compact Toggle Option */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shrink-0">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                Proposal Information & Configuration
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Set document title, service type offering, tech stack deliverables, unique proposal ID, and branding.
              </p>
            </div>
          </div>

          {/* Instant Toggle Option: Direct Client vs B2B */}
          <div className="flex items-center gap-2 p-1 bg-gray-100/80 rounded-xl border border-gray-200 shrink-0 self-start lg:self-auto select-none">
            <button
              type="button"
              onClick={() => onChange({ proposalType: 'direct', showCompanyLogo: true })}
              title="Direct Client Proposal - Displays company logo on document header"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                !isB2B
                  ? 'bg-[#0055FF] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Direct (With Logo)</span>
            </button>
            <button
              type="button"
              onClick={() => onChange({ proposalType: 'b2b', showCompanyLogo: false })}
              title="B2B Partner Proposal - Hides company logo while preserving exact dimensions"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isB2B
                  ? 'bg-[#0055FF] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>B2B (No Logo)</span>
            </button>
          </div>
        </div>

        {/* 1. Core Engagement Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-[#0055FF]" />
            <span>Engagement & Deliverable Scope</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Proposal Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Proposal Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={proposal.title || ''}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="e.g. Enterprise Cloud Infrastructure & DevOps Modernization"
                required
              />
            </div>

            {/* Project / Engagement Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">
                Project Name / Phase
              </label>
              <Input
                value={proposal.projectName || ''}
                onChange={(e) => onChange({ projectName: e.target.value })}
                placeholder="e.g. Digital Modernization Phase 1"
                icon={Layers}
              />
            </div>

            {/* Service Type Selection Dropdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0055FF]" />
                  <span>Service Type Offering</span>
                  <span className="text-red-500">*</span>
                </label>
                {isLoadingOptions && (
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" /> Loading...
                  </span>
                )}
              </div>
              <Select
                options={serviceTypeOptions}
                value={selectedServiceTypeId}
                onChange={handleServiceTypeChange}
                placeholder="Select service type offering..."
                searchable
                clearable
              />
            </div>

            {/* Technology Stack Selection Dropdown */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Technology Stack / Deliverables</span>
                </label>
                <span className="text-[11px] text-gray-500 font-medium">
                  {selectedTechList.length === 0
                    ? 'No technologies selected'
                    : `${selectedTechList.length} selected`}
                </span>
              </div>
              <Select
                options={availableTechOptions}
                value=""
                onChange={handleAddTechnology}
                placeholder="Choose technologies from option list to add (e.g. React.js, TypeScript, Next.js, MySQL)..."
                searchable
              />

              {/* Selected Technology Badges / Pills */}
              {selectedTechList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {selectedTechList.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 border border-indigo-200/80 text-indigo-700 shadow-2xs transition-all hover:bg-indigo-100/60"
                    >
                      <Cpu className="w-3 h-3 text-indigo-500" />
                      <span>{t.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(t.id)}
                        className="text-indigo-400 hover:text-indigo-700 p-0.5 rounded-full hover:bg-indigo-200/50 cursor-pointer transition-colors"
                        title={`Remove ${t.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Document Schedule & Tracking Identifiers */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#0055FF]" />
            <span>Schedule & Reference Identifiers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Proposal Number (Read Only) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  Proposal ID <span className="text-gray-400 font-normal">(Read-Only)</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateNumber}
                  className="text-[11px] text-[#0055FF] hover:text-[#0044CC] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Generate new unique proposal number"
                >
                  <RefreshCw className="w-3 h-3" />
                  Auto-ID
                </button>
              </div>
              <Input
                value={proposal.number || ''}
                readOnly
                inputClassName="bg-gray-50/80 font-mono font-bold text-gray-700 cursor-default select-all focus:ring-0 focus:border-gray-200"
                placeholder="PROP-2026-001"
              />
            </div>

            {/* Issue Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={proposal.date || proposal.proposalDate || proposal.proposal_date}
                onChange={(d) => {
                  const updates = { date: d, proposal_date: d }
                  if (!proposal.validUntil && !proposal.valid_until && d) {
                    try {
                      const dt = new Date(d)
                      if (!isNaN(dt.getTime())) {
                        dt.setDate(dt.getDate() + 30)
                        updates.validUntil = dt.toISOString().split('T')[0]
                        updates.valid_until = updates.validUntil
                      }
                    } catch {}
                  }
                  onChange(updates)
                }}
                placeholder="Select date"
                required
              />
            </div>

            {/* Valid Until Date */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 block">
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  Expiry
                </span>
              </div>
              <DatePicker
                value={proposal.validUntil || proposal.valid_until}
                onChange={(d) => onChange({ validUntil: d, valid_until: d })}
                placeholder="Select expiration"
                required
              />
            </div>

            {/* Lifecycle Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">
                Proposal Lifecycle Status
              </label>
              <Select
                options={statusOptions}
                value={proposal.status || 'proposal_sent'}
                onChange={(val) => onChange({ status: val })}
                placeholder="Select status"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalInformation
