import type {
  GraphStep, NodeStateArray, EdgeStateArray, EdgeState,
  KruskalEdgeRow, StaticGraph,
} from '@/types/graphStep'

export const defaultKruskalGraph: StaticGraph = {
  nodes: [
    { id: 0, label: '0', x: 200, y: 55 },
    { id: 1, label: '1', x: 60,  y: 165 },
    { id: 2, label: '2', x: 340, y: 165 },
    { id: 3, label: '3', x: 120, y: 285 },
    { id: 4, label: '4', x: 280, y: 285 },
  ],
  edges: [
    { from: 0, to: 1, weight: 2 },
    { from: 0, to: 2, weight: 3 },
    { from: 1, to: 2, weight: 5 },
    { from: 1, to: 3, weight: 4 },
    { from: 2, to: 4, weight: 1 },
    { from: 3, to: 4, weight: 6 },
    { from: 0, to: 3, weight: 7 },
  ],
}

export const kruskalExamples: { label: string; graph: StaticGraph }[] = [
  { label: 'Example 1 — 5 nodes', graph: defaultKruskalGraph },
  {
    label: 'Example 2 — 4 nodes',
    graph: {
      nodes: [
        { id: 0, label: '0', x: 200, y: 60 },
        { id: 1, label: '1', x: 80,  y: 200 },
        { id: 2, label: '2', x: 320, y: 200 },
        { id: 3, label: '3', x: 200, y: 300 },
      ],
      edges: [
        { from: 0, to: 1, weight: 3 },
        { from: 0, to: 2, weight: 1 },
        { from: 1, to: 3, weight: 2 },
        { from: 2, to: 3, weight: 4 },
        { from: 1, to: 2, weight: 5 },
      ],
    },
  },
  {
    label: 'Example 3 — 6 nodes',
    graph: {
      nodes: [
        { id: 0, label: '0', x: 200, y: 40 },
        { id: 1, label: '1', x: 60,  y: 130 },
        { id: 2, label: '2', x: 340, y: 130 },
        { id: 3, label: '3', x: 60,  y: 260 },
        { id: 4, label: '4', x: 200, y: 260 },
        { id: 5, label: '5', x: 340, y: 260 },
      ],
      edges: [
        { from: 0, to: 1, weight: 4 },
        { from: 0, to: 2, weight: 2 },
        { from: 1, to: 3, weight: 3 },
        { from: 2, to: 4, weight: 6 },
        { from: 2, to: 5, weight: 1 },
        { from: 3, to: 4, weight: 5 },
        { from: 4, to: 5, weight: 7 },
      ],
    },
  },
]

// ─── Union-Find ──────────────────────────────────────────────────────────────
function find(subsets: { id: number, parent: number, rank: number }[], i: number): number {
  if (subsets[i].parent !== i) {
    subsets[i].parent = find(subsets, subsets[i].parent) // path compression
  }
  return subsets[i].parent
}

function union(subsets: { id: number, parent: number, rank: number }[], x: number, y: number) {
  const rx = find(subsets, x)
  const ry = find(subsets, y)
  if (rx === ry) return
  if (subsets[rx].rank < subsets[ry].rank) {
    subsets[rx].parent = ry
  } else if (subsets[rx].rank > subsets[ry].rank) {
    subsets[ry].parent = rx
  } else {
    subsets[ry].parent = rx
    subsets[rx].rank++
  }
}

