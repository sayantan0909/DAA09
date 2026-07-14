import { motion } from 'framer-motion'
import type { SortStep } from '@/types/sortStep'

interface SortingVisualizerProps {
  step: SortStep
}

export function SortingVisualizer({ step }: SortingVisualizerProps) {
  const { array, highlighted, compared, sorted, swap } = step
  const maxVal = Math.max(...array, 1)

  // Subarray rendering (e.g. for Merge Sort temp arrays)
  const isMerging = step.phase.startsWith('merge-') && step.tempLeft && step.tempRight

  return (
    <div className="flex flex-col gap-8">
      {/* Main Array */}
      <div className="relative flex h-64 items-end justify-center gap-1 sm:gap-2">
        {array.map((val, idx) => {
          let bgColor = 'var(--color-border-strong)'
          if (sorted.includes(idx)) bgColor = 'var(--color-teal)'
          if (compared.includes(idx)) bgColor = 'var(--color-terracotta)'
          if (highlighted.includes(idx)) bgColor = 'var(--color-amber)'

          const isSwapping = swap?.includes(idx)
          const heightPercent = (val / maxVal) * 100

          return (
            <motion.div
              key={`${idx}-${val}`}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative flex w-8 flex-col items-center justify-end rounded-t sm:w-12"
              style={{
                height: `${Math.max(heightPercent, 10)}%`,
                backgroundColor: bgColor,
                zIndex: isSwapping ? 10 : 1,
              }}
            >
              <span className="mb-2 font-mono text-xs font-bold text-bg sm:text-sm">
                {val}
              </span>
              
              {/* Quick Sort / Merge Sort Pointers */}
              <div className="absolute -bottom-6 flex w-full justify-center whitespace-nowrap font-mono-tight text-[10px] font-bold text-text-faint">
                {step.pivotIdx === idx && <span className="text-amber">pivot</span>}
                {step.leftPtr === idx && <span className="text-text">i</span>}
                {step.rightPtr === idx && <span className="text-text">j</span>}
                {step.mergeK === idx && <span className="text-teal">k</span>}
                {step.heapRoot === idx && <span className="text-amber">root</span>}
              </div>
            </motion.div>
          )
        })}

        {/* Partition Bounds for Quick Sort or Merge Sort */}
        {(step.rangeL !== undefined && step.rangeR !== undefined) && (
          <div 
            className="absolute -bottom-2 h-1 bg-amber/30 transition-all"
            style={{
              left: `calc(${(step.rangeL / array.length) * 100}% + 4px)`,
              width: `calc(${((step.rangeR - step.rangeL + 1) / array.length) * 100}% - 8px)`
            }}
          />
        )}
      </div>

      {/* Temporary Arrays (Merge Sort specifically) */}
      {isMerging && (
        <div className="flex h-32 items-end justify-center gap-12 border-t border-border/50 pt-4">
          {/* Temp Left */}
          <div className="flex h-full items-end gap-1 sm:gap-2">
            {step.tempLeft!.map((val, idx) => {
              const isHighlight = step.mergeI === idx && step.phase !== 'merge-done'
              return (
                <div
                  key={`L-${idx}`}
                  className="flex w-8 flex-col items-center justify-end rounded-t bg-border sm:w-10"
                  style={{
                    height: `${Math.max((val / maxVal) * 100, 10)}%`,
                    backgroundColor: isHighlight ? 'var(--color-amber)' : 'var(--color-border)',
                    opacity: idx < (step.mergeI ?? 0) ? 0.3 : 1
                  }}
                >
                  <span className="mb-1 font-mono text-xs font-bold text-bg">
                    {val}
                  </span>
                  {isHighlight && (
                    <div className="absolute -bottom-5 font-mono-tight text-[10px] text-amber">i</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Temp Right */}
          <div className="flex h-full items-end gap-1 sm:gap-2">
            {step.tempRight!.map((val, idx) => {
              const isHighlight = step.mergeJ === idx && step.phase !== 'merge-done'
              return (
                <div
                  key={`R-${idx}`}
                  className="flex w-8 flex-col items-center justify-end rounded-t bg-border sm:w-10"
                  style={{
                    height: `${Math.max((val / maxVal) * 100, 10)}%`,
                    backgroundColor: isHighlight ? 'var(--color-amber)' : 'var(--color-border)',
                    opacity: idx < (step.mergeJ ?? 0) ? 0.3 : 1
                  }}
                >
                  <span className="mb-1 font-mono text-xs font-bold text-bg">
                    {val}
                  </span>
                  {isHighlight && (
                    <div className="absolute -bottom-5 font-mono-tight text-[10px] text-amber">j</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Action / Explanation Message */}
      <div className="rounded border border-border bg-surface-raised p-4">
        <p className="font-mono text-sm text-text">
          {step.message}
        </p>
      </div>
    </div>
  )
}
