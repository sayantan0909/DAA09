import type { MCMStep } from '@/types/dpStep'

// ─── Parenthesization builder ─────────────────────────────────────────────────
function buildParens(split: number[][], i: number, j: number): string {
  if (i === j) return `A${i}`
  const k = split[i][j]
  const left = buildParens(split, i, k)
  const right = buildParens(split, k + 1, j)
  return `(${left} × ${right})`
}

export function generateMCMSteps(dims: number[]): MCMStep[] {
  const steps: MCMStep[] = []
  const n = dims.length - 1  // number of matrices

  // Initialize DP table
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(n + 1).fill(0),
  )
  const split: number[][] = Array.from({ length: n + 1 }, () =>
    Array(n + 1).fill(0),
  )

  // Cost of single matrix = 0
  steps.push({
    dimensions: [...dims],
    dp: dp.map((r) => [...r]),
    split: split.map((r) => [...r]),
    activeI: 0, activeJ: 0, activeK: 0,
    message: `Matrix Chain: ${n} matrices. Dimensions: ${dims.join(' × ')}. dp[i][i] = 0 for all i (single matrix costs nothing).`,
    phase: 'init',
  })

  // Fill by chain length l
  for (let l = 2; l <= n; l++) {
    for (let i = 1; i <= n - l + 1; i++) {
      const j = i + l - 1
      dp[i][j] = Infinity

      for (let k = i; k <= j - 1; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j]

        steps.push({
          dimensions: [...dims],
          dp: dp.map((r) => [...r]),
          split: split.map((r) => [...r]),
          activeI: i, activeJ: j, activeK: k,
          message: `Chain length ${l}: computing dp[${i}][${j}] with split k=${k}. ` +
            `Cost = dp[${i}][${k}] + dp[${k + 1}][${j}] + p[${i - 1}]×p[${k}]×p[${j}] ` +
            `= ${dp[i][k]} + ${dp[k + 1][j]} + ${dims[i - 1]}×${dims[k]}×${dims[j]} = ${cost}.` +
            (cost < dp[i][j] ? ` ✓ New minimum!` : ` (${dp[i][j] === Infinity ? '∞' : dp[i][j]} stays)`),
          phase: 'fill',
        })

        if (cost < dp[i][j]) {
          dp[i][j] = cost
          split[i][j] = k
        }
      }
    }
  }

  const minCost = dp[1][n]
  const parenthesization = buildParens(split, 1, n)

  steps.push({
    dimensions: [...dims],
    dp: dp.map((r) => [...r]),
    split: split.map((r) => [...r]),
    activeI: 1, activeJ: n, activeK: 0,
    message: `MCM complete! Minimum multiplications = ${minCost}. Optimal: ${parenthesization}`,
    phase: 'done',
    minCost,
    parenthesization,
  })

  return steps
}

// Preset examples
export const mcmExamples: { label: string; dims: number[] }[] = [
  { label: 'Example 1 — 4 matrices', dims: [5, 10, 3, 12, 5] },
  { label: 'Example 2 — 3 matrices', dims: [10, 30, 5, 60] },
  { label: 'Example 3 — 5 matrices', dims: [40, 20, 30, 10, 30] },
]
