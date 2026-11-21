export const PERMISSION_MODULES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Analytics, KPI metrics and revenue reporting',
    permissions: [
      { id: 'dashboard.view', label: 'View dashboard analytics', description: 'Access dashboard summary and charts' },
      { id: 'dashboard.export', label: 'Export dashboard reports', description: 'Download CSV and PDF executive reports' },
    ],
  },
  {
    id: 'proposals',
    name: 'Proposals',
    description: 'Commercial proposals, contracts and estimates',
    permissions: [
      { id: 'proposals.view', label: 'View proposals', description: 'Browse and inspect all team proposals' },
      { id: 'proposals.create', label: 'Create proposals', description: 'Draft direct and B2B client proposals' },
      { id: 'proposals.edit', label: 'Edit proposals', description: 'Update terms, sections, and pricing tables' },
      { id: 'proposals.delete', label: 'Delete proposals', description: 'Permanently archive or delete proposals' },
      { id: 'proposals.export', label: 'Export proposals', description: 'Generate high-res A4 PDF documents' },
    ],
  },
  {
    id: 'clients',
    name: 'Clients',
    description: 'Client directory, contacts and company records',
    permissions: [
      { id: 'clients.view', label: 'View clients', description: 'View client profiles and proposal history' },
      { id: 'clients.create', label: 'Create clients', description: 'Add new client organizations and contacts' },
      { id: 'clients.edit', label: 'Edit clients', description: 'Update client details, tax IDs, and billing info' },
      { id: 'clients.delete', label: 'Delete clients', description: 'Remove inactive client profiles' },
    ],
  },
  {
    id: 'ai',
    name: 'AI Copilot',
    description: 'Generative AI assistant and proposal automation',
    permissions: [
      { id: 'ai.view', label: 'View AI assistant', description: 'Access ChatGPT-style chat workspace' },
      { id: 'ai.use', label: 'Use AI Copilot', description: 'Generate proposal blueprints and scopes of work' },
      { id: 'ai.manage_providers', label: 'Manage AI providers', description: 'Configure OpenAI, Gemini and Claude settings' },
    ],
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Team members, account statuses and credentials',
    permissions: [
      { id: 'users.view', label: 'View users', description: 'Access team roster and user profiles' },
      { id: 'users.create', label: 'Create users', description: 'Invite new team members and assign roles' },
      { id: 'users.edit', label: 'Edit users', description: 'Update profile details and account statuses' },
      { id: 'users.delete', label: 'Delete users', description: 'Remove or deactivate user accounts' },
      { id: 'users.manage_roles', label: 'Manage roles', description: 'Assign security roles and customize permissions' },
    ],
  },
  {
    id: 'roles',
    name: 'Roles and Permissions',
    description: 'Role-based access control and capability matrix',
    permissions: [
      { id: 'roles.view', label: 'View roles', description: 'Inspect predefined role capabilities' },
      { id: 'roles.edit', label: 'Edit roles', description: 'Modify role permission assignments' },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Company branding, document templates and defaults',
    permissions: [
      { id: 'settings.view', label: 'View settings', description: 'Review company details and preferences' },
      { id: 'settings.manage', label: 'Manage settings', description: 'Update company profile, currency, and PDF headers' },
    ],
  },
]

export const ALL_PERMISSIONS = PERMISSION_MODULES.flatMap((m) =>
  m.permissions.map((p) => p.id)
)

export const ROLES = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    badge: 'Super Admin',
    description: 'Full platform access across all workspace modules, security, billing, and team permissions.',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    dotColor: 'bg-purple-500',
    defaultPermissions: [...ALL_PERMISSIONS],
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    badge: 'Admin',
    description: 'Can create, edit, manage proposals, clients, templates, and view user directory.',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500',
    defaultPermissions: [
      'dashboard.view',
      'dashboard.export',
      'proposals.view',
      'proposals.create',
      'proposals.edit',
      'proposals.delete',
      'proposals.export',
      'clients.view',
      'clients.create',
      'clients.edit',
      'clients.delete',
      'ai.view',
      'ai.use',
      'users.view',
      'users.create',
      'users.edit',
      'roles.view',
      'settings.view',
      'settings.manage',
    ],
  },
  manager: {
    id: 'manager',
    name: 'Manager',
    badge: 'Manager',
    description: 'Can approve proposals, manage client contracts, and assign team projects.',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    dotColor: 'bg-teal-500',
    defaultPermissions: [
      'dashboard.view',
      'dashboard.export',
      'proposals.view',
      'proposals.create',
      'proposals.edit',
      'proposals.export',
      'clients.view',
      'clients.create',
      'clients.edit',
      'ai.view',
      'ai.use',
      'users.view',
      'settings.view',
    ],
  },
  editor: {
    id: 'editor',
    name: 'Editor',
    badge: 'Editor',
    description: 'Can draft and edit proposals, manage client contacts, and use AI tools.',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    defaultPermissions: [
      'dashboard.view',
      'proposals.view',
      'proposals.create',
      'proposals.edit',
      'proposals.export',
      'clients.view',
      'clients.create',
      'ai.view',
      'ai.use',
    ],
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    badge: 'Viewer',
    description: 'Read-only access to view published proposals, client summaries, and dashboard reports.',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-500',
    defaultPermissions: [
      'dashboard.view',
      'proposals.view',
      'clients.view',
    ],
  },
}

export const USER_STATUSES = {
  active: {
    id: 'active',
    label: 'Active',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  inactive: {
    id: 'inactive',
    label: 'Inactive',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    dotColor: 'bg-slate-400',
  },
  pending: {
    id: 'pending',
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
  },
}

// Initial users array is empty - all users are fetched live via API (GET /admin/users)
export const INITIAL_USERS = []
