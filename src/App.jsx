import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import { Dashboard } from './modules/Dashboard'
import { Login } from './modules/auth'
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
        {/* Authentication Route with Split Screen Layout */}
        <Route path="/login" element={<Login />} />

        {/* Authenticated Workspace Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
