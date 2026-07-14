import type { MCMStep } from '@/types/dpStep'

interface MCMTableProps {
  step: MCMStep
}

export function MCMTable({ step }: MCMTableProps) {
  const { dimensions, dp, activeI, activeJ, activeK, phase } = step
  const n = dimensions.length - 1  // number of matrices

  if (n < 2) return null

  // Matrix labels: A1, A2, ...
  const labels = Array.from({ length: n }, (_, i) => `A${i + 1}`)

  return (
    <div className="space-y-4">
      {/* Matrix dimension display */}
      <div className="rounded-lg border border-border bg-surface p-3">
        <div className="mb-2 font-mono-tight text-xs uppercase tracking-wider text-text-faint">
          Matrices &amp; Dimensions
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {labels.map((lbl, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="inline-flex flex-col items-center rounded border border-amber/30 bg-amber/5 px-2.5 py-1.5">
                <span className="font-mono-tight text-sm font-semibold text-amber">{lbl}</span>
                <span className="font-mono-tight text-[10px] text-text-faint">
                  {dimensions[i]}×{dimensions[i + 1]}
                </span>
              </span>
              {i < n - 1 && <span className="font-mono-tight text-text-faint">×</span>}
            </span>
          ))}
        </div>
      </div>

      {/* DP Table */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="ledger-rule px-3 py-2">
          <span className="font-mono-tight text-xs uppercase tracking-wider text-text-faint">
            dp[i][j] — Minimum Multiplications for A<sub>i</sub> to A<sub>j</sub>
          </span>
        </div>
        <div className="overflow-x-auto p-3">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="px-2 py-1.5 font-mono-tight text-text-faint font-normal text-left w-8">
                  i\j
                </th>
                {labels.map((_, j) => (
                  <th key={j} className="px-2 py-1.5 font-mono-tight text-text-faint font-normal text-center min-w-[60px]">
                    {j + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels.map((_, i) => (
                <tr key={i}>
                  <td className="px-2 py-1.5 font-mono-tight text-text-faint">{i + 1}</td>
                  {labels.map((_, j) => {
                    const ri = i + 1
                    const rj = j + 1
                    const val = dp[ri]?.[rj]
                    const isActive = phase === 'fill' && ri === activeI && rj === activeJ
                    const isDiag = ri === rj
                    const isAboveDiag = ri <= rj
                    const isComputed = val !== undefined && val !== 0 && val !== Infinity && !isDiag
                    const isJustUpdated = isActive && activeK > 0

                    let cellClass = 'border border-border text-center rounded-sm transition-all duration-300 '
                    if (!isAboveDiag) {
                      cellClass += 'text-text-faint opacity-30 bg-surface'
                    } else if (isDiag) {
                      cellClass += 'bg-surface-raised text-text-faint font-mono-tight'
                    } else if (isActive) {
                      cellClass += 'bg-amber/20 text-amber font-semibold border-amber ring-1 ring-amber'
                    } else if (isComputed) {
                      cellClass += 'bg-teal/10 text-teal font-mono-tight'
                    } else {
                      cellClass += 'text-text-faint font-mono-tight'
                    }

                    return (
                      <td key={j} className={`px-2 py-1.5 min-w-[60px] ${cellClass}`}>
                        {isDiag
                          ? '0'
                          : !isAboveDiag
                          ? '—'
                          : val === Infinity || val === undefined || val === 0
                          ? (isJustUpdated ? '...' : '—')
                          : val.toLocaleString()}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active computation */}
      {phase === 'fill' && activeI > 0 && activeJ > 0 && (
        <div className="rounded-lg border border-amber/30 bg-amber/5 p-3">
          <div className="mb-1 font-mono-tight text-xs text-amber uppercase tracking-wider">
            Current Computation
          </div>
          <div className="font-mono-tight text-sm text-text-muted">
            dp[{activeI}][{activeJ}] with split k={activeK}
          </div>
          <div className="mt-1 font-mono-tight text-xs text-text-faint">
            = dp[{activeI}][{activeK}] + dp[{activeK + 1}][{activeJ}] + p[{activeI - 1}]×p[{activeK}]×p[{activeJ}]
            {' '}= {dp[activeI]?.[activeK] ?? '—'} + {dp[activeK + 1]?.[activeJ] ?? '—'} + {dimensions[activeI - 1]}×{dimensions[activeK]}×{dimensions[activeJ]}
          </div>
        </div>
      )}

      {/* Done: show parenthesization */}
      {phase === 'done' && step.parenthesization && (
        <div className="rounded-lg border border-teal/30 bg-teal/5 p-4 space-y-2">
          <div className="font-mono-tight text-xs uppercase tracking-wider text-teal">
            Optimal Parenthesization
          </div>
          <div className="font-mono-tight text-base font-semibold text-teal break-all">
            {step.parenthesization}
          </div>
          <div className="font-mono-tight text-sm text-text-muted">
            Minimum multiplications:{' '}
            <span className="font-semibold text-amber">{step.minCost?.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
