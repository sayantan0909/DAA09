import { motion, AnimatePresence } from 'framer-motion'
import type { Subset } from '@/types/graphStep'

interface UnionFindPanelProps {
  subsets: Subset[]
}

export function UnionFindPanel({ subsets }: UnionFindPanelProps) {
  // Find all roots
  const roots = subsets.filter(s => s.parent === s.id)
  
  // Helper to find immediate children
  const getChildren = (parentId: string | number) => subsets.filter(s => s.parent === parentId && s.id !== parentId)
  
  // Recursive tree renderer
  const renderTree = (nodeId: string | number, isRoot = false) => {
    const children = getChildren(nodeId)
    const s = subsets.find(sub => sub.id === nodeId)!
    
    return (
      <div key={nodeId} className="flex flex-col items-center relative">
        {!isRoot && (
          <div className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 -translate-y-full bg-border/80" />
        )}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm font-mono-tight text-sm font-bold ${
            isRoot ? 'border-amber/50 bg-amber-dim/20 text-amber' : 'border-border bg-surface-raised text-text'
          }`}
        >
          {s.id}
        </motion.div>
        
        {children.length > 0 && (
          <div className="mt-3 flex gap-4 relative pt-3">
            {/* Horizontal connector for siblings */}
            {children.length > 1 && (
              <div className="absolute top-0 left-4 right-4 h-px bg-border/80" />
            )}
            {/* Vertical connector from parent */}
            <div className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-border/80" />
            
            {children.map(c => renderTree(c.id))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4 overflow-x-auto">
      <h3 className="mb-4 font-mono-tight text-xs uppercase tracking-wider text-text-faint">
        Union-Find Forest
      </h3>
      <div className="flex gap-6 items-start min-h-[120px] pb-2">
        <AnimatePresence>
          {roots.map(root => (
            <motion.div
              key={root.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex min-w-[80px] flex-col items-center rounded-lg border border-border/50 bg-[#0d1117] p-4 shadow-sm"
            >
              <div className="mb-3 font-mono-tight text-[10px] uppercase tracking-widest text-text-muted">
                Rank {root.rank}
              </div>
              {renderTree(root.id, true)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
