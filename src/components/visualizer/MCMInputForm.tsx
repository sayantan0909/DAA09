import { useState } from 'react'

interface MCMInputFormProps {
  onApply: (dims: number[]) => void
}

export function MCMInputForm({ onApply }: MCMInputFormProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleApply = () => {
    setError(null)
    const raw = text.trim()
    if (!raw) {
      setError('Enter a comma-separated list of dimensions.')
      return
    }

    const parts = raw.split(/[\s,]+/).filter(Boolean)
    if (parts.length < 2) {
      setError('Enter at least 2 values (to describe 1 matrix, e.g. "10, 20").')
      return
    }

    const dims: number[] = []
    for (const p of parts) {
      const n = parseInt(p, 10)
      if (isNaN(n) || n <= 0) {
        setError(`Invalid dimension "${p}". All values must be positive integers.`)
        return
      }
      dims.push(n)
    }

    onApply(dims)
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-3 font-mono-tight text-sm font-semibold uppercase tracking-wider text-text">
        Custom Dimensions
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. 10, 20, 30, 40"
            className="w-full rounded border border-border bg-surface-raised px-3 py-2 font-mono-tight text-sm text-text placeholder:text-text-faint focus:border-amber focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
          <div className="mt-1 text-xs text-text-faint">
            Format: comma-separated dimensions{' '}
            <span className="text-text-muted">p₀, p₁, …, pₙ</span> for{' '}
            <span className="text-text-muted">n</span> matrices.{' '}
            A<sub>i</sub> has dimensions p<sub>i-1</sub> × p<sub>i</sub>.
          </div>
        </div>

        <div className="flex flex-col justify-between">
          {error ? (
            <div className="rounded border border-terracotta/30 bg-terracotta/10 p-2 text-xs text-terracotta">
              {error}
            </div>
          ) : (
            <div className="text-xs text-text-muted">
              Enter matrix dimension chain to visualize your own MCM problem.
            </div>
          )}
          <button
            onClick={handleApply}
            className="mt-4 rounded bg-amber px-4 py-2 font-mono-tight text-sm font-bold text-bg hover:bg-amber-dim"
          >
            Compute
          </button>
        </div>
      </div>
    </div>
  )
}
