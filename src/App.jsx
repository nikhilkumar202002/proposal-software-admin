import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import { Dashboard } from './modules/Dashboard'
import {
  ProposalList,
  CreateProposal,
  EditProposal,
  ProposalPreview,
} from './modules/proposals'
import {
  ClientList,
  CreateClient,
  EditClient,
} from './modules/clients'
import {
  SettingsPage,
  CompanyProfile,
  DocumentSettings,
  CurrencySettings,
  AccountSettings,
} from './modules/settings'
import { FileText } from 'lucide-react'

// Dashboard Overview Page
const DashboardOverview = () => {
  const navigate = useNavigate()

  const stats = [
    {
      label: 'Active Proposals',
      value: '18',
      change: '+12% from last month',
      trend: 'up',
      icon: FileText,
    },
    {
      label: 'Acceptance Rate',
      value: '74.2%',
      change: '+4.5% this quarter',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      label: 'Won Value',
      value: '₹14,85,000',
      change: '14 deals closed',
      trend: 'up',
      icon: CheckCircle2,
    },
    {
      label: 'Awaiting Signature',
      value: '6',
      change: '₹4,23,000 in pipeline',
      trend: 'neutral',
      icon: Clock,
    },
  ]

  const recentProposals = [
    {
      id: 'prop-2026-081',
      number: 'PROP-2026-081',
      title: 'Enterprise Cloud Infrastructure Modernization',
      client: 'Acme Technologies Inc.',
      amount: '₹3,40,000',
      status: 'Signed',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      date: 'Today, 2:15 PM',
    },
    {
      id: 'prop-2026-080',
      number: 'PROP-2026-080',
      title: 'Enterprise Brand Identity & Design System',
      client: 'Apex Global Corp',
      amount: '₹1,85,000',
      status: 'Viewed',
      statusColor: 'bg-sky-50 text-sky-700 border-sky-200',
      date: 'Yesterday',
    },
    {
      id: 'prop-2026-079',
      number: 'PROP-2026-079',
      title: 'Custom AI Automation & Agent Pipeline',
      client: 'NextEra Logistics Ltd.',
      amount: '₹5,20,000',
      status: 'Under Review',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      date: 'Nov 14, 2026',
    },
    {
      id: 'prop-2026-078',
      number: 'PROP-2026-078',
      title: 'Cybersecurity Audit & Compliance Review',
      client: 'Starlight Financial',
      amount: '₹2,40,000',
      status: 'Draft',
      statusColor: 'bg-gray-100 text-gray-700 border-gray-200',
      date: 'Nov 12, 2026',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Welcome back, Alex 👋
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            You have proposals awaiting review and client signature this week.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/proposals')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            View All Proposals
          </button>
          <button
            type="button"
            onClick={() => navigate('/proposals/new')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Create Proposal
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-500">
                <span
                  className={
                    stat.trend === 'up'
                      ? 'text-emerald-600 font-semibold flex items-center'
                      : 'text-gray-500 font-medium'
                  }
                >
                  {stat.change}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Proposals Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Active Proposals Pipeline
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Live proposal documents itemized with A4 print rendering and TipTap editor.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/proposals')}
            className="text-xs font-semibold text-[#0055FF] hover:text-[#0044CC] flex items-center gap-1 cursor-pointer"
          >
            Manage Proposals
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {recentProposals.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/proposals/${item.id}/edit`)}
              className="p-4 hover:bg-gray-50/70 transition-colors flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-gray-400">
                      {item.number}
                    </span>
                    <span className="font-semibold text-xs text-gray-900 truncate">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span>{item.client}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-bold text-gray-900 font-mono">
                  {item.amount}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${item.statusColor}`}
                >
                  {item.status}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/proposals/${item.id}/preview`)
                  }}
                  className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                  title="View A4 Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Simple Page Placeholder for other routes
const PagePlaceholder = ({ title, description }) => (
  <div className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-2xs">
    <div className="max-w-md">
      <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      <div className="mt-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-gray-600 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0055FF] text-white flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <span className="font-semibold text-gray-900">Module Ready</span>
          <p className="text-gray-500 mt-0.5">
            This module is connected with ProposalOS AdminLayout, Header, and Sidebar.
          </p>
        </div>
      </div>
    </div>
  </div>
)

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardOverview />} />
          {/* Proposal Management Module Routes */}
          <Route path="/proposals" element={<ProposalList />} />
          <Route path="/proposals/new" element={<CreateProposal />} />
          <Route path="/proposals/create" element={<CreateProposal />} />
          <Route path="/proposals/:id/edit" element={<EditProposal />} />
          <Route path="/proposals/:id/preview" element={<ProposalPreview />} />
          <Route path="/proposals/:id" element={<ProposalPreview />} />

          {/* Client Management Module Routes */}
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/new" element={<CreateClient />} />
          <Route path="/clients/create" element={<CreateClient />} />
          <Route path="/clients/:id/edit" element={<EditClient />} />
          {/* Workspace Settings Module Routes */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/company" element={<CompanyProfile standalone={true} />} />
          <Route path="/settings/documents" element={<DocumentSettings standalone={true} />} />
          <Route path="/settings/currency" element={<CurrencySettings standalone={true} />} />
          <Route path="/settings/account" element={<AccountSettings standalone={true} />} />
          <Route
            path="/help"
            element={
              <PagePlaceholder
                title="Help & Support"
                description="Guides, keyboard shortcuts, API documentation, and priority support."
              />
            }
          />
        </Route>
        {/* Catch-all redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
