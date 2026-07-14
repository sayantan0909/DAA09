import type { MinMaxStep } from '@/types/minMaxStep'

interface MinMaxStatsPanelProps {
  step: MinMaxStep
  totalElements: number
}

export function MinMaxStatsPanel({ step, totalElements }: MinMaxStatsPanelProps) {
  // Find current active node's depth or use 0
  const activeNode = step.treeNodes.find(n => n.id === step.activeNodeId)
  const depth = activeNode?.depth ?? 0

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      <StatBox label="Array Size" value={totalElements} />
      <StatBox label="Comparisons" value={step.comparisons} />
      <StatBox label="Recursion Depth" value={depth} />
      {step.currentMin !== undefined && (
        <StatBox label="Current Min" value={step.currentMin} highlight="teal" />
      )}
      {step.currentMax !== undefined && (
        <StatBox label="Current Max" value={step.currentMax} highlight="terracotta" />
      )}
    </div>
  )
}

function StatBox({ label, value, highlight = 'amber' }: { label: string; value: number | string, highlight?: 'amber' | 'teal' | 'terracotta' }) {
  const colorMap = {
    amber: 'text-amber',
    teal: 'text-teal',
    terracotta: 'text-terracotta'
  }
  return (
    <div className="flex flex-col items-center justify-center rounded border border-border bg-surface p-2">
      <span className="mb-1 font-mono-tight text-[10px] uppercase tracking-wider text-text-faint">
        {label}
      </span>
      <span className={`font-mono text-lg font-bold ${colorMap[highlight]}`}>
        {value}
      </span>
    </div>
  )
}
