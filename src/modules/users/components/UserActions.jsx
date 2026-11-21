import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Eye, Edit3, CheckCircle2, XCircle, Trash2 } from 'lucide-react'

export const UserActions = ({
  user,
  onDelete = () => {},
  onToggleStatus = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  if (!user) return null

  const isActive = user.status === 'active'

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="User actions"
        title="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200/80 py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* View Details */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              navigate(`/users/${user.id}`)
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span>View Details</span>
          </button>

          {/* Edit User */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              navigate(`/users/${user.id}/edit`)
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-gray-400" />
            <span>Edit User</span>
          </button>

          {/* Activate / Deactivate Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onToggleStatus(user.id, isActive ? 'inactive' : 'active')
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left cursor-pointer"
          >
            {isActive ? (
              <>
                <XCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Deactivate User</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Activate User</span>
              </>
            )}
          </button>

          <div className="h-px bg-gray-100 my-1" />

          {/* Delete User */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onDelete(user)
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Delete User</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default UserActions
