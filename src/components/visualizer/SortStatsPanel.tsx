import type { SortStep } from '@/types/sortStep'

interface SortStatsPanelProps {
  step: SortStep
  totalElements: number
}

export function SortStatsPanel({ step, totalElements }: SortStatsPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      <StatBox label="Array Size" value={totalElements} />
      <StatBox label="Comparisons" value={step.comparisons} />
      <StatBox label="Swaps / Writes" value={step.swaps} />
      {step.pass !== undefined && (
        <StatBox label="Current Pass" value={step.pass} />
      )}
      {step.mergeDepth !== undefined && (
        <StatBox label="Recursion Depth" value={step.mergeDepth} />
      )}
      {step.heapSize !== undefined && (
        <StatBox label="Heap Size" value={step.heapSize} />
      )}
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-border bg-surface p-2">
      <span className="mb-1 font-mono-tight text-[10px] uppercase tracking-wider text-text-faint">
        {label}
      </span>
      <span className="font-mono text-lg font-bold text-amber">
        {value}
      </span>
    </div>
  )
}
