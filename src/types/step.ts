export interface SearchStep {
  array: number[]
  /** index currently being examined, if any */
  currentIndex: number | null
  /** index where the target was found, once known */
  foundIndex: number | null
  /** lower bound pointer, for binary search */
  low?: number
  /** upper bound pointer, for binary search */
  high?: number
  /** midpoint pointer, for binary search */
  mid?: number
  /** human-readable narration of this step */
  message: string
  /** which highlighted phase of the algorithm this step represents */
  phase: 'start' | 'compare' | 'found' | 'not-found' | 'shift' | 'recurse'
}
