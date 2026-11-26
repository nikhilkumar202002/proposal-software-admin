import { useState } from 'react'
import {
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Receipt,
  FileText,
  Edit3,
  Trash2,
  ExternalLink,
  PlusCircle,
  Globe,
  Calendar,
  TrendingUp,
  Copy,
  Check,
  Hash,
  ShieldCheck,
} from 'lucide-react'
import { Badge, Button } from '../../../components/common'
import { getClientInitials, formatClientAddress } from '../utils/clientHelpers'

export const ClientDetails = ({
  client,
  onEdit = () => {},
  onDelete = () => {},
  onCreateProposal = () => {},
  className = '',
}) => {
  const [copiedKey, setCopiedKey] = useState(null)

  if (!client) return null

  const initials = getClientInitials(client.name, client.companyName)
  const isLead = client.status === 'lead'
  const isInactive = client.status === 'inactive'

  const copyToClipboard = (text, key) => {
    if (!text) return
    navigator.clipboard?.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const formatRevenue = (amount) => {
    if (!amount || isNaN(amount)) return '—'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const clientCode = client.clientCode || client.client_code || `CLI-${client.id}`

  const formattedDate = client.createdAt || client.created_at
    ? new Date(client.createdAt || client.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Header Profile Banner Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          {/* Identity details */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0055FF]/10 via-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center font-bold text-xl sm:text-2xl text-[#0055FF] shadow-2xs shrink-0 select-none">
              {initials}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
                  {client.companyName || client.name}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  #{clientCode}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isLead
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : isInactive
                      ? 'bg-gray-100 text-gray-600 border border-gray-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isLead
                        ? 'bg-amber-500'
                        : isInactive
                        ? 'bg-gray-400'
                        : 'bg-emerald-500 animate-pulse'
                    }`}
                  />
                  {isLead ? 'Prospective Lead' : isInactive ? 'Inactive' : 'Active Account'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <Users className="w-3.5 h-3.5 text-[#0055FF]" />
                  Contact: <span className="text-gray-900 font-semibold">{client.name}</span>
                </span>
                {client.country && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      {client.country}
                    </span>
                  </>
                )}
                {formattedDate && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      Client since {formattedDate}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(client)}
              icon={Edit3}
              className="text-xs font-medium cursor-pointer"
            >
              Edit Profile
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onCreateProposal(client)}
              icon={PlusCircle}
              className="text-xs font-semibold cursor-pointer shadow-xs"
            >
              New Proposal
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Key Performance & Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric: Proposals Count */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-3xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
              Proposals
            </span>
            <span className="text-base font-bold text-gray-900 tracking-tight">
              {client.proposalsCount || 0}{' '}
              <span className="text-xs font-normal text-gray-500">
                {(client.proposalsCount || 0) === 1 ? 'record' : 'records'}
              </span>
            </span>
          </div>
        </div>

        {/* Metric: Pipeline Value */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-3xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
              Pipeline Value
            </span>
            <span className="text-base font-bold text-gray-900 tracking-tight">
              {client.totalRevenue ? formatRevenue(client.totalRevenue) : '₹ 0'}
            </span>
          </div>
        </div>

        {/* Metric: Tax / GSTIN */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-3xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
              Tax ID / GSTIN
            </span>
            <span className="text-xs font-mono font-bold text-gray-900 truncate block">
              {client.taxNumber || 'Not Registered'}
            </span>
          </div>
        </div>

        {/* Metric: Country Jurisdiction */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-3xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
              Jurisdiction
            </span>
            <span className="text-base font-bold text-gray-900 tracking-tight truncate block">
              {client.country || 'India'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Detailed 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Direct Communication & Digital Channels */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0055FF]" />
              Direct Communication & Web
            </h4>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Email Address */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-500 shrink-0">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${client.email}`}
                    className="font-semibold text-gray-900 hover:text-[#0055FF] transition-colors truncate block"
                  >
                    {client.email || 'Not Provided'}
                  </a>
                </div>
              </div>

              {client.email && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(client.email, 'email')}
                  title="Copy email address"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition-all cursor-pointer shrink-0"
                >
                  {copiedKey === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Direct Phone */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-500 shrink-0">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                    Direct Phone
                  </span>
                  {client.phone ? (
                    <a
                      href={`tel:${client.phone}`}
                      className="font-semibold text-gray-900 hover:text-[#0055FF] transition-colors truncate block"
                    >
                      {client.phone}
                    </a>
                  ) : (
                    <span className="font-normal text-gray-400">Not Provided</span>
                  )}
                </div>
              </div>

              {client.phone && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(client.phone, 'phone')}
                  title="Copy phone number"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition-all cursor-pointer shrink-0"
                >
                  {copiedKey === 'phone' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Official Website */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-500 shrink-0">
                  <Globe className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                    Official Website
                  </span>
                  {client.website ? (
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#0055FF] hover:underline truncate block"
                    >
                      {client.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span className="font-normal text-gray-400">Not Provided</span>
                  )}
                </div>
              </div>

              {client.website && (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#0055FF] hover:bg-white transition-all shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Legal & Tax Profile */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#0055FF]" />
              Legal & Tax Profile
            </h4>
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              Corporate
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Tax Registration / GSTIN */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-500 shrink-0">
                  <Receipt className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                    Tax Registration / GSTIN
                  </span>
                  <span className="font-mono font-bold text-gray-900 truncate block">
                    {client.taxNumber || 'Not Registered'}
                  </span>
                </div>
              </div>

              {client.taxNumber && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(client.taxNumber, 'tax')}
                  title="Copy tax number"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition-all cursor-pointer shrink-0"
                >
                  {copiedKey === 'tax' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Authorized Contact Person */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-500 shrink-0">
                  <Users className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                    Authorized Representative
                  </span>
                  <span className="font-semibold text-gray-900 truncate block">
                    {client.name || 'Not Specified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Country Jurisdiction */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-500 shrink-0">
                  <Globe className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                    Country Jurisdiction
                  </span>
                  <span className="font-semibold text-gray-900 truncate block">
                    {client.country || 'India'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Registered Office & Billing Address */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#0055FF]" />
          Registered Office & Billing Address
        </h4>

        <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-700 leading-relaxed space-y-1">
            <p className="font-medium text-gray-900">
              {formatClientAddress(client)}
            </p>
            {(client.city || client.state || client.country || client.postalCode) && (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {client.city && (
                  <span className="px-2 py-0.5 rounded-md bg-white text-gray-600 border border-gray-200 text-[11px] font-medium">
                    City: {client.city}
                  </span>
                )}
                {client.state && (
                  <span className="px-2 py-0.5 rounded-md bg-white text-gray-600 border border-gray-200 text-[11px] font-medium">
                    State: {client.state}
                  </span>
                )}
                {client.postalCode && (
                  <span className="px-2 py-0.5 rounded-md bg-white text-gray-600 border border-gray-200 text-[11px] font-mono">
                    PIN/ZIP: {client.postalCode}
                  </span>
                )}
                {client.country && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0055FF] border border-blue-100 text-[11px] font-medium">
                    {client.country}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Account Notes & Strategic Remarks */}
      {client.notes && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0055FF]" />
            Account Notes & Strategic Remarks
          </h4>

          <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 text-xs text-gray-600 leading-relaxed italic">
            "{client.notes}"
          </div>
        </div>
      )}

      {/* 6. Danger Zone: Delete Option */}
      <div className="bg-red-50/40 p-4.5 rounded-2xl border border-red-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h5 className="text-xs font-bold text-red-900">
            Delete Client Record
          </h5>
          <p className="text-[11px] text-red-600 mt-0.5">
            Remove this client and its contact details permanently from your workspace database.
          </p>
        </div>

        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => onDelete(client)}
          icon={Trash2}
          className="text-xs font-semibold cursor-pointer shrink-0"
        >
          Delete Record
        </Button>
      </div>
    </div>
  )
}

export default ClientDetails
