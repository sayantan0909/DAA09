import type { SearchStep } from '@/types/step'

export function generateLinearSearchSteps(array: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = []

  steps.push({
    array: [...array],
    currentIndex: null,
    foundIndex: null,
    message: `Searching for ${target} by scanning from the start of the array.`,
    phase: 'start',
  })

  for (let i = 0; i < array.length; i++) {
    steps.push({
      array: [...array],
      currentIndex: i,
      foundIndex: null,
      message: `Comparing arr[${i}] = ${array[i]} with target ${target}.`,
      phase: 'compare',
    })

    if (array[i] === target) {
      steps.push({
        array: [...array],
        currentIndex: i,
        foundIndex: i,
        message: `Match found: arr[${i}] equals ${target}. Search ends.`,
        phase: 'found',
      })
      return steps
    }
  }

  steps.push({
    array: [...array],
    currentIndex: null,
    foundIndex: null,
    message: `Reached the end of the array. ${target} is not present.`,
    phase: 'not-found',
  })

  return steps
}
