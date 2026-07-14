import type { SortStep, CallFrame, MergeTreeNode } from '@/types/sortStep'
import { bubbleSortExamples } from './bubbleSort'

export const quickSortExamples = [
  ...bubbleSortExamples,
  { label: 'Example 6 — Sorted (Worst Case)', array: [1, 2, 3, 4, 5, 6, 7] }
]

export function generateQuickSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const arr = [...input]
  const n = arr.length
  
  let comparisons = 0
  let swaps = 0
  
  const treeNodes: MergeTreeNode[] = []
  const callStack: CallFrame[] = []
  let nodeIdCounter = 0
  const sortedSet = new Set<number>()

  steps.push({
    array: [...arr], highlighted: [], compared: [], sorted: [],
    message: `Quick Sort on [${arr.join(', ')}]. We will partition the array around a pivot and sort recursively.`,
    phase: 'start', comparisons, swaps, treeNodes: [...treeNodes], quickCallStack: [...callStack]
  })

  function quickSort(l: number, r: number, parentId?: string, depth = 0): string {
    const id = `node-${nodeIdCounter++}`
    const node: MergeTreeNode = {
      id, l, r, values: arr.slice(l, r + 1), depth, parentId, state: 'active'
    }
    treeNodes.push(node)
    
    callStack.push({ fn: 'quickSort', args: `(l: ${l}, r: ${r})` })

    steps.push({
      array: [...arr], highlighted: [], compared: [], sorted: [...sortedSet],
      message: `quickSort(${l}, ${r}). Current subarray: [${node.values.join(', ')}].`,
      phase: 'divide', comparisons, swaps,
      treeNodes: JSON.parse(JSON.stringify(treeNodes)),
      quickCallStack: [...callStack], activeNodeId: id, mergeDepth: depth,
      rangeL: l, rangeR: r
    })

    if (l < r) {
      node.state = 'dividing'
      const pi = partition(l, r, id, depth)

      const leftId = quickSort(l, pi - 1, id, depth + 1)
      const rightId = quickSort(pi + 1, r, id, depth + 1)

      node.leftId = leftId
      node.rightId = rightId

      node.state = 'merged'
      node.values = arr.slice(l, r + 1)
      
      steps.push({
        array: [...arr], highlighted: [], compared: [], sorted: [...sortedSet],
        message: `quickSort(${l}, ${r}) complete.`,
        phase: 'done', comparisons, swaps,
        treeNodes: JSON.parse(JSON.stringify(treeNodes)),
        quickCallStack: [...callStack], activeNodeId: id, mergeDepth: depth,
        rangeL: l, rangeR: r
      })
    } else {
      if (l === r) {
        sortedSet.add(l)
      }
      node.state = 'merged'
      steps.push({
        array: [...arr], highlighted: [l], compared: [], sorted: [...sortedSet],
        message: `Base case reached. Subarray of size 1 is sorted.`,
        phase: 'done', comparisons, swaps,
        treeNodes: JSON.parse(JSON.stringify(treeNodes)),
        quickCallStack: [...callStack], activeNodeId: id, mergeDepth: depth,
        rangeL: l, rangeR: r
      })
    }

    callStack.pop()
    return id
  }

  function partition(l: number, r: number, nodeId: string, depth: number): number {
    callStack.push({ fn: 'partition', args: `(l: ${l}, r: ${r})` })
    
    const pivot = arr[r]
    let i = l - 1

    steps.push({
      array: [...arr], highlighted: [r], compared: [], sorted: [...sortedSet],
      message: `Partitioning. Selected last element ${pivot} at index ${r} as pivot.`,
      phase: 'pivot-select', comparisons, swaps,
      treeNodes: JSON.parse(JSON.stringify(treeNodes)),
      quickCallStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
      pivotIdx: r, rangeL: l, rangeR: r, leftPtr: i
    })

    for (let j = l; j <= r - 1; j++) {
      comparisons++
      
      steps.push({
        array: [...arr], highlighted: [r], compared: [j], sorted: [...sortedSet],
        message: `Compare element ${arr[j]} at index ${j} with pivot ${pivot}.`,
        phase: 'partition-compare', comparisons, swaps,
        treeNodes: JSON.parse(JSON.stringify(treeNodes)),
        quickCallStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
        pivotIdx: r, rangeL: l, rangeR: r, leftPtr: i, rightPtr: j
      })

      if (arr[j] < pivot) {
        i++
        swaps++
        const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp
        
        steps.push({
          array: [...arr], highlighted: [i, j], compared: [r], sorted: [...sortedSet],
          swap: [i, j],
          message: `${arr[i]} < ${pivot}. The pivot is larger than this value, so we expand the left partition and swap it into index ${i}.`,
          phase: 'partition-swap', comparisons, swaps,
          treeNodes: JSON.parse(JSON.stringify(treeNodes)),
          quickCallStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
          pivotIdx: r, rangeL: l, rangeR: r, leftPtr: i, rightPtr: j
        })
      } else {
        steps.push({
          array: [...arr], highlighted: [r], compared: [j], sorted: [...sortedSet],
          message: `${arr[j]} ≥ ${pivot}. The pivot is smaller than this value, so it remains on the right partition.`,
          phase: 'partition-compare', comparisons, swaps,
          treeNodes: JSON.parse(JSON.stringify(treeNodes)),
          quickCallStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
          pivotIdx: r, rangeL: l, rangeR: r, leftPtr: i, rightPtr: j
        })
      }
    }

    swaps++
    const tmp = arr[i + 1]; arr[i + 1] = arr[r]; arr[r] = tmp
    sortedSet.add(i + 1)

    steps.push({
      array: [...arr], highlighted: [i + 1, r], compared: [], sorted: [...sortedSet],
      swap: [i + 1, r],
      message: `Partition complete. Swapped pivot ${pivot} into its final sorted position ${i + 1}.`,
      phase: 'partition-done', comparisons, swaps,
      treeNodes: JSON.parse(JSON.stringify(treeNodes)),
      quickCallStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
      pivotIdx: i + 1, rangeL: l, rangeR: r, leftPtr: i
    })

    callStack.pop()
    return i + 1
  }

  if (n > 0) {
    quickSort(0, n - 1)
  }

  steps.push({
    array: [...arr], highlighted: [], compared: [], 
    sorted: Array.from({ length: n }, (_, k) => k),
    message: `Quick Sort complete! [${arr.join(', ')}]. Comparisons: ${comparisons}, Swaps: ${swaps}.`,
    phase: 'done', comparisons, swaps,
    treeNodes: JSON.parse(JSON.stringify(treeNodes)),
    quickCallStack: []
  })

  return steps
}
