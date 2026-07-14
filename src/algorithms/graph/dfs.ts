import type { GraphStep, NodeStateArray, EdgeStateArray, StaticGraph } from '@/types/graphStep'

export const defaultDFSGraph: StaticGraph = {
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

export const dfsExamples: { label: string; graph: StaticGraph; source: number }[] = [
  { label: 'Example 1 — Tree-like', graph: defaultDFSGraph, source: 0 },
  {
    label: 'Example 2 — Path graph',
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
    label: 'Example 3 — Back-edge graph',
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

export function generateDFSSteps(graph: StaticGraph, source: number): GraphStep[] {
  const steps: GraphStep[] = []
  const adj = buildAdj(graph)
  const n = graph.nodes.length
  const m = graph.edges.length

  const ns: NodeStateArray = Array(n).fill('unvisited')
  const es: EdgeStateArray = Array(m).fill('idle')
  ns[source] = 'source'

  const stackIds: number[] = [source]
  const visitOrderIds: number[] = []

  const getS = () => stackIds.map(id => graph.nodes[id].label)
  const getOrder = () => visitOrderIds.map(id => graph.nodes[id].label)

  steps.push({
    nodeStates: [...ns], edgeStates: [...es],
    stack: getS(), visitOrder: getOrder(), isBacktrack: false,
    message: `DFS from vertex ${graph.nodes[source].label}. Push source to stack. Stack: [${getS().join(', ')}]`,
    phase: 'start',
  })

  while (stackIds.length > 0) {
    const curr = stackIds.pop()!
    const currLabel = graph.nodes[curr].label

    if (ns[curr] === 'visited') {
      steps.push({
        nodeStates: [...ns], edgeStates: [...es],
        stack: getS(), visitOrder: getOrder(), isBacktrack: true,
        message: `Pop ${currLabel}. Already visited, backtrack.`,
        phase: 'backtrack',
      })
      continue
    }

    visitOrderIds.push(curr)
    ns[curr] = 'processing'

    steps.push({
      nodeStates: [...ns], edgeStates: [...es],
      stack: getS(), visitOrder: getOrder(), isBacktrack: false,
      message: `Pop ${currLabel}. Mark as visited. Visit order: [${getOrder().join(' → ')}]`,
      phase: 'pop',
    })

    const neighbors = (adj.get(curr) ?? []).sort((a, b) => b - a)
    for (const nb of neighbors) {
      const nbLabel = graph.nodes[nb].label
      const ei = edgeIndex(graph, curr, nb)

      if (ns[nb] === 'unvisited' || ns[nb] === 'discovered') {
        stackIds.push(nb)
        ns[nb] = 'discovered'
        if (ei !== -1) {
          const prev = es[ei]
          es[ei] = 'active'
          steps.push({
            nodeStates: [...ns], edgeStates: [...es],
            stack: getS(), visitOrder: getOrder(), isBacktrack: false,
            message: `Neighbor ${nbLabel} is unvisited. Push to stack. Stack: [${getS().join(', ')}]`,
            phase: 'push',
          })
          es[ei] = prev
        }
      } else {
        if (ei !== -1) {
          const prev = es[ei]
          es[ei] = 'rejected'
          steps.push({
            nodeStates: [...ns], edgeStates: [...es],
            stack: getS(), visitOrder: getOrder(), isBacktrack: false,
            message: `Neighbor ${nbLabel} already visited. Cross/Back edge ignored.`,
            phase: 'visit',
          })
          es[ei] = prev
        }
      }
    }

    ns[curr] = 'visited'
    steps.push({
      nodeStates: [...ns], edgeStates: [...es],
      stack: getS(), visitOrder: getOrder(), isBacktrack: false,
      message: `Vertex ${currLabel} fully processed.`,
      phase: 'visit',
    })
  }

  // Restore spanning tree edges from visit order
  for (let i = 1; i < visitOrderIds.length; i++) {
    const to = visitOrderIds[i]
    // find first visited neighbor
    for (let j = i - 1; j >= 0; j--) {
      const from = visitOrderIds[j]
      const ei = edgeIndex(graph, from, to)
      if (ei !== -1) {
        es[ei] = 'inTree'
        break
      }
    }
  }

  steps.push({
    nodeStates: [...ns], edgeStates: [...es],
    stack: [], visitOrder: getOrder(), isBacktrack: false,
    message: `DFS complete! Traversal order: ${getOrder().join(' → ')}`,
    phase: 'done',
  })

  return steps
}
