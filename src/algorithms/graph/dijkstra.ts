import type {
  GraphStep, NodeStateArray, EdgeStateArray, DistRow, StaticGraph, EdgeState
} from '@/types/graphStep'

export const defaultDijkstraGraph: StaticGraph = {
  nodes: [
    { id: 0, label: '0', x: 200, y: 55 },
    { id: 1, label: '1', x: 60,  y: 170 },
    { id: 2, label: '2', x: 340, y: 170 },
    { id: 3, label: '3', x: 120, y: 290 },
    { id: 4, label: '4', x: 280, y: 290 },
  ],
  edges: [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 8 },
    { from: 1, to: 2, weight: 3 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 4, weight: 2 },
    { from: 3, to: 4, weight: 6 },
    { from: 2, to: 3, weight: 7 },
  ],
}

export const dijkstraExamples: { label: string; graph: StaticGraph; source: number }[] = [
  { label: 'Example 1 — 5 nodes', graph: defaultDijkstraGraph, source: 0 },
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
        { from: 0, to: 1, weight: 1 },
        { from: 0, to: 2, weight: 6 },
        { from: 1, to: 2, weight: 2 },
        { from: 1, to: 3, weight: 5 },
        { from: 2, to: 3, weight: 1 },
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
        { id: 3, label: '3', x: 60,  y: 255 },
        { id: 4, label: '4', x: 200, y: 255 },
        { id: 5, label: '5', x: 340, y: 255 },
      ],
      edges: [
        { from: 0, to: 1, weight: 2 },
        { from: 0, to: 2, weight: 6 },
        { from: 1, to: 3, weight: 5 },
        { from: 2, to: 4, weight: 3 },
        { from: 2, to: 5, weight: 1 },
        { from: 3, to: 4, weight: 1 },
        { from: 4, to: 5, weight: 4 },
      ],
    },
    source: 0,
  },
]

function edgeIndex(graph: StaticGraph, a: number, b: number): number {
  return graph.edges.findIndex(
    (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a),
  )
}

export function generateDijkstraSteps(graph: StaticGraph, source: number, isDirected = false): GraphStep[] {
  const steps: GraphStep[] = []
  const n = graph.nodes.length
  const m = graph.edges.length

  // Build adjacency list
  const adj = new Map<number, { to: number; weight: number }[]>()
  for (const nd of graph.nodes) adj.set(nd.id, [])
  for (const e of graph.edges) {
    adj.get(e.from)!.push({ to: e.to, weight: e.weight ?? 0 })
    if (!isDirected) {
      adj.get(e.to)!.push({ to: e.from, weight: e.weight ?? 0 })
    }
  }

  const ns: NodeStateArray = Array(n).fill('unvisited')
  ns[source] = 'source'

  const distTable: DistRow[] = graph.nodes.map((nd) => ({
    vertex: nd.label,
    dist: nd.id === source ? 0 : Infinity,
    parent: null,
    finalized: false,
    justRelaxed: false,
  }))

  const getTable = () => distTable.map(r => ({ ...r }))

  // Helper to rebuild correct 'shortest' edges from distTable
  const getEs = (overlayEI?: number, overlayState?: EdgeState) => {
    const newEs: EdgeStateArray = Array(m).fill('idle')
    // Reconstruct shortest paths
    for (let i = 0; i < n; i++) {
      const row = distTable[i]
      if (row.parent !== null) {
        // Find ID of parent
        const parentNode = graph.nodes.find(nd => nd.label === row.parent)
        if (parentNode) {
          const ei = edgeIndex(graph, parentNode.id, i)
          if (ei !== -1) newEs[ei] = 'shortest'
        }
      }
    }
    if (overlayEI !== undefined && overlayState) newEs[overlayEI] = overlayState
    return newEs
  }

  const finalized = new Set<number>()

  steps.push({
    nodeStates: [...ns], edgeStates: getEs(),
    distTable: getTable(),
    currentVertex: source,
    message: `Dijkstra from vertex ${graph.nodes[source].label}. dist[${graph.nodes[source].label}]=0, all others=∞. Pick min-distance unfinalized vertex each round.`,
    phase: 'start',
  })

  while (finalized.size < n) {
    // Reset justRelaxed flags
    for (const r of distTable) r.justRelaxed = false

    // Pick unfinalized vertex with minimum distance
    let minDist = Infinity
    let u = -1
    for (let i = 0; i < n; i++) {
      if (!distTable[i].finalized && distTable[i].dist < minDist) {
        minDist = distTable[i].dist
        u = i
      }
    }

    if (u === -1 || minDist === Infinity) break

    const uRow = distTable[u]
    uRow.finalized = true
    finalized.add(u)
    ns[u] = 'visited'
    const uLabel = graph.nodes[u].label

    steps.push({
      nodeStates: [...ns], edgeStates: getEs(),
      distTable: getTable(),
      currentVertex: u,
      message: `Finalize vertex ${uLabel} (dist=${minDist}). It has the smallest tentative distance among unfinalized vertices.`,
      phase: 'finalize',
    })

    // Relax neighbors
    for (const { to, weight } of adj.get(u)!) {
      if (finalized.has(to)) continue

      const newDist = minDist + weight
      const toRow = distTable[to]
      const toLabel = graph.nodes[to].label
      const ei = edgeIndex(graph, u, to)

      // Clear justRelaxed
      for (const r of distTable) r.justRelaxed = false

      if (newDist < toRow.dist) {
        const oldDist = toRow.dist
        toRow.dist = newDist
        toRow.parent = uLabel
        toRow.justRelaxed = true
        ns[to] = 'processing'
        
        steps.push({
          nodeStates: [...ns], edgeStates: getEs(ei, 'relaxed'),
          distTable: getTable(),
          currentVertex: u,
          relaxingVertex: to,
          relaxationCheck: {
            u: uLabel,
            v: toLabel,
            weight: weight,
            distU: minDist,
            distV: oldDist,
            isRelaxed: true
          },
          message: `Relax edge ${uLabel}→${toLabel} (w=${weight}): dist[${toLabel}] updated ${oldDist === Infinity ? '∞' : oldDist} → ${newDist} via ${uLabel}.`,
          phase: 'relax',
        })
      } else {
        steps.push({
          nodeStates: [...ns], edgeStates: getEs(ei, 'active'),
          distTable: getTable(),
          currentVertex: u,
          relaxingVertex: to,
          relaxationCheck: {
            u: uLabel,
            v: toLabel,
            weight: weight,
            distU: minDist,
            distV: toRow.dist,
            isRelaxed: false
          },
          message: `Edge ${uLabel}→${toLabel} (w=${weight}): newDist ${newDist} ≥ dist[${toLabel}]=${toRow.dist === Infinity ? '∞' : toRow.dist}. No update.`,
          phase: 'relax',
        })
      }
    }
  }

  steps.push({
    nodeStates: [...ns], edgeStates: getEs(),
    distTable: getTable(),
    currentVertex: undefined,
    message: `Dijkstra complete! Shortest distances from ${graph.nodes[source].label}: ${distTable.map((r) => `${r.vertex}=${r.dist === Infinity ? '∞' : r.dist}`).join(', ')}`,
    phase: 'done',
  })

  return steps
}
