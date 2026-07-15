export type AlgorithmCategoryId =
  | 'searching'
  | 'sorting'
  | 'divide-conquer'
  | 'graph'
  | 'dp'

export interface AlgorithmMeta {
  /** Stable slug used in the route, e.g. "bubble-sort" */
  slug: string
  /** Display name, e.g. "Bubble Sort" */
  name: string
  category: AlgorithmCategoryId
  /** Sequential experiment number within the lab record, e.g. 4 */
  exptNo: number
  /** One-line summary shown on cards and in the sidebar tooltip */
  tagline: string
  /** True when the visualizer page has been implemented */
  implemented: boolean
}

export interface AlgorithmCategory {
  id: AlgorithmCategoryId
  label: string
  description: string
  /** Route base, e.g. "/searching" */
  path: string
}

export interface ComplexityInfo {
  best: string
  average: string
  worst: string
  space: string
  stable?: boolean
  inPlace?: boolean
  recursive?: boolean
}

export interface VivaQuestion {
  question: string
  answer: string
}

export interface AlgorithmContent {
  theory: string
  pseudocode: string
  code: string
  /** maps a step's phase to the 1-indexed line in `code` it corresponds to */
  codeLines: Partial<Record<string, number>>
  /** maps a step's phase to the 1-indexed line in `pseudocode` it corresponds to */
  pseudoLines?: Partial<Record<string, number>>
  complexity: ComplexityInfo
  viva: VivaQuestion[]
  applications: string[]
}
