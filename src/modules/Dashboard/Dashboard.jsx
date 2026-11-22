import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  Filter,
  Eye,
  Edit3,
  Users,
  Building2,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
} from 'lucide-react'
import { useProposalStore } from '../proposals/store/proposalStore'
import { useClientStore } from '../clients/store/clientStore'
import { StatusBadge, Button, Input } from '../../components/common'
import {
  formatCurrency,
  calculateProposalTotals,
  getProposalStatusConfig,
} from '../proposals/utils/proposalHelpers'

export const Dashboard = () => {
  const navigate = useNavigate()
  const { proposals, fetchProposals, isLoading: isProposalsLoading } = useProposalStore()
  const { clients, fetchClients } = useClientStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Initial load and 5-second background refresh (without loading spinner)
  useEffect(() => {
    fetchProposals()
    fetchClients()

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      fetchProposals({}, { silent: true })
      fetchClients({}, { silent: true })
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchProposals, fetchClients])

  // Computed metrics from real proposals
  const metrics = useMemo(() => {
    const list = Array.isArray(proposals) ? proposals : []

    let totalPipelineValue = 0
    let wonRevenue = 0
    let awaitingSignatureCount = 0
    let signedCount = 0
    let directCount = 0
    let b2bCount = 0

    list.forEach((p) => {
      const totals = calculateProposalTotals(p.pricing || {})
      const grandTotal = totals.grandTotal || 0

      if (p.status === 'signed' || p.status === 'approved' || p.status === 'accepted') {
        wonRevenue += grandTotal
        signedCount += 1
      } else if (p.status !== 'rejected' && p.status !== 'declined' && p.status !== 'expired') {
        totalPipelineValue += grandTotal
        if (p.status === 'sent' || p.status === 'viewed' || p.status === 'under_review') {
          awaitingSignatureCount += 1
        }
      }

      if (p.proposalType === 'b2b' || p.showCompanyLogo === false) {
        b2bCount += 1
      } else {
        directCount += 1
      }
    })

    const winRate =
      list.length > 0 ? Math.round((signedCount / list.length) * 100) : 0

    return {
      totalCount: list.length,
      totalPipelineValue,
      wonRevenue,
      awaitingSignatureCount,
      signedCount,
      winRate,
      directCount,
      b2bCount,
    }
  }, [proposals])

  // Filtered recent proposals for the pipeline table
  const filteredProposals = useMemo(() => {
    let list = Array.isArray(proposals) ? [...proposals] : []

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.number?.toLowerCase().includes(q) ||
          p.client?.name?.toLowerCase().includes(q) ||
          p.client?.companyName?.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter)
    }

    // Sort by recent first
    list.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    return list
  }, [proposals, searchQuery, statusFilter])

  // Top clients list
  const recentClients = useMemo(() => {
    const list = Array.isArray(clients) ? [...clients] : []
    return list.slice(0, 4)
  }, [clients])

  const statsCards = [
    {
      title: 'Active Proposals',
      value: metrics.totalCount,
      label: `${metrics.signedCount} closed • ${metrics.totalCount - metrics.signedCount} active`,
      trend: 'up',
      trendText: `${metrics.totalCount} registered`,
      icon: FileText,
      color: 'text-[#0055FF]',
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Active Pipeline Value',
      value: formatCurrency(metrics.totalPipelineValue, 'INR'),
      label: `${metrics.awaitingSignatureCount} proposals in review`,
      trend: 'up',
      trendText: 'Live negotiation',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Won / Signed Revenue',
      value: formatCurrency(metrics.wonRevenue, 'INR'),
      label: `${metrics.signedCount} deals successfully closed`,
      trend: 'up',
      trendText: `${metrics.winRate}% win rate`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Client Directory',
      value: clients?.length || 0,
      label: 'Active organization accounts',
      trend: 'neutral',
      trendText: 'Directory accounts',
      icon: Users,
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-100',
    },
  ]

  const statusPills = [
    { id: 'all', label: 'All Statuses', count: proposals?.length || 0 },
    {
      id: 'draft',
      label: 'Draft',
      count: proposals?.filter((p) => p.status === 'draft').length || 0,
    },
    {
      id: 'sent',
      label: 'Sent',
      count: proposals?.filter((p) => p.status === 'sent').length || 0,
    },
    {
      id: 'viewed',
      label: 'Viewed',
      count: proposals?.filter((p) => p.status === 'viewed').length || 0,
    },
    {
      id: 'signed',
      label: 'Signed',
      count:
        proposals?.filter((p) => p.status === 'signed' || p.status === 'approved')
          .length || 0,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Top Welcome & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0055FF] border border-blue-200">
              <Sparkles className="w-3 h-3" />
              Live Workspace
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Monitor real-time proposal activity, commercial valuations, client pipeline, and branding formats.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/proposals')}
            icon={Filter}
            className="text-xs"
          >
            All Proposals
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/clients')}
            icon={Users}
            className="text-xs hidden sm:inline-flex"
          >
            Directory
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/proposals/new')}
            icon={Plus}
            className="text-xs font-semibold shadow-xs"
          >
            Create Proposal
          </Button>
        </div>
      </div>

      {/* 2. KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${card.bg} ${card.color}`}
                >
                  <Icon className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-black text-gray-950 tracking-tight font-mono">
                  {card.value}
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 truncate">{card.label}</span>
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                    {card.trendText}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 4. Active Proposals Pipeline Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {/* Pipeline Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-950 tracking-tight">
              Active Proposals Pipeline
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Itemized view of live client proposals, commercial valuations, and output formats.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/proposals')}
              icon={ArrowUpRight}
              className="text-xs"
            >
              View Full Table
            </Button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {statusPills.map((pill) => {
              const active = statusFilter === pill.id
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setStatusFilter(pill.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#0055FF] text-white shadow-2xs font-semibold'
                      : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200/80'
                  }`}
                >
                  <span>{pill.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick Search Input */}
          <div className="w-full sm:w-64">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, client, or ID..."
              leftIcon={Search}
              className="text-xs"
            />
          </div>
        </div>

        {/* Pipeline Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50/70 select-none">
                <th className="py-3 px-4">Proposal Info</th>
                <th className="py-3 px-3">Client Organization</th>
                <th className="py-3 px-3 text-center">Output Type</th>
                <th className="py-3 px-3 text-right">Valuation</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredProposals.length > 0 ? (
                filteredProposals.slice(0, 7).map((item) => {
                  const totals = calculateProposalTotals(item.pricing || {})
                  const isB2B =
                    item.proposalType === 'b2b' || item.showCompanyLogo === false
                  const currency = item.currency || item.pricing?.currency || 'INR'

                  return (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/proposals/${item.id}/edit`)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      {/* 1. Proposal Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50/80 border border-blue-100 text-[#0055FF] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[11px] font-bold text-[#0055FF]">
                                {item.number}
                              </span>
                            </div>
                            <span className="font-bold text-xs text-gray-900 group-hover:text-[#0055FF] transition-colors line-clamp-1">
                              {item.title}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Client Organization */}
                      <td className="py-3 px-3">
                        <div>
                          <div className="font-semibold text-xs text-gray-900">
                            {item.client?.companyName || item.client?.name || 'Unassigned'}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {item.client?.name || item.client?.email || '—'}
                          </div>
                        </div>
                      </td>

                      {/* 3. Output Type */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            !isB2B
                              ? 'bg-blue-50 text-[#0055FF] border-blue-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {!isB2B ? (
                            <>
                              <Building2 className="w-3 h-3" />
                              Direct (Logo)
                            </>
                          ) : (
                            <>
                              <Briefcase className="w-3 h-3" />
                              B2B (No Logo)
                            </>
                          )}
                        </span>
                      </td>

                      {/* 4. Grand Total */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-mono text-xs font-bold text-gray-900">
                          {formatCurrency(totals.grandTotal, currency)}
                        </span>
                      </td>

                      {/* 5. Status */}
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={item.status || 'draft'} />
                      </td>

                      {/* 6. Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/proposals/${item.id}/preview`)}
                            icon={Eye}
                            className="text-xs h-7 px-2"
                            title="A4 Print Preview"
                          >
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/proposals/${item.id}/edit`)}
                            icon={Edit3}
                            className="text-xs h-7 px-2"
                            title="Edit Proposal"
                          >
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-300 mb-2 stroke-[1.5]" />
                      <p className="text-xs font-semibold text-gray-600">
                        No proposals found matching criteria
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/proposals/new')}
                        icon={Plus}
                        className="text-xs mt-3"
                      >
                        Create New Proposal
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Bottom Two-Column Utility Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quick Launch Proposal Templates */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Quick Actions & Workflows
                </h4>
                <p className="text-xs text-gray-500">
                  Pre-configured entry points for fast proposal composition.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct Client Proposal Shortcut */}
            <div
              onClick={() => navigate('/proposals/new')}
              className="p-4 rounded-xl border border-gray-200/80 hover:border-[#0055FF]/40 hover:bg-blue-50/20 transition-all cursor-pointer group space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0055FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#0055FF] transition-colors">
                Direct Client Proposal
              </h5>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Render company logo in document header for direct B2C/B2B clients.
              </p>
            </div>

            {/* B2B Proposal Shortcut */}
            <div
              onClick={() => navigate('/proposals/new')}
              className="p-4 rounded-xl border border-gray-200/80 hover:border-[#0055FF]/40 hover:bg-blue-50/20 transition-all cursor-pointer group space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#0055FF] transition-colors">
                B2B Partner Proposal
              </h5>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Hides company logo from header while maintaining layout dimensions.
              </p>
            </div>

            {/* Client Directory */}
            <div
              onClick={() => navigate('/clients/new')}
              className="p-4 rounded-xl border border-gray-200/80 hover:border-[#0055FF]/40 hover:bg-blue-50/20 transition-all cursor-pointer group space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#0055FF] transition-colors">
                Register New Client
              </h5>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Add an organization with billing address, tax ID, and contact details.
              </p>
            </div>

            {/* Document Header Settings */}
            <div
              onClick={() => navigate('/settings/documents')}
              className="p-4 rounded-xl border border-gray-200/80 hover:border-[#0055FF]/40 hover:bg-blue-50/20 transition-all cursor-pointer group space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#0055FF] transition-colors">
                Layout & Margins
              </h5>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Configure A4 portrait margins, footer phone numbers, and page numbering.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Recent Client Accounts */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Client Directory Snapshot
                </h4>
                <p className="text-xs text-gray-500">
                  Quick access to primary accounts and contact profiles.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="text-xs font-semibold text-[#0055FF] hover:text-[#0044CC] flex items-center gap-1 cursor-pointer"
            >
              All Clients
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {recentClients.map((client) => (
              <div
                key={client.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {client.companyName?.charAt(0) || 'C'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {client.companyName}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {client.name} • {client.email || 'No email'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate('/proposals/new', {
                        state: { prefilledClient: client },
                      })
                    }
                    className="text-xs h-7 px-2"
                  >
                    + Proposal
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
