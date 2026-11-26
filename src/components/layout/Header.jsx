import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronDown,
  ChevronRight,
  User,
  Settings,
  LogOut,
  FileCheck,
  Eye,
  ExternalLink,
  BookOpen,
  Keyboard,
  LifeBuoy,
  X,
  Trash2,
  Inbox,
  Loader2,
  CheckCheck,
} from 'lucide-react'
import useAuthStore, { getInitials } from '../../store/authStore'
import notificationsService from '../../services/notifications.service'

function formatRelativeTime(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffSec = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 1000))
    if (diffSec < 60) return 'Just now'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  } catch {
    return dateStr
  }
}

// Route title & breadcrumb mapping
const getRouteMeta = (pathname) => {
  if (pathname === '/' || pathname === '/dashboard') {
    return {
      title: 'Dashboard',
      breadcrumbs: [{ label: 'Workspace', to: '/' }, { label: 'Dashboard' }],
    }
  }
  if (pathname === '/proposals/new' || pathname === '/proposals/create') {
    return {
      title: 'Create Proposal',
      breadcrumbs: [
        { label: 'Workspace', to: '/' },
        { label: 'Proposals', to: '/proposals' },
        { label: 'New Proposal' },
      ],
    }
  }
  if (pathname.includes('/proposals/') && pathname.includes('/edit')) {
    return {
      title: 'Edit Proposal',
      breadcrumbs: [
        { label: 'Workspace', to: '/' },
        { label: 'Proposals', to: '/proposals' },
        { label: 'Edit' },
      ],
    }
  }
  if (
    pathname.includes('/proposals/') &&
    (pathname.includes('/preview') || pathname.match(/\/proposals\/[^/]+$/))
  ) {
    return {
      title: 'Proposal Document Preview',
      breadcrumbs: [
        { label: 'Workspace', to: '/' },
        { label: 'Proposals', to: '/proposals' },
        { label: 'Preview' },
      ],
    }
  }
  if (pathname.startsWith('/proposals')) {
    return {
      title: 'Proposals',
      breadcrumbs: [{ label: 'Workspace', to: '/' }, { label: 'Proposals' }],
    }
  }
  if (pathname === '/clients/new' || pathname === '/clients/create') {
    return {
      title: 'Add New Client',
      breadcrumbs: [
        { label: 'Workspace', to: '/' },
        { label: 'Clients', to: '/clients' },
        { label: 'New Client' },
      ],
    }
  }
  if (pathname.includes('/clients/') && pathname.includes('/edit')) {
    return {
      title: 'Edit Client Profile',
      breadcrumbs: [
        { label: 'Workspace', to: '/' },
        { label: 'Clients', to: '/clients' },
        { label: 'Edit Profile' },
      ],
    }
  }
  if (pathname.match(/^\/clients\/[^/]+$/) && !pathname.includes('/new') && !pathname.includes('/create')) {
    return {
      title: 'Client Profile',
      breadcrumbs: [
        { label: 'Workspace', to: '/' },
        { label: 'Clients', to: '/clients' },
        { label: 'Client Profile' },
      ],
    }
  }
  if (pathname.startsWith('/clients')) {
    return {
      title: 'Client Directory',
      breadcrumbs: [{ label: 'Workspace', to: '/' }, { label: 'Clients' }],
    }
  }
  if (
    pathname.startsWith('/services-technologies') ||
    pathname.startsWith('/tech-services') ||
    pathname.startsWith('/technologies') ||
    pathname.startsWith('/service-types')
  ) {
    return {
      title: 'Services & Technologies',
      breadcrumbs: [{ label: 'Workspace', to: '/' }, { label: 'Services & Technologies' }],
    }
  }
  if (pathname.startsWith('/templates')) {
    return {
      title: 'Proposal Templates',
      breadcrumbs: [{ label: 'Workspace', to: '/' }, { label: 'Templates' }],
    }
  }
  if (pathname.startsWith('/settings/documents')) {
    return {
      title: 'Document Settings',
      breadcrumbs: [{ label: 'Management' }, { label: 'Document Settings' }],
    }
  }
  if (pathname.startsWith('/profile')) {
    return {
      title: 'My Profile',
      breadcrumbs: [{ label: 'Account', to: '/profile' }, { label: 'My Profile' }],
    }
  }
  if (pathname.startsWith('/settings/company')) {
    return {
      title: 'Company Profile',
      breadcrumbs: [{ label: 'Management' }, { label: 'Company Profile' }],
    }
  }
  if (pathname.startsWith('/help')) {
    return {
      title: 'Help & Support',
      breadcrumbs: [{ label: 'Resources' }, { label: 'Help & Support' }],
    }
  }

  // Fallback for custom or nested routes
  const segments = pathname.split('/').filter(Boolean)
  const formatted = segments
    .map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' / ')

  return {
    title: formatted || 'Overview',
    breadcrumbs: [{ label: 'Workspace', to: '/' }, { label: formatted || 'Overview' }],
  }
}

