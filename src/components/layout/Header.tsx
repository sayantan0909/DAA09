import { Link } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md border border-border p-2 text-text-muted hover:text-text lg:hidden"
          aria-label="Toggle navigation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
        <Link to="/" className="flex items-center gap-2 font-mono-tight text-sm text-text-muted hover:text-text">
          <img src="/logo.png" alt="Logo" className="h-5 w-5 object-contain" />
          <span>DAA Visualizer</span>
        </Link>
      </div>

      <button
        onClick={toggleTheme}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:border-border-strong hover:text-text"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☾ Dark' : '☀ Light'}
      </button>
    </header>
  )
}
