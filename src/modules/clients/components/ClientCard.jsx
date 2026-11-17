import { Mail, Phone, MapPin, FileText, Edit3, Eye, Trash2 } from 'lucide-react'
import { Badge, ActionMenu } from '../../../components/common'
import { getClientInitials } from '../utils/clientHelpers'

export const ClientCard = ({
  client,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  className = '',
}) => {
  if (!client) return null

  const initials = getClientInitials(client.name, client.companyName)
  const isLead = client.status === 'lead'

  const actions = [
    { label: 'View Details', icon: Eye, onClick: () => onView(client) },
    { label: 'Edit Profile', icon: Edit3, onClick: () => onEdit(client) },
    { label: 'Delete Client', icon: Trash2, danger: true, onClick: () => onDelete(client) },
  ]

  return (
    <div
      onClick={() => onView(client)}
      className={`bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group ${className}`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-xs text-[#FB6C00] shrink-0">
              {initials}
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#FB6C00] transition-colors line-clamp-1">
                {client.companyName}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-1">
                {client.name}
              </p>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <ActionMenu items={actions} align="right" />
          </div>
        </div>

        {/* Contact Info */}
        <div className="py-3.5 space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <a
              href={`mailto:${client.email}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-[#FB6C00] truncate"
            >
              {client.email}
            </a>
          </div>

          {client.phone && (
            <div className="flex items-center gap-2 truncate">
              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{client.phone}</span>
            </div>
          )}

          {client.city && (
            <div className="flex items-center gap-2 truncate text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>
                {client.city}
                {client.country ? `, ${client.country}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer: Proposal Count & Status */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-gray-700">
          <FileText className="w-3.5 h-3.5 text-[#FB6C00]" />
          <span>{client.proposalsCount || 0} Proposals</span>
        </div>

        <Badge variant={isLead ? 'warning' : 'success'} size="sm">
          {isLead ? 'Lead' : 'Active'}
        </Badge>
      </div>
    </div>
  )
}

export default ClientCard
