/** A shared panel for displaying a labeled, horizontally-scrolling token list.
 *  Used for BFS Queue and DFS Stack displays.
 */
interface TokenPanelProps {
  title: string
  tokens: (number | string)[]
  emptyLabel?: string
  accentFirst?: boolean  // highlight first item (current head)
  accentLast?: boolean   // highlight last item (stack top)
  color?: 'amber' | 'teal' | 'terracotta'
}

export function TokenPanel({
  title,
  tokens,
  emptyLabel = 'empty',
  accentFirst = false,
  accentLast = false,
  color = 'amber',
}: TokenPanelProps) {
  const colorMap = {
    amber: {
      accent: 'bg-amber text-bg font-semibold',
      normal: 'border-border-strong text-text-muted',
    },
    teal: {
      accent: 'bg-teal text-bg font-semibold',
      normal: 'border-border-strong text-text-muted',
    },
    terracotta: {
      accent: 'bg-terracotta text-bg font-semibold',
      normal: 'border-border-strong text-text-muted',
    },
  }
  const c = colorMap[color]

  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-2 font-mono-tight text-xs uppercase tracking-wider text-text-faint">
        {title}
      </div>
      {tokens.length === 0 ? (
        <span className="font-mono-tight text-xs text-text-faint italic">{emptyLabel}</span>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {tokens.map((tok, i) => {
            const isAccent =
              (accentFirst && i === 0) || (accentLast && i === tokens.length - 1)
            return (
              <span
                key={i}
                className={`inline-flex items-center justify-center rounded border px-2.5 py-1 font-mono-tight text-sm transition-all duration-300 ${
                  isAccent ? c.accent : `bg-surface-raised border ${c.normal}`
                }`}
              >
                {tok}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Traversal order display — shows the visit sequence with arrows */
interface TraversalOrderProps {
  order: (number | string)[]
  title?: string
}

export function TraversalOrder({ order, title = 'Visit Order' }: TraversalOrderProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-2 font-mono-tight text-xs uppercase tracking-wider text-text-faint">
        {title}
      </div>
      {order.length === 0 ? (
        <span className="font-mono-tight text-xs text-text-faint italic">—</span>
      ) : (
        <div className="flex flex-wrap items-center gap-1">
          {order.map((v, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal font-mono-tight text-xs font-semibold text-bg">
                {v}
              </span>
              {i < order.length - 1 && (
                <span className="font-mono-tight text-xs text-text-faint">→</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
