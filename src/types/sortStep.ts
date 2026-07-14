/** Phase of each sorting step — shared across all six sort algorithms */
export type SortPhase =
  // Universal
  | 'start'
  | 'compare'
  | 'swap'
  | 'no-swap'
  | 'sorted'
  | 'done'
  // Bubble
  | 'pass-start'
  | 'pass-done'
  // Selection
  | 'select-min'
  // Insertion
  | 'select-key'
  | 'shift'
  | 'insert'
  // Merge Sort
  | 'divide'
  | 'merge-compare'
  | 'merge-copy-left'
  | 'merge-copy-right'
  | 'merge-remainder'
  | 'merge-done'
  // Quick Sort
  | 'pivot-select'
  | 'partition-compare'
  | 'partition-swap'
  | 'partition-done'
  // Heap Sort
  | 'heapify-start'
  | 'heapify-compare'
  | 'heapify-swap'
  | 'heapify-done'
  | 'heap-built'
  | 'extract-max'

/** One frame in the call stack display */
export interface CallFrame {
  fn: string
  args: string
}

/** A node in the merge sort recursive tree */
export interface MergeTreeNode {
  id: string
  l: number
  r: number
  values: number[]
  depth: number
  parentId?: string
  leftId?: string
  rightId?: string
  state: 'inactive' | 'active' | 'dividing' | 'merging' | 'merged'
}

/** One step snapshot emitted by any sorting step generator */
export interface SortStep {
  /** Full array state at this step */
  array: number[]
  /** Indices currently being processed — rendered amber */
  highlighted: number[]
  /** Indices being compared against — rendered terracotta */
  compared: number[]
  /** Indices in their final sorted position — rendered teal */
  sorted: number[]
  /** Pair of indices being swapped this step (both amber) */
  swap?: [number, number]
  /** Human-readable narration for this step */
  message: string
  phase: SortPhase
  comparisons: number
  swaps: number
  /** Current pass number (bubble, selection) */
  pass?: number

  // ── Merge Sort ──────────────────────────────────────────────────────────────
  /** Left boundary of the current merge region */
  mergeL?: number
  /** Right boundary of the current merge region */
  mergeR?: number
  /** Mid-point of the current merge region */
  mergeMid?: number
  /** Left pointer during merge */
  mergeI?: number
  /** Right pointer during merge */
  mergeJ?: number
  /** Output pointer during merge */
  mergeK?: number
  /** Temporary arrays (left half, right half) used during merge */
  tempLeft?: number[]
  tempRight?: number[]
  /** Recursion depth */
  mergeDepth?: number
  callStack?: CallFrame[]
  treeNodes?: MergeTreeNode[]
  /** ID of the currently active tree node */
  activeNodeId?: string

  // ── Quick Sort ──────────────────────────────────────────────────────────────
  /** Index of the pivot element */
  pivotIdx?: number
  /** Current left scanning pointer (i) */
  leftPtr?: number
  /** Current right scanning pointer (j) */
  rightPtr?: number
  /** Low bound of current partition range */
  rangeL?: number
  /** High bound of current partition range */
  rangeR?: number
  quickCallStack?: CallFrame[]

  // ── Heap Sort ───────────────────────────────────────────────────────────────
  /** Current heap size (elements beyond this are sorted) */
  heapSize?: number
  /** Index being heapified (root of subtree) */
  heapRoot?: number
  /** Index of the currently found largest element */
  heapLargest?: number
}
