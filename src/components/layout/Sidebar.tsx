import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { categories } from '@/data/categories'
import { algorithms } from '@/data/algorithms'
import type { AlgorithmCategoryId } from '@/types/algorithm'

interface SidebarProps {
  open: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

// Category icons (SVG paths) for the collapsed icon rail
const CATEGORY_ICONS: Record<AlgorithmCategoryId, ReactNode> = {
  searching: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  sorting: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M7 12h10M11 18h2" />
    </svg>
  ),
  'divide-conquer': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
    </svg>
  ),
  graph: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="19" cy="19" r="2" />
      <path d="M7 12h10M17 6.5l-10 4M17 17.5l-10-4" />
    </svg>
  ),
  dp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
}

export function Sidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
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
        style={{
          width: collapsed ? '56px' : '288px',
          transition: 'width 200ms ease',
          minWidth: collapsed ? '56px' : '288px',
        }}
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-surface overflow-hidden lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* ── Header / Collapse toggle ── */}
        <div className="ledger-rule flex items-center gap-2 px-3 py-3 shrink-0">
          {!collapsed && (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-6 w-6 shrink-0 object-contain" />
              <div className="min-w-0">
                <p className="font-mono-tight text-[10px] uppercase tracking-wider text-text-faint leading-none mb-0.5">
                  Lab Record
                </p>
                <h1 className="font-mono-tight text-base font-semibold text-text truncate">
                  DAA Visualizer
                </h1>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex w-full justify-center">
              <img src="/logo.png" alt="Logo" className="h-6 w-6 object-contain" />
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex shrink-0 items-center justify-center rounded-md border border-border p-1.5 text-text-faint hover:border-border-strong hover:text-text transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* ── Search (expanded only) ── */}
        {!collapsed && (
          <div className="px-3 py-2 shrink-0">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search algorithm…"
              className="w-full rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-text placeholder:text-text-faint focus:border-amber focus:outline-none"
            />
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
          {collapsed ? (
            /* Icon rail */
            <div className="flex flex-col items-center gap-1 px-2 pt-2">
              {categories.map((cat) => {
                const items = algorithms.filter((a) => a.category === cat.id)
                return (
                  <div key={cat.id} className="w-full">
                    <div
                      className="flex w-full items-center justify-center rounded-md p-2 text-text-faint"
                      title={cat.label}
                    >
                      {CATEGORY_ICONS[cat.id]}
                    </div>
                    {items.map((a) => (
                      <NavLink
                        key={a.slug}
                        to={`${cat.path}/${a.slug}`}
                        onClick={onClose}
                        title={`${String(a.exptNo).padStart(2, '0')} — ${a.name}`}
                        className={({ isActive }) =>
                          `flex items-center justify-center rounded-md p-1.5 mb-0.5 transition-colors ${
                            isActive
                              ? 'bg-amber-dim/40 text-amber'
                              : 'text-text-faint hover:bg-surface-raised hover:text-text'
                          }`
                        }
                      >
                        <span className="font-mono-tight text-[11px] font-semibold">
                          {String(a.exptNo).padStart(2, '0')}
                        </span>
                      </NavLink>
                    ))}
                    <div className="my-1.5 border-t border-border/50 mx-2" />
                  </div>
                )
              })}
            </div>
          ) : (
            /* Full nav */
            <div className="px-3 pt-1">
              {categories.map((cat) => {
                const items = filtered.filter((a) => a.category === cat.id)
                if (query && items.length === 0) return null

                return (
                  <div key={cat.id} className="mb-5">
                    <div className="flex items-center gap-2 px-2 pb-2">
                      <span className="text-text-faint">{CATEGORY_ICONS[cat.id]}</span>
                      <p className="font-mono-tight text-[11px] font-semibold uppercase tracking-wider text-text-faint">
                        {cat.label}
                      </p>
                    </div>
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
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}