export const Header = ({
  setIsMobileOpen = () => {},
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { title, breadcrumbs } = getRouteMeta(location.pathname)
  const { user, fetchCurrentUser, logout } = useAuthStore()

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const userRoleDisplay =
    (Array.isArray(user?.roles) && user.roles.length > 0
      ? (typeof user.roles[0] === 'object' ? user.roles[0]?.name : user.roles[0])
      : null) ||
    user?.role?.name ||
    user?.role ||
    'Administrator'

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Refs for outside click detection
  const searchInputRef = useRef(null)
  const notificationRef = useRef(null)
  const helpRef = useRef(null)
  const userMenuRef = useRef(null)

  // Live Notifications State
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)

  // Fetch unread count (GET /notifications/unread-count)
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsService.getUnreadCount()
      setUnreadCount(typeof count === 'number' ? count : 0)
    } catch (err) {
      console.warn('Could not fetch unread notifications count:', err.message)
    }
  }, [])

  // Fetch notifications list (GET /notifications)
  const fetchNotificationsList = useCallback(async () => {
    setIsLoadingNotifications(true)
    try {
      const res = await notificationsService.getNotifications({ per_page: 25 })
      setNotifications(res.notifications || [])
      if (typeof res.unreadCount === 'number') {
        setUnreadCount(res.unreadCount)
      }
    } catch (err) {
      console.warn('Could not fetch notifications list:', err.message)
    } finally {
      setIsLoadingNotifications(false)
    }
  }, [])

  // Initial fetch on mount & background polling for badge updates
  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  // Fetch notifications whenever the dropdown opens
  useEffect(() => {
    if (isNotificationOpen) {
      fetchNotificationsList()
    }
  }, [isNotificationOpen, fetchNotificationsList])

  // Mark single notification read (PATCH /notifications/:id/read)
  const handleNotificationClick = async (item) => {
    if (!item.isRead) {
      try {
        await notificationsService.markAsRead(item.id)
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        )
        setUnreadCount((c) => Math.max(0, c - 1))
      } catch (err) {
        console.error('Failed to mark notification as read:', err)
      }
    }

    if (item.actionUrl) {
      setIsNotificationOpen(false)
      navigate(item.actionUrl)
    }
  }

  // Mark all as read (PATCH /notifications/read-all)
  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  // Delete single notification (DELETE /notifications/:id)
  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation()
    try {
      await notificationsService.deleteNotification(id)
      const target = notifications.find((n) => n.id === id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      if (target && !target.isRead) {
        setUnreadCount((c) => Math.max(0, c - 1))
      }
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  // Delete all notifications (DELETE /notifications)
  const handleClearAll = async () => {
    try {
      await notificationsService.deleteAllNotifications()
      setNotifications([])
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to clear all notifications:', err)
    }
  }

  // Global keyboard shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      } else if (e.key === 'Escape') {
        setIsNotificationOpen(false)
        setIsHelpOpen(false)
        setIsUserMenuOpen(false)
        if (searchInputRef.current) {
          searchInputRef.current.blur()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false)
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setIsHelpOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsUserMenuOpen(false)
    if (window.confirm('Are you sure you want to log out?')) {
      await logout()
      navigate('/login')
    }
  }

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200/80 sticky top-0 z-20 flex items-center justify-between select-none">
      {/* Left Section: Mobile Menu Toggle, Breadcrumbs & Dynamic Title */}
      <div className="flex items-center min-w-0 mr-4">
        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 -ml-2 mr-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />}
                {crumb.to ? (
                  <Link
                    to={crumb.to}
                    className="hover:text-[#0055FF] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      idx === breadcrumbs.length - 1
                        ? 'text-gray-700 font-semibold truncate max-w-[160px]'
                        : 'hover:text-gray-600 transition-colors'
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Dynamic Page Title */}
          <h1 className="text-lg font-bold text-[#171717] tracking-tight truncate leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Section: Global Search, Notifications, Help & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search Field */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/proposals`)
                }
              }}
              placeholder="Search proposals, clients..."
              className="w-44 sm:w-60 md:w-72 pl-9 pr-14 py-1.5 text-xs sm:text-sm bg-[#F8F9FB] hover:bg-gray-100/80 focus:bg-white border border-gray-200/90 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/15 transition-all"
            />
            {/* Keyboard Shortcut Visual or Clear Button */}
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-0.5 rounded text-gray-400 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center absolute right-2.5 pointer-events-none">
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded shadow-2xs">
                  ⌘K
                </kbd>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen)
              setIsHelpOpen(false)
              setIsUserMenuOpen(false)
            }}
            className={`relative p-2 rounded-lg transition-colors ${
              isNotificationOpen
                ? 'bg-[#EFF6FF] text-[#0055FF]'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0055FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0055FF]" />
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200/90 py-1 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#EFF6FF] text-[#0055FF] rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#0055FF] hover:text-[#0044CC] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {isLoadingNotifications ? (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#0055FF]" />
                    <span className="text-xs font-medium">Loading notifications...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0055FF] flex items-center justify-center mx-auto mb-2">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">No notifications yet</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">You are completely up to date.</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`group px-4 py-3 hover:bg-gray-50/80 transition-colors flex items-start gap-3 cursor-pointer ${
                        !item.isRead ? 'bg-blue-50/35' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          item.category === 'proposals'
                            ? 'bg-blue-50 text-[#0055FF]'
                            : item.category === 'users'
                            ? 'bg-purple-50 text-purple-600'
                            : item.category === 'clients'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.category === 'proposals' ? (
                          <FileCheck className="w-4 h-4" />
                        ) : item.category === 'users' ? (
                          <User className="w-4 h-4" />
                        ) : item.category === 'clients' ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className={`text-xs truncate ${
                              !item.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                            }`}
                          >
                            {item.title}
                          </p>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                          {item.message}
                        </p>
                      </div>

                      {/* Delete notification button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteNotification(e, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all shrink-0 mt-0.5"
                        title="Delete notification"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[11px] font-medium text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  className="text-[11px] font-medium text-[#0055FF] hover:underline ml-auto"
                  onClick={() => {
                    setIsNotificationOpen(false)
                    navigate('/proposals')
                  }}
                >
                  View proposals
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help & Documentation Dropdown */}
        <div className="relative" ref={helpRef}>
          <button
            type="button"
            onClick={() => {
              setIsHelpOpen(!isHelpOpen)
              setIsNotificationOpen(false)
              setIsUserMenuOpen(false)
            }}
            className={`p-2 rounded-lg transition-colors ${
              isHelpOpen
                ? 'bg-[#EFF6FF] text-[#0055FF]'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
            aria-label="Help and resources"
            title="Help & Resources"
          >
            <HelpCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>

          {/* Help Menu Popover */}
          {isHelpOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200/90 py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-3.5 py-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-900">
                  Help & Resources
                </span>
              </div>
              <div className="py-1">
                <a
                  href="#documentation"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsHelpOpen(false)
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-100/70 hover:text-[#0055FF] transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="flex-1">Documentation & Guides</span>
                  <ExternalLink className="w-3 h-3 text-gray-300" />
                </a>
                <a
                  href="#shortcuts"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsHelpOpen(false)
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-100/70 hover:text-[#0055FF] transition-colors"
                >
                  <Keyboard className="w-4 h-4 text-gray-400" />
                  <span className="flex-1">Keyboard Shortcuts</span>
                  <kbd className="text-[10px] bg-gray-100 px-1 rounded border border-gray-200">
                    ⌘/
                  </kbd>
                </a>
                <a
                  href="#support"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsHelpOpen(false)
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-100/70 hover:text-[#0055FF] transition-colors"
                >
                  <LifeBuoy className="w-4 h-4 text-gray-400" />
                  <span className="flex-1">Contact Support</span>
                </a>
              </div>
              <div className="px-3.5 py-2 border-t border-gray-100 bg-gray-50/50">
                <div className="text-[10px] text-gray-400">
                  ProposalOS v2.4 • Connected
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-gray-200 mx-0.5 hidden sm:block" />

        {/* User Profile Avatar with Dropdown Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen)
              setIsNotificationOpen(false)
              setIsHelpOpen(false)
            }}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="User account menu"
            aria-expanded={isUserMenuOpen}
          >
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover shadow-xs border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0055FF] to-[#00AAFF] text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                  {getInitials(user?.name)}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-gray-900 leading-none">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-gray-400 leading-none mt-1">
                {userRoleDisplay}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 transition-transform hidden sm:block" />
          </button>

          {/* User Profile Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/90 py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
              {/* User Identity Header */}
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  {user?.email || ''}
                </p>
                <div className="mt-1.5">
                  <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-[#EFF6FF] text-[#0055FF] rounded">
                    {userRoleDisplay}
                  </span>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    navigate('/profile')
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100/70 hover:text-[#0055FF] transition-colors text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    navigate('/settings/documents')
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100/70 hover:text-[#0055FF] transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Account Settings
                </button>
              </div>

              {/* Logout Option */}
              <div className="pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
