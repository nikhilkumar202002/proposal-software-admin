import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export const AdminLayout = ({ children }) => {
  const location = useLocation()

  // Sidebar collapse state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('proposalos_sidebar_collapsed')
      return saved !== null ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  // Responsive mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [prevPathname, setPrevPathname] = useState(location.pathname)

  // Automatically close mobile sidebar on route navigation
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname)
    setIsMobileOpen(false)
  }

  // Persist collapse state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'proposalos_sidebar_collapsed',
        JSON.stringify(isCollapsed)
      )
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [isCollapsed])

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#171717] flex flex-col antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Container: adjusts left margin when desktop sidebar collapses */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[250px]'
        }`}
      >
        {/* Sticky Top Header */}
        <Header
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="w-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
