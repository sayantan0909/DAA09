import { motion } from 'framer-motion'
import type { SearchStep } from '@/types/step'

interface ArraySearchViewProps {
  step: SearchStep
  target: number
}

export function ArraySearchView({ step, target }: ArraySearchViewProps) {
  const { array, currentIndex, foundIndex, low, high, mid } = step

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-text-muted">
          Searching for{' '}
          <span className="font-mono-tight font-semibold text-amber">{target}</span>
        </p>
        {foundIndex !== null && (
          <span className="rounded-full bg-teal-dim/60 px-3 py-1 font-mono-tight text-xs text-teal">
            found at index {foundIndex}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-end justify-center gap-2 py-6">
        {array.map((value, i) => {
          const isFound = foundIndex === i
          const isCurrent = currentIndex === i && !isFound
          const inRange =
            low !== undefined && high !== undefined ? i >= low && i <= high : true

          let boxColor = 'border-border bg-surface-raised text-text-muted'
          if (!inRange) boxColor = 'border-border bg-surface text-text-faint opacity-40'
          if (isCurrent) boxColor = 'border-terracotta bg-terracotta-dim/50 text-text'
          if (isFound) boxColor = 'border-teal bg-teal-dim/60 text-text'

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <motion.div
                layout
                animate={{ scale: isCurrent || isFound ? 1.08 : 1 }}
                transition={{ duration: 0.2 }}
                className={`flex h-12 w-12 items-center justify-center rounded-md border font-mono-tight text-sm font-medium ${boxColor}`}
              >
                {value}
              </motion.div>
              <span className="font-mono-tight text-[10px] text-text-faint">{i}</span>
              <div className="flex h-4 gap-1 font-mono-tight text-[9px] text-amber">
                {mid === i && <span>M</span>}
                {low === i && mid !== i && <span className="text-teal">L</span>}
                {high === i && mid !== i && <span className="text-terracotta">H</span>}
              </div>
            </div>
          )
        })}
      </div>

      <p className="border-t border-border pt-4 text-center text-sm text-text-muted">
        {step.message}
      </p>
    </div>
  )
}
