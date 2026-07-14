import type { AlgorithmCategory } from '@/types/algorithm'

export const categories: AlgorithmCategory[] = [
  {
    id: 'searching',
    label: 'Searching',
    description: 'Locating a target value within a data set.',
    path: '/searching',
  },
  {
    id: 'sorting',
    label: 'Sorting',
    description: 'Arranging elements into a defined order.',
    path: '/sorting',
  },
  {
    id: 'divide-conquer',
    label: 'Divide & Conquer',
    description: 'Breaking a problem into independent subproblems.',
    path: '/divide-conquer',
  },
  {
    id: 'graph',
    label: 'Graph Algorithms',
    description: 'Traversal, shortest path, and spanning tree techniques.',
    path: '/graph',
  },
  {
    id: 'dp',
    label: 'Dynamic Programming',
    description: 'Solving problems via optimal substructure and memoization.',
    path: '/dp',
  },
]

export const getCategory = (id: string) =>
  categories.find((c) => c.id === id)
