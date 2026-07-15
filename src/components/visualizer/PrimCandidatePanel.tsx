import { motion, AnimatePresence } from 'framer-motion'
import type { GraphStep } from '@/types/graphStep'

interface PrimCandidatePanelProps {
  step: GraphStep
}

export function PrimCandidatePanel({ step }: PrimCandidatePanelProps) {
  const candidates = step.candidateEdges ?? []
  const mstCost = step.mstCost ?? 0

  return (
    <div className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono-tight text-xs uppercase tracking-wider text-text-faint">
          Priority Queue (Candidate Edges)
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-mono-tight text-xs text-text-muted">MST Cost:</span>
          <span className="font-mono-tight text-sm font-bold text-amber">{mstCost}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {candidates.length === 0 ? (
          <span className="text-sm italic text-text-faint">Queue is empty</span>
        ) : (
          <AnimatePresence mode="popLayout">
            {candidates.map((edge, idx) => (
              <motion.div
                key={`edge-${edge.from}-${edge.to}-${edge.weight}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                className={`relative flex min-w-[56px] flex-col items-center justify-center rounded border px-3 py-1.5 transition-colors ${
                  edge.isMin
                    ? 'border-amber/50 bg-amber-dim/20 text-amber'
                    : 'border-border bg-surface-raised text-text-muted'
                }`}
              >
                <div className="font-mono-tight text-xs font-semibold">
                  {edge.from}-{edge.to}
                </div>
                <div className="font-mono-tight text-[10px] opacity-70">
                  w={edge.weight}
                </div>
                {edge.isMin && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: -6, opacity: 1 }}
                    className="absolute -top-5 text-[10px] font-bold tracking-wider text-amber drop-shadow-md"
                  >
                    ★ MIN
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
