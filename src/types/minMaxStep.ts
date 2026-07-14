export type MinMaxPhase =
  | 'start'
  | 'divide'
  | 'base-case-1'
  | 'base-case-2'
  | 'combine'
  | 'done'

export interface CallFrame {
  fn: string
  args: string
}

export interface MinMaxTreeNode {
  id: string
  l: number
  r: number
  values: number[]
  depth: number
  parentId?: string
  leftId?: string
  rightId?: string
  state: 'active' | 'dividing' | 'returning' | 'done'
  min?: number
  max?: number
}

export interface MinMaxStep {
  array: number[]
  highlighted: number[]
  compared: number[]
  sorted: number[]
  swap?: [number, number]
  message: string
  phase: MinMaxPhase
  comparisons: number
  
  // Recursion details
  callStack: CallFrame[]
  treeNodes: MinMaxTreeNode[]
  activeNodeId?: string
  
  // Current function scopes
  rangeL?: number
  rangeR?: number
  mid?: number
  
  // Return values from current frame
  currentMin?: number
  currentMax?: number
  
  // Return values from children
  leftMin?: number
  leftMax?: number
  rightMin?: number
  rightMax?: number
}
