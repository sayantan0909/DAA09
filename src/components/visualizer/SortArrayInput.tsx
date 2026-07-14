import { useState } from 'react'

interface SortArrayInputProps {
  onApply: (arr: number[]) => void
}

export function SortArrayInput({ onApply }: SortArrayInputProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleApply = () => {
    setError(null)
    const raw = text.trim()
    if (!raw) {
      setError('Enter a list of numbers.')
      return
    }

    // Split by commas or spaces
    const parts = raw.split(/[\s,]+/).filter(Boolean)
    if (parts.length === 0) {
      setError('No valid numbers found.')
      return
    }

    if (parts.length > 50) {
      setError('Maximum array size is 50 for visualization.')
      return
    }

    const arr: number[] = []
    for (const p of parts) {
      const n = parseFloat(p)
      if (isNaN(n)) {
        setError(`Invalid number "${p}".`)
        return
      }
      arr.push(n)
    }

    onApply(arr)
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-3 font-mono-tight text-sm font-semibold uppercase tracking-wider text-text">
        Custom Array Input
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. 64, 34, 25, 12, 22"
            className="w-full rounded border border-border bg-surface-raised px-3 py-2 font-mono-tight text-sm text-text placeholder:text-text-faint focus:border-amber focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
          <div className="mt-1 text-xs text-text-faint">
            Format: Comma or space separated numbers
          </div>
        </div>

        <div className="flex flex-col justify-between">
          {error ? (
            <div className="rounded border border-terracotta/30 bg-terracotta/10 p-2 text-xs text-terracotta">
              {error}
            </div>
          ) : (
            <div className="text-xs text-text-muted">
              Enter your own array to visualize how the algorithm sorts it.
            </div>
          )}
          <button
            onClick={handleApply}
            className="mt-4 rounded bg-amber px-4 py-2 font-mono-tight text-sm font-bold text-bg hover:bg-amber-dim"
          >
            Generate Array
          </button>
        </div>
      </div>
    </div>
  )
}
