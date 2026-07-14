import type { KruskalEdgeRow, Subset } from '@/types/graphStep'

interface KruskalPanelProps {
  sortedEdges: KruskalEdgeRow[]
  subsets: Subset[]
  mstCost: number
  mstEdges: { from: string | number; to: string | number; weight: number }[]
}

const STATUS_STYLE: Record<KruskalEdgeRow['status'], string> = {
  pending:  'text-text-faint',
  active:   'bg-amber/10 border-l-2 border-amber text-amber',
  accepted: 'bg-teal/10 text-teal',
  rejected: 'bg-terracotta/10 text-terracotta line-through opacity-60',
}

export function KruskalPanel({ sortedEdges, subsets, mstCost, mstEdges }: KruskalPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {/* Sorted Edge List */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="ledger-rule px-3 py-2">
          <span className="font-mono-tight text-xs uppercase tracking-wider text-text-faint">
            Sorted Edges
          </span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">#</th>
              <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">Edge</th>
              <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">Weight</th>
              <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">Decision</th>
            </tr>
          </thead>
          <tbody>
            {sortedEdges.map((e, i) => (
              <tr
                key={i}
                className={`border-b border-border last:border-0 transition-colors duration-300 ${STATUS_STYLE[e.status]}`}
              >
                <td className="px-3 py-1.5 font-mono-tight text-text-faint">{i + 1}</td>
                <td className="px-3 py-1.5 font-mono-tight">{e.from} – {e.to}</td>
                <td className="px-3 py-1.5 font-mono-tight font-semibold">{e.weight}</td>
                <td className="px-3 py-1.5">
                  {e.status === 'accepted' && (
                    <span className="rounded bg-teal/20 px-1.5 py-0.5 font-mono-tight text-[9px] text-teal">✅ ACCEPT</span>
                  )}
                  {e.status === 'rejected' && (
                    <span className="rounded bg-terracotta/20 px-1.5 py-0.5 font-mono-tight text-[9px] text-terracotta">❌ REJECT</span>
                  )}
                  {e.status === 'active' && (
                    <span className="rounded bg-amber/20 px-1.5 py-0.5 font-mono-tight text-[9px] text-amber">👁 CHECKING</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Union-Find State */}
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <div className="ledger-rule px-3 py-2">
            <span className="font-mono-tight text-xs uppercase tracking-wider text-text-faint">
              Union-Find (Parent / Rank)
            </span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">Vertex</th>
                <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">Parent</th>
                <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">Rank</th>
              </tr>
            </thead>
            <tbody>
              {subsets.map((s) => {
                const isRoot = s.parent === s.id
                return (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-1.5 font-mono-tight font-semibold text-text">{s.id}</td>
                    <td className={`px-3 py-1.5 font-mono-tight ${isRoot ? 'text-amber' : 'text-text-muted'}`}>
                      {s.parent}{isRoot && ' (root)'}
                    </td>
                    <td className="px-3 py-1.5 font-mono-tight text-text-muted">{s.rank}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* MST progress */}
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="mb-2 font-mono-tight text-xs uppercase tracking-wider text-text-faint">
            MST Progress
          </div>
          <div className="mb-1.5 flex items-baseline gap-2">
            <span className="font-mono-tight text-2xl font-semibold text-teal">{mstCost}</span>
            <span className="text-xs text-text-faint">total cost</span>
          </div>
          {mstEdges.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {mstEdges.map((e, i) => (
                <span
                  key={i}
                  className="rounded border border-teal/30 bg-teal/10 px-1.5 py-0.5 font-mono-tight text-xs text-teal"
                >
                  {e.from}–{e.to}({e.weight})
                </span>
              ))}
            </div>
          ) : (
            <span className="font-mono-tight text-xs text-text-faint italic">No edges yet</span>
          )}
        </div>
      </div>
    </div>
  )
}