export function generateKruskalSteps(graph: StaticGraph): GraphStep[] {
  const steps: GraphStep[] = []
  const n = graph.nodes.length
  const m = graph.edges.length

  // Sort edges by weight
  const sortedEdgeIndices = graph.edges
    .map((_, i) => i)
    .sort((a, b) => (graph.edges[a].weight ?? 0) - (graph.edges[b].weight ?? 0))

  const ns: NodeStateArray = Array(n).fill('unvisited')
  const es: EdgeStateArray = Array(m).fill('idle')

  const subsetsInternal = graph.nodes.map((nd) => ({
    id: nd.id,
    parent: nd.id,
    rank: 0,
  }))

  const getSubsets = () => subsetsInternal.map(s => ({ 
    id: graph.nodes[s.id].label, 
    parent: graph.nodes[s.parent].label, 
    rank: s.rank 
  }))

  const sortedEdgeRows: KruskalEdgeRow[] = sortedEdgeIndices.map((i) => ({
    from: graph.nodes[graph.edges[i].from].label,
    to: graph.nodes[graph.edges[i].to].label,
    weight: graph.edges[i].weight ?? 0,
    status: 'pending',
  }))

  const mstEdges: { from: string | number; to: string | number; weight: number }[] = []
  const mstEIs = new Set<number>()
  let mstCost = 0
  let accepted = 0

  const getEs = (overlayEI?: number, overlayState?: EdgeState) => {
    const newEs = [...es]
    for (const ei of mstEIs) newEs[ei] = 'inMST'
    if (overlayEI !== undefined && overlayState) newEs[overlayEI] = overlayState
    return newEs
  }

  steps.push({
    nodeStates: [...ns], edgeStates: getEs(),
    sortedEdges: sortedEdgeRows.map((r) => ({ ...r })),
    subsets: getSubsets(),
    mstCost: 0, mstEdges: [],
    message: `Kruskal's: ${m} edges sorted by weight. Need ${n - 1} edges for MST of ${n} vertices.`,
    phase: 'start',
  })

  for (let rowIdx = 0; rowIdx < sortedEdgeIndices.length && accepted < n - 1; rowIdx++) {
    const origIdx = sortedEdgeIndices[rowIdx]
    const { from, to, weight } = graph.edges[origIdx]
    const fromL = graph.nodes[from].label
    const toL = graph.nodes[to].label

    sortedEdgeRows[rowIdx].status = 'active'
    es[origIdx] = 'idle' // base is idle, we use overlay for active

    const x = find(subsetsInternal, from)
    const y = find(subsetsInternal, to)
    const xL = graph.nodes[x].label
    const yL = graph.nodes[y].label

    steps.push({
      nodeStates: [...ns], edgeStates: getEs(origIdx, 'active'),
      sortedEdges: sortedEdgeRows.map((r) => ({ ...r })),
      subsets: getSubsets(),
      mstCost, mstEdges: [...mstEdges],
      message: `Examining edge ${fromL}–${toL} (w=${weight}). find(${fromL})=${xL}, find(${toL})=${yL}. Same component? ${x === y ? 'YES → cycle!' : 'NO → safe to add.'}`,
      phase: 'pick-edge',
    })

    if (x !== y) {
      union(subsetsInternal, x, y)
      accepted++
      mstCost += (weight ?? 0)
      mstEdges.push({ from: fromL, to: toL, weight: weight ?? 0 })
      sortedEdgeRows[rowIdx].status = 'accepted'
      mstEIs.add(origIdx)
      ns[from] = 'inMST'
      ns[to] = 'inMST'

      steps.push({
        nodeStates: [...ns], edgeStates: getEs(),
        sortedEdges: sortedEdgeRows.map((r) => ({ ...r })),
        subsets: getSubsets(),
        mstCost, mstEdges: [...mstEdges],
        message: `✅ No cycle! UNION(${xL}, ${yL}). Edge ${fromL}–${toL} ACCEPTED. MST cost = ${mstCost}. Edges accepted: ${accepted}/${n - 1}.`,
        phase: 'accept-edge',
      })
    } else {
      sortedEdgeRows[rowIdx].status = 'rejected'
      es[origIdx] = 'rejected' // base is rejected now

      steps.push({
        nodeStates: [...ns], edgeStates: getEs(),
        sortedEdges: sortedEdgeRows.map((r) => ({ ...r })),
        subsets: getSubsets(),
        mstCost, mstEdges: [...mstEdges],
        message: `❌ Cycle! ${fromL} and ${toL} share component root ${xL}. Edge REJECTED.`,
        phase: 'reject-edge',
      })
    }
  }

  steps.push({
    nodeStates: [...ns], edgeStates: getEs(),
    sortedEdges: sortedEdgeRows.map((r) => ({ ...r })),
    subsets: getSubsets(),
    mstCost, mstEdges: [...mstEdges],
    message: `Kruskal's complete! Minimum Spanning Tree cost = ${mstCost}.`,
    phase: 'done',
  })

  return steps
}
