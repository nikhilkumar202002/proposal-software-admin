import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import { DocumentCanvas } from './components/document'
import { SAMPLE_PROPOSAL_DATA } from './components/document/utils/documentHelpers'
import { TipTapEditor } from './components/editor'
import { SAMPLE_PROPOSAL_DOC_JSON } from './components/editor/utils/sampleDocJson'
import {
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  MoreVertical,
  Filter,
  Edit3,
  Eye,
  Code2,
} from 'lucide-react'

// Demo Dashboard Overview Page
const DashboardOverview = () => {
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
      id: 'PR-2026-081',
      title: 'Cloud Infrastructure Migration & DevOps',
      client: 'Acme Technologies Inc.',
      amount: '₹3,40,000',
      status: 'Signed',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      date: 'Today, 2:15 PM',
    },
    {
      id: 'PR-2026-080',
      title: 'Enterprise Brand Identity & Design System',
      client: 'Apex Global Corp',
      amount: '₹1,85,000',
      status: 'Viewed',
      statusColor: 'bg-blue-50 text-[#0055FF] border-blue-200',
      date: 'Yesterday',
    },
    {
      id: 'PR-2026-079',
      title: 'Custom AI Automation Pipeline',
      client: 'NextEra Logistics',
      amount: '₹5,20,000',
      status: 'Pending',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      date: 'Nov 14, 2026',
    },
    {
      id: 'PR-2026-078',
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
            You have 6 proposals awaiting client decision this week.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            Filter Pipeline
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0055FF] hover:bg-[#0044CC] rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Proposal
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
              className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between hover:border-gray-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0055FF] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Proposals Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-gray-900">Recent Proposals</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Live updates on client engagement and document states.
            </p>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-[#0055FF] hover:text-[#0044CC] transition-colors"
          >
            View all proposals →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-gray-600">
            <thead className="bg-[#F8F9FB] text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Proposal</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentProposals.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                      {item.id}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 font-medium">
                    {item.client}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                    {item.amount}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{item.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Integrated TipTap Editor & A4 Document Engine Showcase Page
const ProposalDocumentPage = () => {
  const [activeTab, setActiveTab] = useState('editor') // 'editor' | 'preview'
  const [editorDoc, setEditorDoc] = useState(SAMPLE_PROPOSAL_DOC_JSON)
  const [showJsonDrawer, setShowJsonDrawer] = useState(false)

  return (
    <div className="space-y-4">
      {/* Top Banner with View Switcher */}
      <div className="no-print bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              TipTap + A4 Integrated
            </span>
            <span className="text-xs text-gray-400 font-mono">
              PROP-2026-089
            </span>
          </div>
          <h2 className="text-base font-bold text-gray-900 mt-1">
            Enterprise Cloud Infrastructure Proposal
          </h2>
          <p className="text-xs text-gray-500">
            Rich-text TipTap editing with dynamic tables, manual page breaks & physical A4 page rendering.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 select-none self-start sm:self-auto">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              TipTap Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              A4 Print Preview
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowJsonDrawer(!showJsonDrawer)}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            title="Export / View TipTap JSON"
          >
            <Code2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* JSON Viewer Drawer/Modal */}
      {showJsonDrawer && (
        <div className="no-print bg-gray-900 text-gray-100 p-4 rounded-xl border border-gray-800 text-xs font-mono max-h-56 overflow-auto">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-800 text-[11px] text-gray-400">
            <span>TipTap Document JSON Output (Laravel API Ready)</span>
            <button
              type="button"
              onClick={() => setShowJsonDrawer(false)}
              className="text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <pre>{JSON.stringify(editorDoc, null, 2)}</pre>
        </div>
      )}

      {/* Main View Area */}
      {activeTab === 'editor' ? (
        <div className="min-h-[600px]">
          <TipTapEditor
            content={editorDoc}
            onChange={(json) => setEditorDoc(json)}
            placeholder="Draft your proposal here..."
          />
        </div>
      ) : (
        <div className="h-[calc(100vh-210px)] min-h-[650px] rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs bg-[#EBF0F5]">
          <DocumentCanvas
            content={SAMPLE_PROPOSAL_DATA.blocks}
            company={SAMPLE_PROPOSAL_DATA.company}
            proposal={SAMPLE_PROPOSAL_DATA.metadata}
            initialSettings={{
              orientation: 'portrait',
              watermark: {
                enabled: false,
                text: 'CONFIDENTIAL',
                opacity: 0.08,
              },
            }}
          />
        </div>
      )}
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
          <Route path="/proposals" element={<ProposalDocumentPage />} />
          <Route
            path="/clients"
            element={
              <PagePlaceholder
                title="Client Directory"
                description="Manage client organizations, contacts, and signature records."
              />
            }
          />
          <Route
            path="/templates"
            element={
              <PagePlaceholder
                title="Proposal Templates"
                description="Pre-built modular blocks and templates for fast proposal generation."
              />
            }
          />
          <Route
            path="/settings/documents"
            element={
              <PagePlaceholder
                title="Document Settings"
                description="Configure typography, default clauses, currencies, and signing policies."
              />
            }
          />
          <Route
            path="/settings/company"
            element={
              <PagePlaceholder
                title="Company Profile"
                description="Update company logo, legal address, tax registrations, and branding."
              />
            }
          />
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
