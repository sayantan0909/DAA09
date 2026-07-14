import type { SortStep } from '@/types/sortStep'
import { bubbleSortExamples } from './bubbleSort'

export const insertionSortExamples = bubbleSortExamples

export function generateInsertionSortSteps(input: number[]): SortStep[] {
  const steps: SortStep[] = []
  const arr = [...input]
  const n = arr.length
  let comparisons = 0
  let swaps = 0 // Conceptually swaps or shifts

  // The sorted set conceptually grows from the left.
  const getSortedSet = (upToIndex: number) => Array.from({ length: upToIndex + 1 }, (_, k) => k)

  steps.push({
    array: [...arr], highlighted: [], compared: [], sorted: getSortedSet(0),
    message: `Insertion Sort on [${arr.join(', ')}]. The first element ${arr[0]} is considered sorted.`,
    phase: 'start', comparisons, swaps,
  })

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1

    steps.push({
      array: [...arr], highlighted: [i], compared: [], sorted: getSortedSet(i - 1),
      message: `Pass ${i}: select key ${key} at index ${i} to insert into the sorted portion [0...${i - 1}].`,
      phase: 'select-key', comparisons, swaps, pass: i,
    })

    while (j >= 0) {
      comparisons++
      
      steps.push({
        array: [...arr], highlighted: [j + 1], compared: [j], sorted: getSortedSet(i - 1),
        message: `Compare key ${key} with ${arr[j]} at index ${j}.`,
        phase: 'compare', comparisons, swaps, pass: i,
      })

      if (arr[j] > key) {
        swaps++
        arr[j + 1] = arr[j] // Shift

        steps.push({
          array: [...arr], highlighted: [j, j + 1], compared: [], sorted: getSortedSet(i - 1),
          message: `${arr[j]} > ${key}. Shift ${arr[j]} to the right.`,
          phase: 'shift', comparisons, swaps, pass: i,
        })
        j--
      } else {
        steps.push({
          array: [...arr], highlighted: [j + 1], compared: [j], sorted: getSortedSet(i - 1),
          message: `${arr[j]} ≤ ${key}. Correct position found.`,
          phase: 'no-swap', comparisons, swaps, pass: i,
        })
        break
      }
    }

    arr[j + 1] = key
    steps.push({
      array: [...arr], highlighted: [j + 1], compared: [], sorted: getSortedSet(i),
      message: `Inserted key ${key} at index ${j + 1}.`,
      phase: 'insert', comparisons, swaps, pass: i,
    })
  }

  steps.push({
    array: [...arr], highlighted: [], compared: [], sorted: getSortedSet(n - 1),
    message: `Insertion Sort complete! [${arr.join(', ')}]. Comparisons: ${comparisons}, Shifts: ${swaps}.`,
    phase: 'done', comparisons, swaps,
  })

  return steps
}
