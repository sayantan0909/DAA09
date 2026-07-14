import type { SortStep } from '@/types/sortStep'
import { bubbleSortExamples } from './bubbleSort'

export const heapSortExamples = bubbleSortExamples

export function generateHeapSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const arr = [...input]
  const n = arr.length
  
  let comparisons = 0
  let swaps = 0
  let heapifyCalls = 0
  const sortedSet = new Set<number>()

  steps.push({
    array: [...arr], highlighted: [], compared: [], sorted: [],
    message: `Heap Sort on [${arr.join(', ')}]. Phase 1: Build a max heap.`,
    phase: 'start', comparisons, swaps, heapSize: n
  })

  function heapify(n: number, i: number) {
    heapifyCalls++
    let largest = i
    const l = 2 * i + 1
    const r = 2 * i + 2

    steps.push({
      array: [...arr], highlighted: [i], compared: [], sorted: [...sortedSet],
      message: `Heapify at index ${i} (value ${arr[i]}). Checking children.`,
      phase: 'heapify-start', comparisons, swaps, heapSize: n, heapRoot: i, heapLargest: largest
    })

    if (l < n) {
      comparisons++
      steps.push({
        array: [...arr], highlighted: [i], compared: [l], sorted: [...sortedSet],
        message: `Compare root ${arr[largest]} with left child ${arr[l]}.`,
        phase: 'heapify-compare', comparisons, swaps, heapSize: n, heapRoot: i, heapLargest: largest
      })
      if (arr[l] > arr[largest]) {
        largest = l
      }
    }

    if (r < n) {
      comparisons++
      steps.push({
        array: [...arr], highlighted: [i], compared: [r], sorted: [...sortedSet],
        message: `Compare current largest ${arr[largest]} with right child ${arr[r]}.`,
        phase: 'heapify-compare', comparisons, swaps, heapSize: n, heapRoot: i, heapLargest: largest
      })
      if (arr[r] > arr[largest]) {
        largest = r
      }
    }

    if (largest !== i) {
      swaps++
      const tmp = arr[i]; arr[i] = arr[largest]; arr[largest] = tmp

      steps.push({
        array: [...arr], highlighted: [i, largest], compared: [], sorted: [...sortedSet],
        swap: [i, largest],
        message: `Largest is ${arr[i]} at index ${largest}. Swapping with root.`,
        phase: 'heapify-swap', comparisons, swaps, heapSize: n, heapRoot: i, heapLargest: largest
      })

      // Recursively heapify the affected sub-tree
      heapify(n, largest)
    } else {
      steps.push({
        array: [...arr], highlighted: [i], compared: [], sorted: [...sortedSet],
        message: `Root ${arr[i]} is larger than its children. Heap property satisfied.`,
        phase: 'heapify-done', comparisons, swaps, heapSize: n, heapRoot: i, heapLargest: largest
      })
    }
  }

  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i)
  }

  steps.push({
    array: [...arr], highlighted: [], compared: [], sorted: [],
    message: `Max heap built successfully. Phase 2: Extract maximum one by one.`,
    phase: 'heap-built', comparisons, swaps, heapSize: n
  })

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    swaps++
    const tmp = arr[0]; arr[0] = arr[i]; arr[i] = tmp
    sortedSet.add(i)

    steps.push({
      array: [...arr], highlighted: [0, i], compared: [], sorted: [...sortedSet],
      swap: [0, i],
      message: `Extract maximum ${arr[i]} (root). Swap it to the end of the array (index ${i}). Heap size reduced to ${i}.`,
      phase: 'extract-max', comparisons, swaps, heapSize: i
    })

    // call max heapify on the reduced heap
    heapify(i, 0)
  }

  sortedSet.add(0)

  steps.push({
    array: [...arr], highlighted: [], compared: [], 
    sorted: Array.from({ length: n }, (_, k) => k),
    message: `Heap Sort complete! [${arr.join(', ')}]. Comparisons: ${comparisons}, Swaps: ${swaps}, Heapify Calls: ${heapifyCalls}.`,
    phase: 'done', comparisons, swaps, heapSize: 0
  })

  return steps
}
