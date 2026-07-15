import { motion, AnimatePresence } from 'framer-motion'
import type { GraphStep } from '@/types/graphStep'

interface BFSQueuePanelProps {
  step: GraphStep
}

export function BFSQueuePanel({ step }: BFSQueuePanelProps) {
  const q = step.queue ?? []
  const order = step.visitOrder ?? []

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Queue Visualization */}
      <div className="flex-1 rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-4 font-mono-tight text-xs uppercase tracking-wider text-text-faint">
          Queue (FIFO)
        </h3>
        
        <div className="flex min-h-[80px] items-end gap-3 overflow-x-auto pb-2">
          {q.length === 0 ? (
            <div className="flex h-12 w-full items-center justify-center rounded border border-dashed border-border/50 px-6 text-sm italic text-text-faint">
              Queue is empty
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {q.map((item, idx) => (
                <motion.div
                  // Using item value as key works well for BFS since we don't enqueue duplicates 
                  // usually, but just in case we append idx to handle dupes if any.
                  key={`q-${item}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', bounce: 0.3 }}
                  className="relative flex flex-col items-center gap-2"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-amber/50 bg-amber-dim/20 font-mono-tight text-lg font-bold text-amber shadow-sm">
                    {item}
                  </div>
                  
                  {/* Front/Rear Labels */}
                  <div className="flex flex-col items-center text-[9px] font-bold tracking-widest">
                    {idx === 0 && <span className="text-emerald-500">FRONT</span>}
                    {idx === q.length - 1 && <span className="text-blue-500">REAR</span>}
                    {idx !== 0 && idx !== q.length - 1 && <span className="invisible">X</span>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Visit Trail */}
      <div className="flex-1 rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-4 font-mono-tight text-xs uppercase tracking-wider text-text-faint">
          Traversal Trail
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {order.length === 0 ? (
            <span className="text-sm italic text-text-faint">Not started...</span>
          ) : (
            <AnimatePresence>
              {order.map((item, idx) => (
                <motion.div
                  key={`trail-${item}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  {idx > 0 && <span className="text-text-muted">→</span>}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-raised font-mono-tight text-sm font-semibold text-text shadow-sm">
                    {item}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
