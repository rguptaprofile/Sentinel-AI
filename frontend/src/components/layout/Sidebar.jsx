import { NavLink, useNavigate } from 'react-router-dom'
import {
  Shield,
  Users,
  Landmark,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

const roleNav = {
  citizen: { label: 'Citizen Safety', icon: UserCircle, path: '/dashboard/citizen' },
  police: { label: 'Citizen Complaints', icon: Users, path: '/dashboard/police' },
  bank: { label: 'Bank Scam Alerts', icon: Landmark, path: '/dashboard/bank' },
}

export default function Sidebar({ collapsed, onToggle, className }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const navItems = [roleNav[user?.role] || roleNav.citizen]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card shadow-xl transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64',
        className
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-lg">
          <Shield className="h-5 w-5 text-white" />
        </div>
        {!collapsed && <div><h1 className="font-bold text-lg leading-tight">SentinelAI</h1><p className="text-[10px] text-muted-foreground">Public Safety Intel</p></div>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink key={item.label} to={item.path} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all', isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t p-3">
        <Button variant="ghost" className={cn('w-full justify-start gap-3 text-muted-foreground hover:text-destructive', collapsed && 'justify-center px-0')} onClick={handleLogout}>
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
        <Button variant="ghost" size="icon" className="w-full" onClick={onToggle}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  )
}
