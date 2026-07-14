import type { GraphStep, NodeStateArray, EdgeStateArray, StaticGraph } from '@/types/graphStep'

export const defaultBFSGraph: StaticGraph = {
  nodes: [
    { id: 0, label: '0', x: 200, y: 50 },
    { id: 1, label: '1', x: 80,  y: 155 },
    { id: 2, label: '2', x: 320, y: 155 },
    { id: 3, label: '3', x: 35,  y: 275 },
    { id: 4, label: '4', x: 155, y: 275 },
    { id: 5, label: '5', x: 275, y: 275 },
    { id: 6, label: '6', x: 370, y: 275 },
  ],
  edges: [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 2, to: 6 },
    { from: 3, to: 4 },
  ],
}

export const bfsExamples: { label: string; graph: StaticGraph; source: number }[] = [
  {
    label: 'Example 1 — Tree-like',
    graph: defaultBFSGraph,
    source: 0,
  },
  {
    label: 'Example 2 — Linear chain',
    graph: {
      nodes: [
        { id: 0, label: '0', x: 50,  y: 165 },
        { id: 1, label: '1', x: 155, y: 165 },
        { id: 2, label: '2', x: 255, y: 165 },
        { id: 3, label: '3', x: 355, y: 165 },
      ],
      edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
    },
    source: 0,
  },
  {
    label: 'Example 3 — Dense graph',
    graph: {
      nodes: [
        { id: 0, label: '0', x: 200, y: 60 },
        { id: 1, label: '1', x: 80,  y: 180 },
        { id: 2, label: '2', x: 320, y: 180 },
        { id: 3, label: '3', x: 155, y: 295 },
        { id: 4, label: '4', x: 245, y: 295 },
      ],
      edges: [
        { from: 0, to: 1 }, { from: 0, to: 2 },
        { from: 1, to: 3 }, { from: 2, to: 4 },
        { from: 1, to: 2 }, { from: 3, to: 4 },
      ],
    },
    source: 0,
  },
]

function buildAdj(graph: StaticGraph): Map<number, number[]> {
  const adj = new Map<number, number[]>()
  for (const n of graph.nodes) adj.set(n.id, [])
  for (const e of graph.edges) {
    adj.get(e.from)!.push(e.to)
    adj.get(e.to)!.push(e.from)
  }
  return adj
}

function edgeIndex(graph: StaticGraph, a: number, b: number): number {
  return graph.edges.findIndex(
    (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a),
  )
}

export function generateBFSSteps(graph: StaticGraph, source: number): GraphStep[] {
  const steps: GraphStep[] = []
  const adj = buildAdj(graph)
  const n = graph.nodes.length
  const m = graph.edges.length

  const ns: NodeStateArray = Array(n).fill('unvisited')
  const es: EdgeStateArray = Array(m).fill('idle')
  ns[source] = 'source'

  const visited = new Set<number>([source])
  const qIds: number[] = [source]
  const visitOrderIds: number[] = []

  const getQ = () => qIds.map(id => graph.nodes[id].label)
  const getOrder = () => visitOrderIds.map(id => graph.nodes[id].label)

  steps.push({
    nodeStates: [...ns], edgeStates: [...es],
    queue: getQ(), visitOrder: getOrder(),
    message: `BFS from vertex ${graph.nodes[source].label}. Source added to queue. Queue: [${getQ().join(', ')}]`,
    phase: 'start',
  })

  while (qIds.length > 0) {
    const curr = qIds.shift()!
    const currLabel = graph.nodes[curr].label
    visitOrderIds.push(curr)
    ns[curr] = 'processing'

    steps.push({
      nodeStates: [...ns], edgeStates: [...es],
      queue: getQ(), visitOrder: getOrder(),
      message: `Dequeue vertex ${currLabel}. Visit order: [${getOrder().join(' → ')}]. Queue now: [${getQ().join(', ')}]`,
      phase: 'dequeue',
    })

    const neighbors = (adj.get(curr) ?? []).sort((a, b) => a - b)
    for (const nb of neighbors) {
      const nbLabel = graph.nodes[nb].label
      const ei = edgeIndex(graph, curr, nb)
      if (!visited.has(nb)) {
        visited.add(nb)
        qIds.push(nb)
        ns[nb] = 'discovered'
        if (ei !== -1) es[ei] = 'inTree'   // spanning tree edge

        steps.push({
          nodeStates: [...ns], edgeStates: [...es],
          queue: getQ(), visitOrder: getOrder(),
          message: `Neighbor ${nbLabel} is unvisited → mark DISCOVERED, enqueue. Queue: [${getQ().join(', ')}]`,
          phase: 'enqueue',
        })
      } else {
        if (ei !== -1) {
          const prev = es[ei]
          es[ei] = 'active'
          steps.push({
            nodeStates: [...ns], edgeStates: [...es],
            queue: getQ(), visitOrder: getOrder(),
            message: `Neighbor ${nbLabel} already visited — cross edge, skip.`,
            phase: 'visit',
          })
          es[ei] = prev
        }
      }
    }

    ns[curr] = 'visited'
    steps.push({
      nodeStates: [...ns], edgeStates: [...es],
      queue: getQ(), visitOrder: getOrder(),
      message: `Vertex ${currLabel} fully explored → mark VISITED.`,
      phase: 'visit',
    })
  }

  steps.push({
    nodeStates: [...ns], edgeStates: [...es],
    queue: [], visitOrder: getOrder(),
    message: `BFS complete! Traversal order: ${getOrder().join(' → ')}`,
    phase: 'done',
  })

  return steps
}
