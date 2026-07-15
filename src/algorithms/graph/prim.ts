import type {
  GraphStep, NodeStateArray, EdgeStateArray, StaticGraph, EdgeState
} from '@/types/graphStep'

export const defaultPrimGraph: StaticGraph = {
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

export const primExamples: { label: string; graph: StaticGraph; source: number }[] = [
  { label: 'Example 1 — 5 nodes', graph: defaultPrimGraph, source: 0 },
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
    source: 0,
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
        { from: 1, to: 4, weight: 8 },
      ],
    },
    source: 0,
  },
]

// Removed unused edgeIndex function

export function generatePrimSteps(graph: StaticGraph, source: number): GraphStep[] {
  const steps: GraphStep[] = []
  const n = graph.nodes.length
  const m = graph.edges.length

  // Build adjacency list
  const adj = new Map<number, { to: number; weight: number; ei: number }[]>()
  for (const nd of graph.nodes) adj.set(nd.id, [])
  for (let i = 0; i < m; i++) {
    const e = graph.edges[i]
    adj.get(e.from)!.push({ to: e.to, weight: e.weight ?? 0, ei: i })
    adj.get(e.to)!.push({ to: e.from, weight: e.weight ?? 0, ei: i })
  }

  const ns: NodeStateArray = Array(n).fill('unvisited')
  const es: EdgeStateArray = Array(m).fill('idle')
  ns[source] = 'inMST'

  const inMST = new Set<number>([source])
  const mstEdges: { from: number | string; to: number | string; weight: number }[] = []
  const mstEIs = new Set<number>()
  let mstCost = 0

  // Helper to reconstruct correct es from mstEIs
  const getEs = (overlayEI?: number, overlayState?: EdgeState) => {
    const newEs = [...es]
    for (const ei of mstEIs) newEs[ei] = 'inMST'
    if (overlayEI !== undefined && overlayState) newEs[overlayEI] = overlayState
    return newEs
  }

  // Priority queue entries: { from, to, weight, ei }
  type PQEntry = { from: number; to: number; weight: number; ei: number }
  let pq: PQEntry[] = []

  // Initialize PQ with edges from source
  for (const { to, weight, ei } of adj.get(source)!) {
    pq.push({ from: source, to, weight, ei })
    ns[to] = 'discovered'
    es[ei] = 'active'
  }
  pq.sort((a, b) => a.weight - b.weight)

  const getCandidateEdges = () => {
    return pq.map((e, idx) => ({
      from: graph.nodes[e.from].label,
      to: graph.nodes[e.to].label,
      weight: e.weight,
      isMin: idx === 0
    }))
  }

  steps.push({
    nodeStates: [...ns], edgeStates: getEs(),
    mstCost: 0, mstEdges: [], candidateEdges: getCandidateEdges(),
    message: `Prim's from vertex ${graph.nodes[source].label}. Added to MST. Priority queue initialized with ${graph.nodes[source].label}'s edges.`,
    phase: 'start',
  })

  while (inMST.size < n && pq.length > 0) {
    // Pick cheapest edge from PQ
    const best = pq.shift()!
    const fromL = graph.nodes[best.from].label
    const toL = graph.nodes[best.to].label

    // Mark this edge as being considered
    steps.push({
      nodeStates: [...ns], edgeStates: getEs(best.ei, 'active'),
      mstCost, mstEdges: [...mstEdges], candidateEdges: getCandidateEdges(),
      message: `Priority Queue top: edge ${fromL}–${toL} (w=${best.weight}). Is vertex ${toL} already in MST?`,
      phase: 'pick-edge',
    })

    if (inMST.has(best.to)) {
      // Already in MST — reset edge and skip
      if (es[best.ei] === 'active') es[best.ei] = 'idle'
      steps.push({
        nodeStates: [...ns], edgeStates: getEs(),
        mstCost, mstEdges: [...mstEdges], candidateEdges: getCandidateEdges(),
        message: `Vertex ${toL} already in MST — skip this edge (stale PQ entry).`,
        phase: 'pick-edge',
      })
      continue
    }

    // Accept edge
    es[best.ei] = 'idle' // remove 'active' from base
    mstEIs.add(best.ei)
    inMST.add(best.to)
    mstCost += best.weight
    mstEdges.push({ from: fromL, to: toL, weight: best.weight })
    ns[best.to] = 'inMST'

    const mstNodesLabel = [...inMST].map(id => graph.nodes[id].label).sort().join(', ')

    steps.push({
      nodeStates: [...ns], edgeStates: getEs(),
      mstCost, mstEdges: [...mstEdges], candidateEdges: getCandidateEdges(),
      message: `Edge ${fromL}–${toL} (w=${best.weight}) accepted. MST cost = ${mstCost}. Vertices in MST: {${mstNodesLabel}}`,
      phase: 'accept-edge',
    })

    // Add new candidate edges from best.to
    for (const { to, weight, ei } of adj.get(best.to)!) {
      if (!inMST.has(to)) {
        pq.push({ from: best.to, to, weight, ei })
        if (ns[to] === 'unvisited') ns[to] = 'discovered'
        if (es[ei] === 'idle') es[ei] = 'active'
      }
    }
    pq.sort((a, b) => a.weight - b.weight)

    steps.push({
      nodeStates: [...ns], edgeStates: getEs(),
      mstCost, mstEdges: [...mstEdges], candidateEdges: getCandidateEdges(),
      message: `Added new candidates to PQ. PQ: [${pq.map((e) => `${graph.nodes[e.from].label}-${graph.nodes[e.to].label}(${e.weight})`).join(', ')}]`,
      phase: 'enqueue',
    })
  }

  steps.push({
    nodeStates: [...ns], edgeStates: getEs(),
    mstCost, mstEdges: [...mstEdges], candidateEdges: [],
    message: `Prim's complete! MST cost = ${mstCost}. MST edges: ${mstEdges.map((e) => `${e.from}-${e.to}(${e.weight})`).join(', ')}`,
    phase: 'done',
  })

  return steps
}
