import type { SearchStep } from '@/types/step'

export function generateBinarySearchRecursiveSteps(
  array: number[],
  target: number,
): SearchStep[] {
  const steps: SearchStep[] = []

  steps.push({
    array: [...array],
    currentIndex: null,
    foundIndex: null,
    low: 0,
    high: array.length - 1,
    message: `Call binarySearch(low = 0, high = ${array.length - 1}) looking for ${target}.`,
    phase: 'start',
  })

  function recurse(low: number, high: number) {
    if (low > high) {
      steps.push({
        array: [...array],
        currentIndex: null,
        foundIndex: null,
        low,
        high,
        message: `Base case: low (${low}) > high (${high}). Return -1, ${target} is not present.`,
        phase: 'not-found',
      })
      return
    }

    const mid = Math.floor((low + high) / 2)

    steps.push({
      array: [...array],
      currentIndex: mid,
      foundIndex: null,
      low,
      high,
      mid,
      message: `mid = ${mid}. Comparing arr[${mid}] = ${array[mid]} with target ${target}.`,
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
        message: `Base case: arr[${mid}] equals ${target}. Return ${mid}.`,
        phase: 'found',
      })
      return
    }

    if (array[mid] < target) {
      steps.push({
        array: [...array],
        currentIndex: null,
        foundIndex: null,
        low,
        high,
        message: `arr[${mid}] < ${target}. Recursive call binarySearch(${mid + 1}, ${high}).`,
        phase: 'recurse',
      })
      recurse(mid + 1, high)
    } else {
      steps.push({
        array: [...array],
        currentIndex: null,
        foundIndex: null,
        low,
        high,
        message: `arr[${mid}] > ${target}. Recursive call binarySearch(${low}, ${mid - 1}).`,
        phase: 'recurse',
      })
      recurse(low, mid - 1)
    }
  }

  recurse(0, array.length - 1)
  return steps
}
