import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import NotificationPanel from './NotificationPanel'
import ChatWidget from '@/components/chatbot/ChatWidget'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useMediaQuery'

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(true)
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        collapsed={isMobile ? false : sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={cn(
          isMobile && 'z-50 transition-transform',
          isMobile && !mobileOpen && '-translate-x-full'
        )}
      />

      <div
        className={cn(
          'transition-all duration-300',
          isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-[72px]' : 'ml-64'
        )}
      >
        <Navbar
          onMenuClick={() => setMobileOpen(!mobileOpen)}
          sidebarCollapsed={sidebarCollapsed}
        />

        <div className="flex">
          <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
            <Outlet />
          </main>

          {!isMobile && showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>
      </div>

      <ChatWidget />
    </div>
  )
}
