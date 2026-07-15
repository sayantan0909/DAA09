/** Richer node state labels (used for colour-coding and legend) */
export type NodeState =
  | 'unvisited'     // default grey
  | 'discovered'    // in queue / on stack — amber-dim
  | 'processing'    // currently being expanded — amber bright
  | 'visited'       // fully processed — teal
  | 'inMST'         // part of MST (Prim / Kruskal) — teal
  | 'inPath'        // part of shortest path (Dijkstra) — teal
  | 'source'        // start vertex — amber

/** Edge state */
export type EdgeState =
  | 'idle'          // not yet considered
  | 'active'        // currently being examined (animated dash)
  | 'inMST'         // accepted into MST (Prim/Kruskal) — teal solid
  | 'inTree'        // spanning tree edge (BFS/DFS) — teal solid
  | 'shortest'      // part of shortest-path tree — teal solid
  | 'relaxed'       // edge just relaxed this step — amber glow
  | 'rejected'      // cycle detected, rejected — terracotta

/** Static graph definition — positions & connections never change */
export interface StaticGraph {
  nodes: { id: number; label: string; x: number; y: number }[]
  edges: { from: number; to: number; weight?: number }[]
}

/** Per-step mutable state (parallel arrays indexed to StaticGraph) */
export type NodeStateArray = NodeState[]   // index = node id
export type EdgeStateArray = EdgeState[]   // index = edge index

/** One row of the Dijkstra distance table */
export interface DistRow {
  vertex: string | number
  dist: number        // Infinity for unreachable
  parent: string | number | null
  finalized: boolean
  justRelaxed?: boolean  // highlight row this step
}

/** One row of the Kruskal sorted-edge table */
export interface KruskalEdgeRow {
  from: string | number
  to: string | number
  weight: number
  status: 'pending' | 'active' | 'accepted' | 'rejected'
}

/** Union-Find subset entry (Kruskal) */
export interface Subset {
  id: string | number
  parent: string | number
  rank: number
}

export type GraphPhase =
  | 'start'
  | 'enqueue'
  | 'dequeue'
  | 'push'
  | 'pop'
  | 'visit'
  | 'backtrack'
  | 'pick-edge'
  | 'accept-edge'
  | 'reject-edge'
  | 'relax'
  | 'finalize'
  | 'done'

export interface GraphStep {
  /** Parallel state arrays — same length as StaticGraph.nodes / edges */
  nodeStates: NodeStateArray
  edgeStates: EdgeStateArray
  /** Human-readable narration */
  message: string
  /** Phase tag for code-line highlighting */
  phase: GraphPhase

  // ── BFS ──────────────────────────────────────────────
  queue?: (number | string)[]
  visitOrder?: (number | string)[]

  // ── DFS ──────────────────────────────────────────────
  /** Stack of vertices for DFS */
  stack?: string[]
  /** Optional recursion call stack frame names (e.g. DFS(1)) */
  callStack?: { fn: string; args: string }[]
  /** Was this step a backtrack pop? */
  isBacktrack?: boolean   // true when current step is a backtrack

  // ── Prim / Kruskal ───────────────────────────────────
  mstCost?: number
  mstEdges?: { from: number | string; to: number | string; weight: number }[]
  sortedEdges?: KruskalEdgeRow[]
  subsets?: { id: number | string; parent: number | string; rank: number }[]
  candidateEdges?: { from: number | string; to: number | string; weight: number; isMin?: boolean }[]

  // ── Dijkstra / Bellman-Ford ──────────────────────────
  distTable?: DistRow[]
  currentVertex?: number
  relaxingVertex?: number
  relaxationCheck?: {
    u: string;
    v: string;
    weight: number;
    distU: number;
    distV: number;
    isRelaxed: boolean;
  }
}
