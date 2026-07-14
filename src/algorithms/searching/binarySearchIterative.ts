import type { SearchStep } from '@/types/step'

export function generateBinarySearchIterativeSteps(
  array: number[],
  target: number,
): SearchStep[] {
  const steps: SearchStep[] = []
  let low = 0
  let high = array.length - 1

  steps.push({
    array: [...array],
    currentIndex: null,
    foundIndex: null,
    low,
    high,
    message: `Searching sorted array for ${target}. low = ${low}, high = ${high}.`,
    phase: 'start',
  })

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    steps.push({
      array: [...array],
      currentIndex: mid,
      foundIndex: null,
      low,
      high,
      mid,
      message: `mid = (${low} + ${high}) / 2 = ${mid}. Comparing arr[${mid}] = ${array[mid]} with target ${target}.`,
      phase: 'compare',
    })

    if (array[mid] === target) {
      steps.push({
        array: [...array],
        currentIndex: mid,
        foundIndex: mid,
        low,
        high,
        mid,
        message: `Match: arr[${mid}] equals ${target}. Search ends.`,
        phase: 'found',
      })
      return steps
    }

    if (array[mid] < target) {
      low = mid + 1
      steps.push({
        array: [...array],
        currentIndex: null,
        foundIndex: null,
        low,
        high,
        message: `arr[${mid}] < ${target}, so discard the left half. low = ${low}.`,
        phase: 'recurse',
      })
    } else {
      high = mid - 1
      steps.push({
        array: [...array],
        currentIndex: null,
        foundIndex: null,
        low,
        high,
        message: `arr[${mid}] > ${target}, so discard the right half. high = ${high}.`,
        phase: 'recurse',
      })
    }
  }

  steps.push({
    array: [...array],
    currentIndex: null,
    foundIndex: null,
    low,
    high,
    message: `low (${low}) exceeded high (${high}). ${target} is not present.`,
    phase: 'not-found',
  })

  return steps
}
