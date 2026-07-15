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
        
        {/* Partition Region Tinting */}
        {(step.rangeL !== undefined && step.rangeR !== undefined) && (
          <div 
            className="absolute bottom-0 h-full bg-amber/5 border-b-2 border-amber/30 transition-all rounded-t"
            style={{
              left: `calc(${(step.rangeL / array.length) * 100}%)`,
              width: `calc(${((step.rangeR - step.rangeL + 1) / array.length) * 100}%)`,
              zIndex: 0
            }}
          />
        )}

        {array.map((val, idx) => {
          let bgColor = 'var(--color-border-strong)'
          if (sorted.includes(idx)) bgColor = 'var(--color-teal)'
          if (compared.includes(idx)) bgColor = 'var(--color-terracotta)'
          if (highlighted.includes(idx)) bgColor = 'var(--color-amber)'

          const isSwapping = swap?.includes(idx)
          const isSorted = sorted.includes(idx)
          const isPivot = step.pivotIdx === idx
          const heightPercent = (val / maxVal) * 100

          return (
            <motion.div
              key={`${idx}-${val}`}
              layout
              initial={false}
              animate={{ 
                height: `${Math.max(heightPercent, 10)}%`,
                backgroundColor: bgColor,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`relative flex w-8 flex-col items-center justify-end rounded-t sm:w-12 ${isSorted ? 'shadow-[0_0_10px_rgba(45,212,191,0.2)]' : ''}`}
              style={{
                zIndex: isSwapping ? 10 : 1,
              }}
            >
              <span className="mb-2 font-mono text-xs font-bold text-bg sm:text-sm drop-shadow-sm">
                {val}
              </span>
              
              {/* Quick Sort / Merge Sort Pointers */}
              <div className="absolute -bottom-7 flex flex-col items-center justify-start whitespace-nowrap font-mono-tight text-[10px] font-bold">
                {isPivot && (
                  <motion.div initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center text-amber drop-shadow-md">
                    <span className="text-[8px] leading-none">▲</span>
                    <span>pivot</span>
                  </motion.div>
                )}
                {step.leftPtr === idx && (
                  <motion.div initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center text-text-muted mt-1">
                    <span className="text-[8px] leading-none">▲</span>
                    <span>i</span>
                  </motion.div>
                )}
                {step.rightPtr === idx && (
                  <motion.div initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center text-text-muted mt-1">
                    <span className="text-[8px] leading-none">▲</span>
                    <span>j</span>
                  </motion.div>
                )}
                {step.mergeK === idx && (
                  <motion.div initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center text-teal mt-1">
                    <span className="text-[8px] leading-none">▲</span>
                    <span>k</span>
                  </motion.div>
                )}
                {step.heapRoot === idx && (
                  <motion.div initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center text-amber drop-shadow-md">
                    <span className="text-[8px] leading-none">▲</span>
                    <span>root</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Temporary Arrays (Merge Sort specifically) */}
      {isMerging && (
        <div className="flex h-32 items-end justify-center gap-12 border-t border-border/50 pt-4 relative z-10">
          {/* Temp Left */}
          <div className="flex h-full items-end gap-1 sm:gap-2">
            {step.tempLeft!.map((val, idx) => {
              const isHighlight = step.mergeI === idx && step.phase !== 'merge-done'
              return (
                <div
                  key={`L-${idx}`}
                  className="flex w-8 flex-col items-center justify-end rounded-t bg-border sm:w-10 relative"
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
                    <div className="absolute -bottom-6 flex flex-col items-center font-mono-tight text-[10px] text-amber drop-shadow-md">
                      <span className="text-[8px] leading-none">▲</span>
                      <span>i</span>
                    </div>
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
                  className="flex w-8 flex-col items-center justify-end rounded-t bg-border sm:w-10 relative"
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
                    <div className="absolute -bottom-6 flex flex-col items-center font-mono-tight text-[10px] text-amber drop-shadow-md">
                      <span className="text-[8px] leading-none">▲</span>
                      <span>j</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
