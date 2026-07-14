import type { AlgorithmMeta } from '@/types/algorithm'

/**
 * Every algorithm in the practical syllabus, in lab-record (experiment) order.
 * `implemented` flips to true as each visualizer page ships in later phases.
 * Phase 1 ships the shell only — every entry below renders a "coming in
 * Phase N" placeholder page until its dedicated phase lands.
 */
export const algorithms: AlgorithmMeta[] = [
  // Searching
  { slug: 'linear-search', name: 'Linear Search', category: 'searching', exptNo: 1, tagline: 'Scan every element until the target is found.', implemented: true },
  { slug: 'modified-linear-search', name: 'Modified Linear Search', category: 'searching', exptNo: 2, tagline: 'Linear search with a self-organizing shortcut.', implemented: true },
  { slug: 'binary-search-iterative', name: 'Binary Search (Iterative)', category: 'searching', exptNo: 3, tagline: 'Halve the search space each iteration.', implemented: true },
  { slug: 'binary-search-recursive', name: 'Binary Search (Recursive)', category: 'searching', exptNo: 4, tagline: 'Halve the search space via recursive calls.', implemented: true },

  // Sorting
  { slug: 'bubble-sort', name: 'Bubble Sort', category: 'sorting', exptNo: 5, tagline: 'Repeatedly swap adjacent out-of-order pairs.', implemented: true },
  { slug: 'selection-sort', name: 'Selection Sort', category: 'sorting', exptNo: 6, tagline: 'Select the minimum and place it each pass.', implemented: true },
  { slug: 'insertion-sort', name: 'Insertion Sort', category: 'sorting', exptNo: 7, tagline: 'Insert each element into its sorted position.', implemented: true },
  { slug: 'merge-sort', name: 'Merge Sort', category: 'sorting', exptNo: 8, tagline: 'Divide, sort halves, then merge.', implemented: true },
  { slug: 'quick-sort', name: 'Quick Sort', category: 'sorting', exptNo: 9, tagline: 'Partition around a pivot, then recurse.', implemented: true },
  { slug: 'heap-sort', name: 'Heap Sort', category: 'sorting', exptNo: 10, tagline: 'Build a heap, then repeatedly extract the root.', implemented: true },

  // Divide & Conquer
  { slug: 'min-max', name: 'Min-Max', category: 'divide-conquer', exptNo: 11, tagline: 'Find minimum and maximum with fewer comparisons.', implemented: true },

  // Graph
  { slug: 'bfs', name: 'Breadth-First Search', category: 'graph', exptNo: 12, tagline: 'Explore neighbors level by level using a queue.', implemented: true },
  { slug: 'dfs', name: 'Depth-First Search', category: 'graph', exptNo: 13, tagline: 'Explore as deep as possible using a stack.', implemented: true },
  { slug: 'prim', name: "Prim's Algorithm", category: 'graph', exptNo: 14, tagline: 'Grow a minimum spanning tree one edge at a time.', implemented: true },
  { slug: 'kruskal', name: "Kruskal's Algorithm", category: 'graph', exptNo: 15, tagline: 'Add the smallest safe edge using union-find.', implemented: true },
  { slug: 'dijkstra', name: "Dijkstra's Algorithm", category: 'graph', exptNo: 16, tagline: 'Greedily relax the nearest unvisited vertex.', implemented: true },

  // Dynamic Programming
  { slug: 'matrix-chain-multiplication', name: 'Matrix Chain Multiplication', category: 'dp', exptNo: 17, tagline: 'Find the cheapest parenthesization via a DP table.', implemented: true },
]

export const getAlgorithmsByCategory = (category: string) =>
  algorithms.filter((a) => a.category === category)

export const getAlgorithm = (slug: string) =>
  algorithms.find((a) => a.slug === slug)
