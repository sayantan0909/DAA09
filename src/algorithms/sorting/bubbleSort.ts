import type { SortStep } from '@/types/sortStep'

export const bubbleSortExamples: { label: string; array: number[] }[] = [
  { label: 'Example 1 — Classic', array: [64, 34, 25, 12, 22, 11, 90] },
  { label: 'Example 2 — Reverse', array: [5, 4, 3, 2, 1] },
  { label: 'Example 3 — Already Sorted', array: [1, 2, 3, 4, 5] },
  { label: 'Example 4 — Duplicates', array: [7, 7, 3, 1, 9, 2, 2] },
  { label: 'Example 5 — Large Random', array: [10, 5, 8, 6, 3, 2, 9, 1, 7, 4] },
]

export function generateBubbleSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const arr = [...input]
  const n = arr.length
  const sortedSet = new Set<number>()
  let comparisons = 0
  let swaps = 0

  steps.push({
    array: [...arr], highlighted: [], compared: [], sorted: [],
    message: `Bubble Sort on [${arr.join(', ')}] — compare adjacent pairs and bubble the largest to the end each pass.`,
    phase: 'start', comparisons, swaps,
  })

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    steps.push({
      array: [...arr], highlighted: [0], compared: [], sorted: [...sortedSet],
      message: `Pass ${i + 1}: scan index 0 → ${n - i - 2}, bubble the largest unsorted element to position ${n - i - 1}.`,
      phase: 'pass-start', comparisons, swaps, pass: i + 1,
    })

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++
      const willSwap = arr[j] > arr[j + 1]

      steps.push({
        array: [...arr], highlighted: [j], compared: [j + 1], sorted: [...sortedSet],
        message: `Compare arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}. ${willSwap ? `${arr[j]} > ${arr[j + 1]} — swap!` : `${arr[j]} ≤ ${arr[j + 1]} — no swap.`}`,
        phase: 'compare', comparisons, swaps, pass: i + 1,
      })

      if (willSwap) {
        swaps++
        const tmp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = tmp
        swapped = true

        steps.push({
          array: [...arr], highlighted: [j, j + 1], compared: [], sorted: [...sortedSet],
          swap: [j, j + 1],
          message: `Swapped ${arr[j + 1]} ↔ ${arr[j]}. Array: [${arr.join(', ')}]`,
          phase: 'swap', comparisons, swaps, pass: i + 1,
        })
      }
    }

    sortedSet.add(n - i - 1)

    steps.push({
      array: [...arr], highlighted: [], compared: [], sorted: [...sortedSet],
      message: `Pass ${i + 1} complete. ${arr[n - i - 1]} is now at its final position ${n - i - 1}.${!swapped ? ' No swaps → array sorted early!' : ''}`,
      phase: 'pass-done', comparisons, swaps, pass: i + 1,
    })

    if (!swapped) break
  }

  sortedSet.add(0)

  steps.push({
    array: [...arr], highlighted: [], compared: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    message: `Bubble Sort complete! [${arr.join(', ')}]. Comparisons: ${comparisons}, Swaps: ${swaps}.`,
    phase: 'done', comparisons, swaps,
  })

  return steps
}
