import type { SortStep } from '@/types/sortStep'
import { bubbleSortExamples } from './bubbleSort' // Reuse examples

export const selectionSortExamples = bubbleSortExamples

export function generateSelectionSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const arr = [...input]
  const n = arr.length
  const sortedSet = new Set<number>()
  let comparisons = 0
  let swaps = 0

  steps.push({
    array: [...arr], highlighted: [], compared: [], sorted: [],
    message: `Selection Sort on [${arr.join(', ')}] — find the minimum element in the unsorted portion and swap it to the front.`,
    phase: 'start', comparisons, swaps,
  })

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    steps.push({
      array: [...arr], highlighted: [i], compared: [], sorted: [...sortedSet],
      message: `Pass ${i + 1}: assuming minimum is at index ${i} (value ${arr[i]}). Scanning remaining elements.`,
      phase: 'pass-start', comparisons, swaps, pass: i + 1,
    })

    for (let j = i + 1; j < n; j++) {
      comparisons++
      const isNewMin = arr[j] < arr[minIdx]

      steps.push({
        array: [...arr], highlighted: [minIdx], compared: [j], sorted: [...sortedSet],
        message: `Compare current min ${arr[minIdx]} (at ${minIdx}) with ${arr[j]} (at ${j}). ${isNewMin ? `${arr[j]} < ${arr[minIdx]} — new minimum found!` : `${arr[j]} ≥ ${arr[minIdx]} — keep current minimum.`}`,
        phase: 'compare', comparisons, swaps, pass: i + 1,
      })

      if (isNewMin) {
        minIdx = j
        steps.push({
          array: [...arr], highlighted: [minIdx], compared: [], sorted: [...sortedSet],
          message: `New minimum is now ${arr[minIdx]} at index ${minIdx}.`,
          phase: 'select-min', comparisons, swaps, pass: i + 1,
        })
      }
    }

    if (minIdx !== i) {
      swaps++
      const tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp
      steps.push({
        array: [...arr], highlighted: [i, minIdx], compared: [], sorted: [...sortedSet],
        swap: [i, minIdx],
        message: `Pass ${i + 1} complete. Swapped minimum element ${arr[i]} into position ${i}.`,
        phase: 'swap', comparisons, swaps, pass: i + 1,
      })
    } else {
      steps.push({
        array: [...arr], highlighted: [i], compared: [], sorted: [...sortedSet],
        message: `Pass ${i + 1} complete. ${arr[i]} is already the minimum element. No swap needed.`,
        phase: 'no-swap', comparisons, swaps, pass: i + 1,
      })
    }

    sortedSet.add(i)
  }

  // The last element is automatically sorted
  sortedSet.add(n - 1)

  steps.push({
    array: [...arr], highlighted: [], compared: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    message: `Selection Sort complete! [${arr.join(', ')}]. Comparisons: ${comparisons}, Swaps: ${swaps}.`,
    phase: 'done', comparisons, swaps,
  })

  return steps
}
