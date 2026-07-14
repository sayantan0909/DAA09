export type MCMPhase = 'init' | 'fill' | 'done'

export interface MCMStep {
  /** The dimensions array: A1 is dims[0]×dims[1], A2 is dims[1]×dims[2], … */
  dimensions: number[]
  /** dp[i][j] = min cost to multiply matrices i..j (1-indexed, 0 means not yet set) */
  dp: number[][]
  /** split[i][j] = k that gives the optimal split */
  split: number[][]
  /** Currently being computed: chain start index (1-indexed) */
  activeI: number
  /** Currently being computed: chain end index (1-indexed) */
  activeJ: number
  /** Currently being tried: split position */
  activeK: number
  /** Human-readable narration */
  message: string
  phase: MCMPhase
  /** The final optimal parenthesization string (populated in 'done' phase) */
  parenthesization?: string
  /** The final minimum cost (populated in 'done' phase) */
  minCost?: number
}
