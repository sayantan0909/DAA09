import { useState } from 'react'
import { parseNumberList } from '@/utils/random'

interface ArrayInputFormProps {
  arrayValue: number[]
  targetValue: number
  onApply: (array: number[], target: number) => void
  sortedHint?: boolean
}

export function ArrayInputForm({
  arrayValue,
  targetValue,
  onApply,
  sortedHint,
}: ArrayInputFormProps) {
  const [arrayText, setArrayText] = useState(arrayValue.join(', '))
  const [targetText, setTargetText] = useState(String(targetValue))
  const [error, setError] = useState<string | null>(null)

  const handleApply = () => {
    const parsed = parseNumberList(arrayText)
    const target = Number(targetText)

    if (parsed.length === 0) {
      setError('Enter at least one number, separated by commas.')
      return
    }
    if (Number.isNaN(target)) {
      setError('Target must be a number.')
      return
    }

    setError(null)
    onApply(sortedHint ? [...parsed].sort((a, b) => a - b) : parsed, target)
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="mb-1 block text-xs text-text-faint">
          Array {sortedHint && '(will be sorted automatically)'}
        </label>
        <input
          value={arrayText}
          onChange={(e) => setArrayText(e.target.value)}
          placeholder="e.g. 5, 8, 2, 9, 1"
          className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 font-mono-tight text-sm text-text placeholder:text-text-faint focus:border-amber focus:outline-none"
        />
      </div>
      <div className="w-full sm:w-32">
        <label className="mb-1 block text-xs text-text-faint">Target</label>
        <input
          value={targetText}
          onChange={(e) => setTargetText(e.target.value)}
          placeholder="9"
          className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 font-mono-tight text-sm text-text placeholder:text-text-faint focus:border-amber focus:outline-none"
        />
      </div>
      <button
        onClick={handleApply}
        className="rounded-md border border-amber-dim bg-amber-dim/30 px-4 py-2 text-sm font-medium text-amber hover:bg-amber-dim/50"
      >
        Apply
      </button>
      {error && <p className="text-xs text-terracotta sm:absolute">{error}</p>}
    </div>
  )
}
