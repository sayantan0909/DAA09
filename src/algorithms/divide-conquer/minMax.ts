import type { MinMaxStep, CallFrame, MinMaxTreeNode } from '@/types/minMaxStep'

export const minMaxExamples: { label: string; array: number[] }[] = [
  { label: 'Example 1 — Standard', array: [22, 13, -5, -8, 15, 60, 17, 31, 47] },
  { label: 'Example 2 — Ordered', array: [1, 2, 3, 4, 5, 6, 7] },
  { label: 'Example 3 — Reverse Ordered', array: [9, 8, 7, 6, 5, 4, 3, 2, 1] },
  { label: 'Example 4 — Duplicates', array: [4, 4, 4, 1, 9, 9, 2] },
  { label: 'Example 5 — Two Elements', array: [100, -100] },
]

export function generateMinMaxSteps(input: number[]): MinMaxStep[] {
  const steps: MinMaxStep[] = []
  const arr = [...input]
  const n = arr.length
  
  let comparisons = 0
  const treeNodes: MinMaxTreeNode[] = []
  const callStack: CallFrame[] = []
  let nodeIdCounter = 0

  if (n === 0) return steps

  steps.push({
    array: [...arr], highlighted: [], compared: [], sorted: [],
    message: `Finding Min and Max using Divide & Conquer on [${arr.join(', ')}].`,
    phase: 'start', comparisons, callStack: [...callStack], treeNodes: [...treeNodes]
  })

  function getMinMax(l: number, r: number, parentId?: string, depth = 0): { min: number, max: number, id: string } {
    const id = `node-${nodeIdCounter++}`
    const node: MinMaxTreeNode = {
      id, l, r, values: arr.slice(l, r + 1), depth, parentId, state: 'active'
    }
    treeNodes.push(node)
    
    callStack.push({ fn: 'getMinMax', args: `(l: ${l}, r: ${r})` })

    steps.push({
      array: [...arr], highlighted: [], compared: [], sorted: [],
      message: `Divide: getMinMax(${l}, ${r}). Subarray: [${node.values.join(', ')}].`,
      phase: 'divide', comparisons,
      callStack: [...callStack], treeNodes: JSON.parse(JSON.stringify(treeNodes)),
      activeNodeId: id, rangeL: l, rangeR: r
    })

    // Base Case 1: One element
    if (l === r) {
      node.state = 'returning'
      node.min = arr[l]
      node.max = arr[l]
      
      steps.push({
        array: [...arr], highlighted: [l], compared: [], sorted: [],
        message: `Base case 1: Single element. min = ${arr[l]}, max = ${arr[l]}.`,
        phase: 'base-case-1', comparisons,
        callStack: [...callStack], treeNodes: JSON.parse(JSON.stringify(treeNodes)),
        activeNodeId: id, rangeL: l, rangeR: r, currentMin: arr[l], currentMax: arr[l]
      })
      
      node.state = 'done'
      callStack.pop()
      return { min: arr[l], max: arr[l], id }
    }

    // Base Case 2: Two elements
    if (l === r - 1) {
      comparisons++
      let min, max
      if (arr[l] < arr[r]) {
        min = arr[l]; max = arr[r]
      } else {
        min = arr[r]; max = arr[l]
      }
      
      node.state = 'returning'
      node.min = min
      node.max = max

      steps.push({
        array: [...arr], highlighted: [l, r], compared: [], sorted: [],
        message: `Base case 2: Two elements. Compare ${arr[l]} and ${arr[r]}. min = ${min}, max = ${max}.`,
        phase: 'base-case-2', comparisons,
        callStack: [...callStack], treeNodes: JSON.parse(JSON.stringify(treeNodes)),
        activeNodeId: id, rangeL: l, rangeR: r, currentMin: min, currentMax: max
      })
      
      node.state = 'done'
      callStack.pop()
      return { min, max, id }
    }

    // Divide
    node.state = 'dividing'
    const mid = Math.floor((l + r) / 2)
    
    const leftRes = getMinMax(l, mid, id, depth + 1)
    const rightRes = getMinMax(mid + 1, r, id, depth + 1)

    node.leftId = leftRes.id
    node.rightId = rightRes.id
    
    // Combine
    callStack.push({ fn: 'combine', args: `(left, right)` })
    node.state = 'returning'
    
    comparisons += 2 // 1 for min, 1 for max
    const finalMin = Math.min(leftRes.min, rightRes.min)
    const finalMax = Math.max(leftRes.max, rightRes.max)
    
    node.min = finalMin
    node.max = finalMax

    steps.push({
      array: [...arr], highlighted: [], compared: [], sorted: [],
      message: `Combine: Left (min=${leftRes.min}, max=${leftRes.max}), Right (min=${rightRes.min}, max=${rightRes.max}). Final for this subtree: min=${finalMin}, max=${finalMax}.`,
      phase: 'combine', comparisons,
      callStack: [...callStack], treeNodes: JSON.parse(JSON.stringify(treeNodes)),
      activeNodeId: id, rangeL: l, rangeR: r, mid,
      leftMin: leftRes.min, leftMax: leftRes.max,
      rightMin: rightRes.min, rightMax: rightRes.max,
      currentMin: finalMin, currentMax: finalMax
    })

    node.state = 'done'
    callStack.pop() // pop combine
    callStack.pop() // pop getMinMax
    return { min: finalMin, max: finalMax, id }
  }

  const { min, max } = getMinMax(0, n - 1)

  steps.push({
    array: [...arr], highlighted: [], compared: [], sorted: [],
    message: `Min-Max Algorithm complete! Overall Minimum is ${min}, Maximum is ${max}. Total Comparisons: ${comparisons}.`,
    phase: 'done', comparisons,
    callStack: [], treeNodes: JSON.parse(JSON.stringify(treeNodes)),
    currentMin: min, currentMax: max
  })

  return steps
}
