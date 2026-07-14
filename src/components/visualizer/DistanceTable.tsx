import type { DistRow } from '@/types/graphStep'

interface DistanceTableProps {
  rows: DistRow[]
  currentVertex?: number
  relaxingVertex?: number
}

export function DistanceTable({ rows, currentVertex, relaxingVertex }: DistanceTableProps) {
  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="ledger-rule flex items-center px-3 py-2">
        <span className="font-mono-tight text-xs uppercase tracking-wider text-text-faint">
          Distance Table
        </span>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">Vertex</th>
            <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">Distance</th>
            <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">Parent</th>
            <th className="px-3 py-1.5 text-left font-mono-tight text-text-faint font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isCurrent = row.vertex === currentVertex
            const isRelaxing = row.vertex === relaxingVertex
            const bgClass = isCurrent
              ? 'bg-amber/10 border-l-2 border-amber'
              : isRelaxing
              ? 'bg-teal/10 border-l-2 border-teal'
              : row.finalized
              ? 'bg-teal/5'
              : ''

            return (
              <tr
                key={row.vertex}
                className={`border-b border-border last:border-0 transition-colors duration-300 ${bgClass}`}
              >
                <td className="px-3 py-2 font-mono-tight font-semibold text-text">
                  {row.vertex}
                  {isCurrent && (
                    <span className="ml-1.5 rounded bg-amber px-1 py-0.5 text-[9px] font-mono-tight text-bg">
                      CURRENT
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 font-mono-tight text-text-muted">
                  <span
                    className={`transition-all duration-300 ${
                      row.justRelaxed ? 'text-amber font-semibold' : ''
                    }`}
                  >
                    {row.dist === Infinity ? '∞' : row.dist}
                  </span>
                </td>
                <td className="px-3 py-2 font-mono-tight text-text-muted">
                  {row.parent === null ? '—' : row.parent}
                </td>
                <td className="px-3 py-2">
                  {row.finalized ? (
                    <span className="rounded bg-teal/20 px-1.5 py-0.5 text-[9px] font-mono-tight text-teal">
                      FINALIZED
                    </span>
                  ) : row.dist !== Infinity ? (
                    <span className="rounded bg-amber-dim/40 px-1.5 py-0.5 text-[9px] font-mono-tight text-amber">
                      TENTATIVE
                    </span>
                  ) : (
                    <span className="text-text-faint">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
