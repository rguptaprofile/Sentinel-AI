import { Moon, Sun, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchBar from '@/components/common/SearchBar'
import NotificationBell from '@/components/common/NotificationBell'
import ProfileDropdown from '@/components/common/ProfileDropdown'
import { useTheme } from '@/context/ThemeContext'
import { useState } from 'react'

export default function Navbar({ onMenuClick, sidebarCollapsed }) {
  const { theme, toggleTheme } = useTheme()
  const [search, setSearch] = useState('')

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-xl px-4 lg:px-6 shadow-sm">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <SearchBar
        placeholder="Search reports, users, transactions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md flex-1"
      />

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </header>
  )
}
