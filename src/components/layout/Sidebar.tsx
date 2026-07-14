import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { categories } from '@/data/categories'
import { algorithms } from '@/data/algorithms'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return algorithms
    return algorithms.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-surface transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="ledger-rule px-5 py-4">
          <p className="font-mono-tight text-xs uppercase tracking-wider text-text-faint">
            Lab Record
          </p>
          <h1 className="font-mono-tight text-lg font-semibold text-text">
            DAA Visualizer
          </h1>
        </div>

        <div className="px-5 py-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search algorithm…"
            className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-amber focus:outline-none"
          />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {categories.map((cat) => {
            const items = filtered.filter((a) => a.category === cat.id)
            if (query && items.length === 0) return null

            return (
              <div key={cat.id} className="mb-5">
                <p className="px-2 pb-2 font-mono-tight text-[11px] font-semibold uppercase tracking-wider text-text-faint">
                  {cat.label}
                </p>
                <ul className="space-y-0.5">
                  {items.map((a) => (
                    <li key={a.slug}>
                      <NavLink
                        to={`${cat.path}/${a.slug}`}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                            isActive
                              ? 'bg-amber-dim/40 text-amber'
                              : 'text-text-muted hover:bg-surface-raised hover:text-text'
                          }`
                        }
                      >
                        <span className="font-mono-tight text-[11px] text-text-faint">
                          {String(a.exptNo).padStart(2, '0')}
                        </span>
                        <span className="truncate">{a.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
