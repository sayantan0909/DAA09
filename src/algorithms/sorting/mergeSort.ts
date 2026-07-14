import type { SortStep, CallFrame, MergeTreeNode } from '@/types/sortStep'
import { bubbleSortExamples } from './bubbleSort'

export const mergeSortExamples = bubbleSortExamples

export function generateMergeSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const arr = [...input]
  const n = arr.length
  
  let comparisons = 0
  let swaps = 0 // conceptually assignments for merge sort
  
  const treeNodes: MergeTreeNode[] = []
  const callStack: CallFrame[] = []
  let nodeIdCounter = 0

  steps.push({
    array: [...arr], highlighted: [], compared: [], sorted: [],
    message: `Merge Sort on [${arr.join(', ')}]. We will divide the array recursively and then merge the sorted halves.`,
    phase: 'start', comparisons, swaps, treeNodes: [...treeNodes], callStack: [...callStack]
  })

  // The recursive function
  function mergeSort(l: number, r: number, parentId?: string, depth = 0): string {
    const id = `node-${nodeIdCounter++}`
    const node: MergeTreeNode = {
      id, l, r, values: arr.slice(l, r + 1), depth, parentId, state: 'active'
    }
    treeNodes.push(node)
    
    callStack.push({ fn: 'mergeSort', args: `(l: ${l}, r: ${r})` })

    steps.push({
      array: [...arr], highlighted: [], compared: [], sorted: [],
      message: `Divide: mergeSort(${l}, ${r}). Current subarray: [${node.values.join(', ')}].`,
      phase: 'divide', comparisons, swaps,
      treeNodes: JSON.parse(JSON.stringify(treeNodes)),
      callStack: [...callStack], activeNodeId: id, mergeDepth: depth
    })

    if (l >= r) {
      // Base case
      node.state = 'merged'
      steps.push({
        array: [...arr], highlighted: [l], compared: [], sorted: [],
        message: `Base case reached. A single element ${arr[l]} is already sorted.`,
        phase: 'divide', comparisons, swaps,
        treeNodes: JSON.parse(JSON.stringify(treeNodes)),
        callStack: [...callStack], activeNodeId: id, mergeDepth: depth
      })
      callStack.pop()
      return id
    }

    const mid = Math.floor((l + r) / 2)
    node.state = 'dividing'

    const leftId = mergeSort(l, mid, id, depth + 1)
    const rightId = mergeSort(mid + 1, r, id, depth + 1)

    node.leftId = leftId
    node.rightId = rightId

    merge(l, mid, r, id, depth)

    callStack.pop()
    return id
  }

  function merge(l: number, mid: number, r: number, nodeId: string, depth: number) {
    callStack.push({ fn: 'merge', args: `(l: ${l}, mid: ${mid}, r: ${r})` })
    
    const node = treeNodes.find(n => n.id === nodeId)!
    node.state = 'merging'

    // Create temp arrays
    const leftArr = arr.slice(l, mid + 1)
    const rightArr = arr.slice(mid + 1, r + 1)

    steps.push({
      array: [...arr], highlighted: [], compared: [], sorted: [],
      message: `Merging left: [${leftArr.join(', ')}] and right: [${rightArr.join(', ')}].`,
      phase: 'merge-compare', comparisons, swaps,
      treeNodes: JSON.parse(JSON.stringify(treeNodes)),
      callStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
      mergeL: l, mergeR: r, mergeMid: mid, tempLeft: leftArr, tempRight: rightArr
    })

    let i = 0
    let j = 0
    let k = l

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++
      steps.push({
        array: [...arr], highlighted: [l + i, mid + 1 + j], compared: [], sorted: [],
        message: `Compare left[${i}] = ${leftArr[i]} with right[${j}] = ${rightArr[j]}.`,
        phase: 'merge-compare', comparisons, swaps,
        treeNodes: JSON.parse(JSON.stringify(treeNodes)),
        callStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
        mergeL: l, mergeR: r, mergeMid: mid, mergeI: i, mergeJ: j, mergeK: k,
        tempLeft: leftArr, tempRight: rightArr
      })

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        swaps++
        steps.push({
          array: [...arr], highlighted: [k], compared: [], sorted: [],
          message: `${leftArr[i]} ≤ ${rightArr[j]}. The left array has the smaller element, so it is copied into the merged array at index ${k}.`,
          phase: 'merge-copy-left', comparisons, swaps,
          treeNodes: JSON.parse(JSON.stringify(treeNodes)),
          callStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
          mergeL: l, mergeR: r, mergeMid: mid, mergeI: i, mergeJ: j, mergeK: k,
          tempLeft: leftArr, tempRight: rightArr
        })
        i++
      } else {
        arr[k] = rightArr[j]
        swaps++
        steps.push({
          array: [...arr], highlighted: [k], compared: [], sorted: [],
          message: `${leftArr[i]} > ${rightArr[j]}. The right array has the smaller element, so it is copied into the merged array at index ${k}.`,
          phase: 'merge-copy-right', comparisons, swaps,
          treeNodes: JSON.parse(JSON.stringify(treeNodes)),
          callStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
          mergeL: l, mergeR: r, mergeMid: mid, mergeI: i, mergeJ: j, mergeK: k,
          tempLeft: leftArr, tempRight: rightArr
        })
        j++
      }
      k++
      node.values = arr.slice(l, r + 1)
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      swaps++
      steps.push({
        array: [...arr], highlighted: [k], compared: [], sorted: [],
        message: `Copy remaining element ${leftArr[i]} from left array to index ${k}.`,
        phase: 'merge-remainder', comparisons, swaps,
        treeNodes: JSON.parse(JSON.stringify(treeNodes)),
        callStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
        mergeL: l, mergeR: r, mergeMid: mid, mergeI: i, mergeJ: j, mergeK: k,
        tempLeft: leftArr, tempRight: rightArr
      })
      i++
      k++
      node.values = arr.slice(l, r + 1)
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      swaps++
      steps.push({
        array: [...arr], highlighted: [k], compared: [], sorted: [],
        message: `Copy remaining element ${rightArr[j]} from right array to index ${k}.`,
        phase: 'merge-remainder', comparisons, swaps,
        treeNodes: JSON.parse(JSON.stringify(treeNodes)),
        callStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth,
        mergeL: l, mergeR: r, mergeMid: mid, mergeI: i, mergeJ: j, mergeK: k,
        tempLeft: leftArr, tempRight: rightArr
      })
      j++
      k++
      node.values = arr.slice(l, r + 1)
    }

    node.state = 'merged'

    steps.push({
      array: [...arr], highlighted: [], compared: [], sorted: [],
      message: `Merged subarrays into [${arr.slice(l, r + 1).join(', ')}].`,
      phase: 'merge-done', comparisons, swaps,
      treeNodes: JSON.parse(JSON.stringify(treeNodes)),
      callStack: [...callStack], activeNodeId: nodeId, mergeDepth: depth
    })

    callStack.pop()
  }

  if (n > 0) {
    mergeSort(0, n - 1)
  }

  steps.push({
    array: [...arr], highlighted: [], compared: [], 
    sorted: Array.from({ length: n }, (_, k) => k),
    message: `Merge Sort complete! [${arr.join(', ')}]. Comparisons: ${comparisons}, Array assignments: ${swaps}.`,
    phase: 'done', comparisons, swaps,
    treeNodes: JSON.parse(JSON.stringify(treeNodes)),
    callStack: []
  })

  return steps
}
