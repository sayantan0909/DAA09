import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })

  const handleToggleCollapse = () => {
    setCollapsed((v) => {
      const next = !v
      try {
        localStorage.setItem('sidebar-collapsed', String(next))
      } catch {}
      return next
    })
  }

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <div className="flex min-w-0 flex-1 flex-col" style={{ transition: 'margin-left 200ms ease' }}>
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 px-4 py-8 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
