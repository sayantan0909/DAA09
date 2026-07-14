import { motion } from 'framer-motion'
import type { MinMaxStep, MinMaxTreeNode } from '@/types/minMaxStep'

interface MinMaxTreePanelProps {
  step: MinMaxStep
}

export function MinMaxTreePanel({ step }: MinMaxTreePanelProps) {
  if (!step.treeNodes || step.treeNodes.length === 0) return null

  // Find root node
  const root = step.treeNodes.find(n => !n.parentId)
  if (!root) return null

  return (
    <div className="mt-8 rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-4 font-mono-tight text-sm font-semibold uppercase tracking-wider text-text">
        Recursion Tree
      </h3>
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max justify-center">
          <TreeNode treeNodes={step.treeNodes} node={root} activeNodeId={step.activeNodeId} />
        </div>
      </div>

      {step.callStack && step.callStack.length > 0 && (
        <div className="mt-4 border-t border-border/50 pt-4">
          <h4 className="mb-2 font-mono-tight text-xs font-semibold text-text-muted">Call Stack</h4>
          <div className="flex flex-wrap gap-2">
            {step.callStack.map((frame, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="rounded bg-surface-raised px-2 py-1 font-mono text-xs text-amber">
                  {frame.fn}<span className="text-text-faint">{frame.args}</span>
                </div>
                {i < step.callStack!.length - 1 && <span className="text-text-muted">→</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TreeNode({ treeNodes, node, activeNodeId }: { treeNodes: MinMaxTreeNode[], node: MinMaxTreeNode, activeNodeId?: string }) {
  const left = node.leftId ? treeNodes.find(n => n.id === node.leftId) : null
  const right = node.rightId ? treeNodes.find(n => n.id === node.rightId) : null

  const isActive = activeNodeId === node.id
  let bgColor = 'bg-surface-raised border-border'
  let textColor = 'text-text-muted'

  if (isActive) {
    bgColor = 'bg-amber/10 border-amber'
    textColor = 'text-amber font-bold'
  } else if (node.state === 'done') {
    bgColor = 'bg-teal/10 border-teal'
    textColor = 'text-teal'
  } else if (node.state === 'dividing') {
    bgColor = 'bg-surface-raised border-text-muted'
    textColor = 'text-text'
  } else if (node.state === 'returning') {
    bgColor = 'bg-amber/5 border-amber/50'
    textColor = 'text-amber'
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        layout
        className={`z-10 flex flex-col items-center justify-center rounded border px-3 py-1.5 transition-colors ${bgColor}`}
      >
        <span className={`font-mono text-xs ${textColor}`}>
          [{node.values.join(', ')}]
        </span>
        {(node.min !== undefined && node.max !== undefined) && (
          <span className="mt-1 font-mono-tight text-[10px] font-bold text-teal">
            Min: {node.min}, Max: {node.max}
          </span>
        )}
      </motion.div>
      
      {(left || right) && (
        <div className="relative mt-4 flex gap-4 sm:gap-8">
          {left && <TreeNode treeNodes={treeNodes} node={left} activeNodeId={activeNodeId} />}
          {right && <TreeNode treeNodes={treeNodes} node={right} activeNodeId={activeNodeId} />}
        </div>
      )}
    </div>
  )
}
