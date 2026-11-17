import {
  Building2,
  Users,
  Mail,
  Phone,
  Globe,
  MapPin,
  Receipt,
  FileText,
  Calendar,
  Edit3,
  Trash2,
  ExternalLink,
  PlusCircle,
} from 'lucide-react'
import { Badge, Button } from '../../../components/common'
import { getClientInitials, formatClientAddress } from '../utils/clientHelpers'

export const ClientDetails = ({
  client,
  onEdit = () => {},
  onDelete = () => {},
  onCreateProposal = () => {},
  onClose,
  className = '',
}) => {
  if (!client) return null

  const initials = getClientInitials(client.name, client.companyName)
  const isLead = client.status === 'lead'

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Profile Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-lg text-[#FB6C00] shadow-2xs shrink-0">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  {client.companyName}
                </h3>
                <Badge variant={isLead ? 'warning' : 'success'} size="sm">
                  {isLead ? 'Prospective Lead' : 'Active Account'}
                </Badge>
              </div>

              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Contact Person: <span className="font-semibold text-gray-800">{client.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(client)}
              icon={Edit3}
              className="text-xs"
            >
              Edit Profile
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onCreateProposal(client)}
              icon={PlusCircle}
              className="text-xs font-semibold"
            >
              New Proposal
            </Button>
          </div>
        </div>
      </div>

      {/* Grid of Information Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Digital Channels */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#FB6C00]" />
            Direct Communication & Web
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Email Address</span>
              <a
                href={`mailto:${client.email}`}
                className="font-medium text-gray-900 hover:text-[#FB6C00] transition-colors"
              >
                {client.email}
              </a>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Direct Phone</span>
              <span className="font-medium text-gray-900">
                {client.phone || 'Not Provided'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Official Website</span>
              {client.website ? (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#0055FF] hover:underline flex items-center gap-1"
                >
                  {client.website.replace(/^https?:\/\//, '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-gray-400">Not Provided</span>
              )}
            </div>
          </div>
        </div>

        {/* Commercial & Tax Registration */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#FB6C00]" />
            Legal & Tax Profile
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Tax Registration / GSTIN</span>
              <span className="font-mono font-bold text-gray-900">
                {client.taxNumber || 'Not Registered'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Proposals</span>
              <span className="font-bold text-[#FB6C00] px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100">
                {client.proposalsCount || 0} Proposals
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Country Jurisdiction</span>
              <span className="font-medium text-gray-900">
                {client.country || 'Global'}
              </span>
            </div>
          </div>
        </div>

        {/* Physical & Billing Address */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 md:col-span-2">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FB6C00]" />
            Registered Office & Billing Address
          </h4>

          <p className="text-xs text-gray-700 leading-relaxed">
            {formatClientAddress(client)}
          </p>
        </div>

        {/* Notes & Account Remarks */}
        {client.notes && (
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FB6C00]" />
              Account Notes & Context
            </h4>

            <p className="text-xs text-gray-600 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 leading-relaxed">
              {client.notes}
            </p>
          </div>
        )}
      </div>

      {/* Danger Zone: Delete Option */}
      <div className="bg-red-50/40 p-4 rounded-2xl border border-red-100 flex items-center justify-between">
        <div>
          <h5 className="text-xs font-bold text-red-900">
            Delete Client Record
          </h5>
          <p className="text-[11px] text-red-600 mt-0.5">
            Remove this client and its contact details from your database.
          </p>
        </div>

        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => onDelete(client)}
          icon={Trash2}
          className="text-xs"
        >
          Delete Record
        </Button>
      </div>
    </div>
  )
}

export default ClientDetails
