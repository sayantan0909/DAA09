import type { StaticGraph, NodeState, EdgeState } from '@/types/graphStep'

// ─── Colour mapping ───────────────────────────────────────────────────────────
const NODE_FILL: Record<NodeState, string> = {
  unvisited:  'var(--color-surface-raised)',
  discovered: 'var(--color-amber-dim)',
  processing: 'var(--color-amber)',
  visited:    'var(--color-teal-dim)',
  inMST:      'var(--color-teal)',
  inPath:     'var(--color-teal)',
  source:     'var(--color-amber)',
}
const NODE_STROKE: Record<NodeState, string> = {
  unvisited:  'var(--color-border-strong)',
  discovered: 'var(--color-amber)',
  processing: 'var(--color-amber)',
  visited:    'var(--color-teal)',
  inMST:      'var(--color-teal)',
  inPath:     'var(--color-teal)',
  source:     'var(--color-amber)',
}
const NODE_TEXT: Record<NodeState, string> = {
  unvisited:  'var(--color-text-faint)',
  discovered: 'var(--color-text)',
  processing: '#0F1419',
  visited:    'var(--color-text-muted)',
  inMST:      '#0F1419',
  inPath:     '#0F1419',
  source:     '#0F1419',
}
const EDGE_STROKE: Record<EdgeState, string> = {
  idle:     'var(--color-border-strong)',
  active:   'var(--color-amber)',
  inMST:    'var(--color-teal)',
  inTree:   'var(--color-teal)',
  shortest: 'var(--color-teal)',
  relaxed:  'var(--color-amber)',
  rejected: 'var(--color-terracotta)',
}
const EDGE_WIDTH: Record<EdgeState, number> = {
  idle:     1.5,
  active:   2.5,
  inMST:    3,
  inTree:   3,
  shortest: 3,
  relaxed:  3,
  rejected: 1.5,
}

interface GraphCanvasProps {
  graph: StaticGraph
  nodeStates: NodeState[]
  edgeStates: EdgeState[]
  showWeights?: boolean
  width?: number
  height?: number
}

const R = 22  // node radius

export function GraphCanvas({
  graph,
  nodeStates,
  edgeStates,
  showWeights = false,
  width = 420,
  height = 340,
}: GraphCanvasProps) {
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]))

  const renderEdge = (edge: any, i: number, state: EdgeState) => {
    const u = nodeById.get(edge.from)!
    const v = nodeById.get(edge.to)!
    const color = EDGE_STROKE[state]
    const sw = EDGE_WIDTH[state]
    const isAnimated = state === 'active' || state === 'relaxed'
    const isAccented = state === 'inMST' || state === 'inTree' || state === 'shortest' || state === 'relaxed'

    const mx = (u.x + v.x) / 2
    const my = (u.y + v.y) / 2

    return (
      <g key={i}>
        <line
          x1={u.x} y1={u.y} x2={v.x} y2={v.y}
          stroke={color}
          strokeWidth={sw}
          className={isAnimated ? 'edge-active' : ''}
          filter={isAccented ? 'url(#glow)' : undefined}
          style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
        />
        {showWeights && edge.weight !== undefined && (
          <g>
            <rect
              x={mx - 10} y={my - 9}
              width={20} height={16}
              rx={3}
              fill="var(--color-surface)"
              stroke={color}
              strokeWidth={0.5}
            />
            <text
              x={mx} y={my + 3}
              textAnchor="middle"
              fontSize={9}
              fontFamily="var(--font-mono)"
              fill={color}
              style={{ userSelect: 'none' }}
            >
              {edge.weight}
            </text>
          </g>
        )}
      </g>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full rounded-lg border border-border bg-surface"
      style={{ maxHeight: '340px' }}
    >
      <defs>
        {/* Glow filter for active/relaxed edges */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Animated dash for active edges */}
        <style>{`
          @keyframes dash-move {
            to { stroke-dashoffset: -20; }
          }
          .edge-active {
            stroke-dasharray: 8 4;
            animation: dash-move 0.5s linear infinite;
          }
          @keyframes pulse-node {
            0%, 100% { r: ${R}px; }
            50% { r: ${R + 3}px; }
          }
          .node-processing circle {
            animation: pulse-node 0.8s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* ── Edges ── */}
      {graph.edges.map((edge, i) => {
        const state = edgeStates[i] ?? 'idle'
        if (state !== 'idle' && state !== 'rejected') return null
        return renderEdge(edge, i, state)
      })}
      
      {graph.edges.map((edge, i) => {
        const state = edgeStates[i] ?? 'idle'
        if (state === 'idle' || state === 'rejected') return null
        return renderEdge(edge, i, state)
      })}

      {/* ── Nodes ── */}
      {graph.nodes.map((node) => {
        const state: NodeState = nodeStates[node.id] ?? 'unvisited'
        const fill = NODE_FILL[state]
        const stroke = NODE_STROKE[state]
        const textCol = NODE_TEXT[state]
        const isProcessing = state === 'processing' || state === 'source'

        return (
          <g
            key={node.id}
            className={isProcessing ? 'node-processing' : ''}
            style={{ transition: 'all 0.3s' }}
          >
            <circle
              cx={node.x} cy={node.y} r={R}
              fill={fill}
              stroke={stroke}
              strokeWidth={isProcessing ? 3 : 2}
              filter={isProcessing ? 'url(#glow)' : undefined}
              style={{ transition: 'fill 0.3s, stroke 0.3s' }}
            />
            <text
              x={node.x} y={node.y + 4}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fontFamily="var(--font-mono)"
              fill={textCol}
              style={{ userSelect: 'none', transition: 'fill 0.3s' }}
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────
const LEGEND_BASE: { state: NodeState; label: string }[] = [
  { state: 'unvisited', label: 'Unvisited' },
  { state: 'discovered', label: 'Discovered' },
  { state: 'processing', label: 'Processing' },
  { state: 'visited', label: 'Visited' },
]

export function GraphLegend({
  showMST = false,
  showPath = false,
}: {
  showMST?: boolean
  showPath?: boolean
}) {
  const extraLabel = showPath ? 'Shortest Path' : 'In MST / Path'
  const items: { state: NodeState; label: string }[] = [
    ...LEGEND_BASE,
    ...(showMST || showPath ? [{ state: 'inMST' as NodeState, label: extraLabel }] : []),
  ]
  return (
    <div className="flex flex-wrap gap-3">
      {items.map(({ state, label }) => (
        <div key={state} className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-full border"
            style={{ background: NODE_FILL[state], borderColor: NODE_STROKE[state] }}
          />
          <span className="font-mono-tight text-xs text-text-faint">{label}</span>
        </div>
      ))}
    </div>
  )
}
