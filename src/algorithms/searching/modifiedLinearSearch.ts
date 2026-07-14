import type { SearchStep } from '@/types/step'

export function generateModifiedLinearSearchSteps(
  array: number[],
  target: number,
): SearchStep[] {
  const steps: SearchStep[] = []
  const working = [...array]

  steps.push({
    array: [...working],
    currentIndex: null,
    foundIndex: null,
    message: `Searching for ${target}. On a hit, the element will move one step closer to the front (transposition).`,
    phase: 'start',
  })

  for (let i = 0; i < working.length; i++) {
    steps.push({
      array: [...working],
      currentIndex: i,
      foundIndex: null,
      message: `Comparing arr[${i}] = ${working[i]} with target ${target}.`,
      phase: 'compare',
    })

    if (working[i] === target) {
      steps.push({
        array: [...working],
        currentIndex: i,
        foundIndex: i,
        message: `Match found at index ${i}.`,
        phase: 'found',
      })

      if (i > 0) {
        const tmp = working[i]
        working[i] = working[i - 1]
        working[i - 1] = tmp

        steps.push({
          array: [...working],
          currentIndex: i - 1,
          foundIndex: i - 1,
          message: `Transposition: swap arr[${i}] and arr[${i - 1}] so future searches for ${target} are faster.`,
          phase: 'shift',
        })
      }

      return steps
    }
  }

  steps.push({
    array: [...working],
    currentIndex: null,
    foundIndex: null,
    message: `Reached the end of the array. ${target} is not present.`,
    phase: 'not-found',
  })

  return steps
}
