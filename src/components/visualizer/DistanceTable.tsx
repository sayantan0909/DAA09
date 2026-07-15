import { motion, AnimatePresence } from 'framer-motion'
import type { DistRow } from '@/types/graphStep'

interface DistanceTableProps {
  rows: DistRow[]
  currentVertex?: number
  relaxingVertex?: number
  relaxationCheck?: {
    u: string
    v: string
    weight: number
    distU: number
    distV: number
    isRelaxed: boolean
  }
}

export function DistanceTable({ rows, currentVertex, relaxingVertex, relaxationCheck }: DistanceTableProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Relaxation Callout */}
      <AnimatePresence mode="popLayout">
        {relaxationCheck && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`rounded-lg border p-4 ${relaxationCheck.isRelaxed ? 'border-amber/50 bg-amber-dim/10' : 'border-border bg-surface'}`}>
              <div className="mb-2 font-mono-tight text-[10px] uppercase tracking-widest text-text-muted">
                Relaxation Check
              </div>
              <div className="flex items-center gap-3 font-mono-tight text-sm">
                <span className="text-text-muted">
                  dist[{relaxationCheck.u}] + w({relaxationCheck.u},{relaxationCheck.v})
                </span>
                <span className="text-text font-bold">
                  {relaxationCheck.distU === Infinity ? '∞' : relaxationCheck.distU} + {relaxationCheck.weight}
                </span>
                <span className="text-text font-bold">=</span>
                <span className="text-amber font-bold">
                  {relaxationCheck.distU === Infinity ? '∞' : relaxationCheck.distU + relaxationCheck.weight}
                </span>
                <span className="text-text-muted mx-2">
                  {relaxationCheck.isRelaxed ? '<' : '≥'}
                </span>
                <span className="text-text-muted">
                  dist[{relaxationCheck.v}]
                </span>
                <span className="text-text font-bold">
                  ({relaxationCheck.distV === Infinity ? '∞' : relaxationCheck.distV})
                </span>
              </div>
              <div className="mt-2 text-xs font-semibold">
                {relaxationCheck.isRelaxed ? (
                  <span className="text-emerald-500">✓ Distance improved. Update dist[{relaxationCheck.v}].</span>
                ) : (
                  <span className="text-red-400">✗ No improvement.</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <AnimatePresence>
              {rows.map((row) => {
                const isCurrent = row.vertex === currentVertex?.toString() || row.vertex === currentVertex // handle string vs number
                const isRelaxing = row.vertex === relaxingVertex?.toString() || row.vertex === relaxingVertex
                const bgClass = isCurrent
                  ? 'bg-amber/10 border-l-2 border-amber'
                  : isRelaxing
                  ? 'bg-teal/10 border-l-2 border-teal'
                  : row.finalized
                  ? 'bg-teal/5'
                  : ''

                return (
                  <motion.tr
                    layout
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
                    <td className="px-3 py-2 font-mono-tight text-text-muted relative">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={row.dist} // Re-animate on dist change
                          initial={row.justRelaxed ? { y: -10, opacity: 0, color: '#fbbf24' } : false}
                          animate={{ y: 0, opacity: 1, color: row.justRelaxed ? '#fbbf24' : 'inherit' }}
                          className={`inline-block transition-colors duration-300 ${
                            row.justRelaxed ? 'font-bold' : ''
                          }`}
                        >
                          {row.dist === Infinity ? '∞' : row.dist}
                        </motion.span>
                      </AnimatePresence>
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
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
