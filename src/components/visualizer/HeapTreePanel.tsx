import { motion } from 'framer-motion'
import type { SortStep } from '@/types/sortStep'

interface HeapTreePanelProps {
  step: SortStep
}

export function HeapTreePanel({ step }: HeapTreePanelProps) {
  const { array, heapSize = array.length, highlighted, compared, sorted, swap } = step

  // We want to render a binary tree of the array up to heapSize.
  // The rest are sorted and can be shown at the bottom or just grayed out.

  return (
    <div className="mt-8 rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-4 font-mono-tight text-sm font-semibold uppercase tracking-wider text-text">
        Binary Heap Representation
      </h3>
      <div className="flex justify-center overflow-x-auto pb-8 pt-4">
        <HeapNode 
          index={0} 
          array={array} 
          heapSize={heapSize} 
          highlighted={highlighted}
          compared={compared}
          sorted={sorted}
          swap={swap}
        />
      </div>
    </div>
  )
}

interface HeapNodeProps {
  index: number
  array: number[]
  heapSize: number
  highlighted: number[]
  compared: number[]
  sorted: number[]
  swap?: [number, number]
}

function HeapNode({ index, array, heapSize, highlighted, compared, sorted, swap }: HeapNodeProps) {
  if (index >= array.length) return null

  const val = array[index]
  const leftIdx = 2 * index + 1
  const rightIdx = 2 * index + 2

  const hasLeft = leftIdx < array.length
  const hasRight = rightIdx < array.length

  const isSorted = sorted.includes(index)
  const isOutOfBounds = index >= heapSize

  let bgColor = 'bg-surface-raised border-border text-text'
  if (isSorted || isOutOfBounds) {
    bgColor = 'bg-teal/10 border-teal text-teal'
  } else if (highlighted.includes(index)) {
    bgColor = 'bg-amber border-amber text-bg'
  } else if (compared.includes(index)) {
    bgColor = 'bg-terracotta border-terracotta text-bg'
  }

  const isSwapping = swap?.includes(index)

  return (
    <div className="flex flex-col items-center">
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 font-mono text-sm font-bold shadow-sm ${bgColor} ${isSwapping ? 'z-20 scale-110' : ''}`}
        style={{ opacity: isOutOfBounds && !isSorted ? 0.3 : 1 }}
      >
        {val}
      </motion.div>
      
      {(hasLeft || hasRight) && (
        <div className="relative mt-6 flex gap-4 sm:gap-12">
          {/* Simple lines connecting parent to children */}
          <div className="absolute left-1/2 top-[-24px] h-6 w-px bg-border/50" />
          {hasLeft && (
            <div className="relative flex flex-col items-center">
              <div className="absolute right-1/2 top-[-24px] h-px w-[calc(100%+16px)] bg-border/50 sm:w-[calc(100%+24px)]" />
              <HeapNode 
                index={leftIdx} 
                array={array} 
                heapSize={heapSize} 
                highlighted={highlighted}
                compared={compared}
                sorted={sorted}
                swap={swap}
              />
            </div>
          )}
          {hasRight && (
            <div className="relative flex flex-col items-center">
              <div className="absolute left-1/2 top-[-24px] h-px w-[calc(100%+16px)] bg-border/50 sm:w-[calc(100%+24px)]" />
              <HeapNode 
                index={rightIdx} 
                array={array} 
                heapSize={heapSize} 
                highlighted={highlighted}
                compared={compared}
                sorted={sorted}
                swap={swap}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
