import { motion, AnimatePresence } from 'framer-motion'
import type { SortStep } from '@/types/sortStep'

interface HeapTreePanelProps {
  step: SortStep
}

export function HeapTreePanel({ step }: HeapTreePanelProps) {
  const { array, heapSize = array.length, highlighted, compared, sorted, swap } = step
  
  // Calculate tree layout
  const levelHeight = 60
  const nodeRadius = 18
  const width = 600
  const height = 240
  
  const getPos = (index: number) => {
    const level = Math.floor(Math.log2(index + 1))
    const indexInLevel = index - (Math.pow(2, level) - 1)
    const nodesInLevel = Math.pow(2, level)
    const xSpacing = width / (nodesInLevel + 1)
    const x = xSpacing * (indexInLevel + 1)
    const y = 30 + level * levelHeight
    return { x, y }
  }

  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-[#0d1117] p-4 overflow-x-auto w-full">
      <div className="mb-4 flex w-full items-center justify-between">
        <h3 className="font-mono-tight text-xs font-semibold uppercase tracking-wider text-text-faint">
          Binary Heap Structure
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-mono-tight text-[10px] uppercase text-text-muted">Heap Size</span>
          <span className="font-mono-tight text-sm font-bold text-amber">{heapSize}</span>
        </div>
      </div>

      <div className="min-w-[600px] flex justify-center">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Draw Links */}
          {array.map((_, i) => {
            const leftIdx = 2 * i + 1
            const rightIdx = 2 * i + 2
            const pos1 = getPos(i)
            
            return (
              <g key={`links-${i}`}>
                {leftIdx < array.length && (
                  <line
                    x1={pos1.x} y1={pos1.y} x2={getPos(leftIdx).x} y2={getPos(leftIdx).y}
                    stroke={leftIdx >= heapSize ? "rgba(20, 184, 166, 0.2)" : "rgba(255,255,255,0.15)"} 
                    strokeWidth={2}
                    strokeDasharray={leftIdx >= heapSize ? "4,4" : "none"}
                  />
                )}
                {rightIdx < array.length && (
                  <line
                    x1={pos1.x} y1={pos1.y} x2={getPos(rightIdx).x} y2={getPos(rightIdx).y}
                    stroke={rightIdx >= heapSize ? "rgba(20, 184, 166, 0.2)" : "rgba(255,255,255,0.15)"} 
                    strokeWidth={2}
                    strokeDasharray={rightIdx >= heapSize ? "4,4" : "none"}
                  />
                )}
              </g>
            )
          })}
          
          {/* Draw Nodes */}
          <AnimatePresence>
            {array.map((val, i) => {
              const pos = getPos(i)
              const isSorted = sorted.includes(i)
              const isOutOfBounds = i >= heapSize
              const isHighlighted = highlighted.includes(i)
              const isCompared = compared.includes(i)
              
              let fill = '#1e293b' // bg-surface-raised
              let stroke = '#334155' // border-border
              let color = '#f8fafc' // text
              
              if (isSorted || isOutOfBounds) {
                fill = 'rgba(20, 184, 166, 0.1)'
                stroke = '#14b8a6'
                color = '#14b8a6'
              } else if (isHighlighted) {
                fill = 'rgba(245, 158, 11, 0.2)'
                stroke = '#f59e0b'
                color = '#f59e0b'
              } else if (isCompared) {
                fill = 'rgba(239, 68, 68, 0.2)'
                stroke = '#ef4444'
                color = '#ef4444'
              }
              
              const isSwapping = swap?.includes(i)
              
              return (
                <motion.g
                  key={`${i}-${val}`}
                  layout
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: isOutOfBounds && !isSorted ? 0.3 : 1, 
                    x: pos.x, 
                    y: pos.y 
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: 'spring', bounce: 0.3 }}
                >
                  <motion.circle 
                    animate={{ scale: isSwapping ? 1.3 : 1 }}
                    cx={0} 
                    cy={0} 
                    r={nodeRadius} 
                    fill={fill} 
                    stroke={stroke} 
                    strokeWidth={2} 
                  />
                  <text 
                    x={0} 
                    y={0} 
                    textAnchor="middle" 
                    dy=".35em" 
                    fontSize={13} 
                    fontWeight="bold" 
                    fill={color} 
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                  {/* Highlight root if sorting is active */}
                  {i === step.heapRoot && (
                    <motion.text
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: -26 }}
                      x={0}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight="bold"
                      fill="#f59e0b"
                      fontFamily="monospace"
                    >
                      root
                    </motion.text>
                  )}
                </motion.g>
              )
            })}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  )
}
