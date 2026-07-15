import { motion, AnimatePresence } from 'framer-motion'
import type { GraphStep } from '@/types/graphStep'

interface DFSStackPanelProps {
  step: GraphStep
}

export function DFSStackPanel({ step }: DFSStackPanelProps) {
  const stack = step.stack ?? []
  const callStack = step.callStack ?? [] // Used for recursion trace if provided
  const order = step.visitOrder ?? []
  const isBacktrack = step.isBacktrack

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Stack Visualization */}
      <div className="flex-1 rounded-lg border border-border bg-surface p-4">
        <h3 className="mb-4 font-mono-tight text-xs uppercase tracking-wider text-text-faint">
          Stack (LIFO)
        </h3>
        
        {/* Stack container (bottom-to-top) */}
        <div className="relative flex flex-col justify-end min-h-[160px] w-full items-center rounded border border-dashed border-border/50 p-4 pt-12 overflow-hidden bg-[#0d1117]">
          {stack.length === 0 ? (
            <span className="text-sm italic text-text-faint">Stack is empty</span>
          ) : (
            <div className="flex w-full max-w-[140px] flex-col justify-end gap-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {stack.map((item, idx) => {
                  const isTop = idx === stack.length - 1
                  
                  // Label depends on if we're using explicit nodes or call stack names
                  // Usually graph steps return node labels in 'stack'.
                  // We'll use callStack if it has the same length, otherwise use item.
                  let displayLabel = item
                  if (callStack.length === stack.length) {
                    displayLabel = callStack[idx].fn + callStack[idx].args
                  } else {
                    displayLabel = `DFS(${item})` // Enforce DFS() format as requested
                  }

                  return (
                    <motion.div
                      // Reverse index trick so popLayout works well with flex-col-reverse or normal flex-col
                      // Actually, for stack (bottom up), we want normal flex-col with justify-end
                      key={`stack-${item}-${idx}`}
                      layout
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        boxShadow: isTop && isBacktrack ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none',
                        borderColor: isTop && isBacktrack ? '#ef4444' : undefined,
                      }}
                      exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ type: 'spring', bounce: 0.3 }}
                      className={`relative flex min-h-[40px] w-full items-center justify-center rounded border font-mono-tight text-sm font-semibold shadow-sm transition-colors ${
                        isTop
                          ? isBacktrack
                            ? 'border-red-500/50 bg-red-500/10 text-red-400'
                            : 'border-amber/50 bg-amber-dim/20 text-amber'
                          : 'border-border bg-surface-raised text-text-muted'
                      }`}
                    >
                      <span className="truncate px-2">{displayLabel}</span>

                      {/* TOP marker */}
                      {isTop && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute -right-12 flex items-center gap-1 text-[10px] font-bold tracking-widest text-amber"
                        >
                          <span className="text-amber">◀</span>
                          TOP
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
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
