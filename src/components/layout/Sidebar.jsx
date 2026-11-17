import { NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    FileText,
    Users,
    Sliders,
    Building2,
    Coins,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    X,
} from 'lucide-react'
import logoBlack from '../../assets/Domine-Dude_black.png'

const workspaceLinks = [
    {
        name: 'Dashboard',
        to: '/',
        exact: true,
        icon: LayoutDashboard,
    },
    {
        name: 'Proposals',
        to: '/proposals',
        icon: FileText,
        badge: '12',
    },
    {
        name: 'Clients',
        to: '/clients',
        icon: Users,
    },
]

const managementLinks = [
    {
        name: 'Company Profile',
        to: '/settings/company',
        icon: Building2,
    },
    {
        name: 'Document Settings',
        to: '/settings/documents',
        icon: Sliders,
    },
    {
        name: 'Currency & Defaults',
        to: '/settings/currency',
        icon: Coins,
    },
]

export const Sidebar = ({
    isCollapsed = false,
    setIsCollapsed = () => { },
    isMobileOpen = false,
    setIsMobileOpen = () => { },
}) => {
    const location = useLocation()

    const handleLinkClick = () => {
        if (isMobileOpen) {
            setIsMobileOpen(false)
        }
    }

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            console.log('Logging out...')
        }
    }

    const isRouteActive = (to, exact = false) => {
        if (exact) {
            return location.pathname === to || location.pathname === '/dashboard'
        }
        return location.pathname.startsWith(to)
    }

    const renderNavItem = (item) => {
        const Icon = item.icon
        const active = isRouteActive(item.to, item.exact)

        return (
            <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={handleLinkClick}
                className={`group relative flex items-center rounded-lg text-sm font-medium transition-colors duration-150 ${isCollapsed ? 'justify-center h-11 w-11 mx-auto my-1' : 'h-10 px-3 my-0.5'
                    } ${active
                        ? 'bg-[#EFF6FF] text-[#0055FF]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                    }`}
            >
                {/* Left active indicator pill when expanded */}
                {!isCollapsed && active && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#0055FF] rounded-r-full" />
                )}

                <Icon
                    className={`shrink-0 transition-colors ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'
                        } ${active ? 'text-[#0055FF]' : 'text-gray-500 group-hover:text-gray-800'}`}
                />

                {!isCollapsed && (
                    <span className="flex-1 truncate tracking-tight">{item.name}</span>
                )}

                {!isCollapsed && item.badge && (
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${active
                            ? 'bg-[#0055FF]/10 text-[#0055FF]'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200/80'
                            }`}
                    >
                        {item.badge}
                    </span>
                )}

                {/* Floating Tooltip when collapsed */}
                {isCollapsed && (
                    <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.badge && (
                            <span className="px-1.5 py-0.2 bg-[#0055FF] text-white text-[10px] rounded-full">
                                {item.badge}
                            </span>
                        )}
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                )}
            </NavLink>
        )
    }

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Fixed Left Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-gray-200/80 flex flex-col transition-all duration-300 ease-in-out select-none ${isCollapsed ? 'w-[72px]' : 'w-[250px]'
                    } ${isMobileOpen
                        ? 'translate-x-0 w-[260px]'
                        : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Brand Header with Logo from Assets */}
                <div className="h-16 flex items-center justify-between px-3.5 border-b border-gray-100/90 shrink-0">
                    <div className="flex items-center min-w-0">
                        {(!isCollapsed || isMobileOpen) ? (
                            /* Expanded: Full logo from assets with subtle ProposalOS badge */
                            <div className="flex items-center gap-2">
                                <img
                                    src={logoBlack}
                                    alt="Domain Dude"
                                    className="h-8 max-h-8 w-auto object-contain"
                                />
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#0055FF] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#0055FF]/15">
                                    Proposals
                                </span>
                            </div>
                        ) : (
                            /* Collapsed: Blue logo mark neatly cropped */
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-start overflow-hidden mx-auto bg-blue-50/40 border border-blue-100/60 p-0.5"
                                title="Domain Dude - ProposalOS"
                            >
                                <img
                                    src={logoBlack}
                                    alt="Domain Dude Logo"
                                    className="h-7.5 max-w-none object-cover object-left"
                                />
                            </div>
                        )}
                    </div>

                    {/* Desktop Collapse / Expand Button */}
                    <button
                        type="button"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-1"
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className="w-4 h-4 text-gray-600" />
                        ) : (
                            <PanelLeftClose className="w-4 h-4 text-gray-600" />
                        )}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Area */}
                <div
                    className={`flex-1 py-4 flex flex-col justify-between ${isCollapsed && !isMobileOpen ? 'overflow-visible px-2' : 'overflow-y-auto px-3'
                        }`}
                >
                    <div className="space-y-6">
                        {/* Workspace Section */}
                        <div>
                            {(!isCollapsed || isMobileOpen) ? (
                                <div className="px-3 mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                    Workspace
                                </div>
                            ) : (
                                <div className="h-px bg-gray-100 my-2 mx-1" />
                            )}
                            <nav className="flex flex-col">
                                {workspaceLinks.map((item) => renderNavItem(item))}
                            </nav>
                        </div>

                        {/* Management Section */}
                        <div>
                            {(!isCollapsed || isMobileOpen) ? (
                                <div className="px-3 mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                    Management
                                </div>
                            ) : (
                                <div className="h-px bg-gray-100 my-2 mx-1" />
                            )}
                            <nav className="flex flex-col">
                                {managementLinks.map((item) => renderNavItem(item))}
                            </nav>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="pt-4 mt-auto border-t border-gray-100/90 space-y-2">
                        {/* User Profile Card */}
                        <div
                            className={`relative rounded-xl border border-gray-100 bg-gray-50/70 p-2 transition-all ${isCollapsed && !isMobileOpen ? 'flex justify-center p-1.5' : 'flex items-center gap-2.5'
                                }`}
                        >
                            {/* User Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0055FF] to-[#00AAFF] text-white font-semibold text-xs flex items-center justify-center shadow-xs ring-2 ring-white">
                                    AM
                                </div>
                                <span
                                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500/20"
                                    title="Online"
                                />
                            </div>

                            {/* User Details */}
                            {(!isCollapsed || isMobileOpen) && (
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-gray-900 truncate">
                                        Alex Morgan
                                    </div>
                                    <div className="text-[11px] text-gray-500 truncate">
                                        Workspace Admin
                                    </div>
                                </div>
                            )}

                            {/* Logout Button */}
                            {(!isCollapsed || isMobileOpen) ? (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Log out"
                                    aria-label="Log out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            ) : (
                                /* Tooltip for user profile when collapsed */
                                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                                    Alex Morgan (Admin)
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
