import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
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
  UserList,
  CreateUser,
  EditUser,
  UserDetails,
} from './modules/users'
import {
  SettingsPage,
  CompanyProfile,
  DocumentSettings,
  CurrencySettings,
  AccountSettings,
} from './modules/settings'
import { AIChatPage, AIProposalGenerator, AISettingsPage } from './modules/ai'
import { TechServicesPage } from './modules/tech-services'
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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            fontSize: '13px',
            fontWeight: '500',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            padding: '10px 16px',
          },
          success: {
            iconTheme: {
              primary: '#0055FF',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        {/* Authentication Route with Split Screen Layout */}
        <Route path="/login" element={<Login />} />

        {/* Authenticated Workspace Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* AI Chat & Proposal Copilot (ChatGPT Interface) */}
          <Route path="/ai" element={<AIChatPage />} />
          <Route path="/ai/generator" element={<AIProposalGenerator />} />
          <Route path="/ai/settings" element={<AISettingsPage />} />
          <Route path="/chat" element={<AIChatPage />} />

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

          {/* User Management Module Routes */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<CreateUser />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/users/:id/edit" element={<EditUser />} />

          {/* Services & Technologies Tabbed Management Module */}
          <Route path="/services-technologies" element={<TechServicesPage />} />
          <Route path="/tech-services" element={<TechServicesPage />} />
          <Route path="/technologies" element={<TechServicesPage />} />
          <Route path="/service-types" element={<TechServicesPage />} />
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
