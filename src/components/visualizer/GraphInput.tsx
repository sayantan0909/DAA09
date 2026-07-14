import { useState } from 'react'
import type { StaticGraph } from '@/types/graphStep'
import { applyGraphLayout } from '@/utils/graphLayout'

interface GraphInputProps {
  onGraphChange: (graph: StaticGraph, isDirected: boolean, source: number) => void
  requireWeights?: boolean
  allowDirected?: boolean
  warnNegativeWeights?: boolean
  warnDisconnected?: boolean
  /** When true, shows a Source Vertex dropdown populated from the parsed labels */
  allowSource?: boolean
}

export function GraphInput({
  onGraphChange,
  requireWeights = false,
  allowDirected = false,
  warnNegativeWeights = false,
  warnDisconnected = false,
  allowSource = false,
}: GraphInputProps) {
  const [text, setText] = useState('A B 4\nA C 2\nB D 3')
  const [isDirected, setIsDirected] = useState(false)
  const [sourceLabel, setSourceLabel] = useState<string>('')
  const [availableLabels, setAvailableLabels] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  /** Parse the raw text and extract sorted unique labels — drives the source dropdown */
  const parseLabelsFromText = (raw: string): string[] => {
    const lines = raw.trim().split('\n').map((l) => l.trim()).filter(Boolean)
    const labelSet = new Set<string>()
    for (const line of lines) {
      const parts = line.split(/\s+/)
      if (parts.length >= 2) {
        labelSet.add(parts[0])
        labelSet.add(parts[1])
      }
    }
    const labels = Array.from(labelSet)
    labels.sort((a, b) => {
      const numA = parseInt(a, 10)
      const numB = parseInt(b, 10)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      return a.localeCompare(b)
    })
    return labels
  }

  const handleTextChange = (val: string) => {
    setText(val)
    if (allowSource) {
      const labels = parseLabelsFromText(val)
      setAvailableLabels(labels)
      // Keep current selection if still valid, otherwise reset to first
      if (!labels.includes(sourceLabel)) setSourceLabel(labels[0] ?? '')
    }
  }

  const handleApply = () => {
    setError(null)
    setWarning(null)

    if (!text.trim()) {
      setError('Input cannot be empty.')
      return
    }

    const lines = text.trim().split('\n').map((l) => l.trim()).filter(Boolean)
    const labelSet = new Set<string>()
    const edgeList: { uLab: string; vLab: string; w: number | undefined }[] = []

    for (const line of lines) {
      const parts = line.split(/\s+/)
      if (parts.length < 2) {
        setError(`Invalid line format: "${line}". Need at least two vertices.`)
        return
      }

      const uLab = parts[0]
      const vLab = parts[1]
      labelSet.add(uLab)
      labelSet.add(vLab)

      if (uLab === vLab) {
        setError(`Self-loops are not supported: "${line}".`)
        return
      }

      let w: number | undefined = undefined
      if (parts.length >= 3) {
        w = parseInt(parts[2], 10)
        if (isNaN(w)) {
          setError(`Invalid weight in line: "${line}".`)
          return
        }
      } else if (requireWeights) {
        setError(`Missing weight in line: "${line}". This algorithm requires weights.`)
        return
      }

      edgeList.push({ uLab, vLab, w })
    }

    // Map labels to IDs (sorted numerically then alphabetically)
    const labels = Array.from(labelSet)
    labels.sort((a, b) => {
      const numA = parseInt(a, 10)
      const numB = parseInt(b, 10)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      return a.localeCompare(b)
    })

    const labelToId = new Map(labels.map((l, i) => [l, i]))

    // Check for duplicate edges
    const seenEdges = new Set<string>()
    const edges: { from: number; to: number; weight?: number }[] = []
    let hasNegativeWeight = false

    for (const { uLab, vLab, w } of edgeList) {
      const u = labelToId.get(uLab)!
      const v = labelToId.get(vLab)!

      const edgeKey1 = `${u}-${v}`
      const edgeKey2 = isDirected ? edgeKey1 : `${v}-${u}`

      if (seenEdges.has(edgeKey1) || (!isDirected && seenEdges.has(edgeKey2))) {
        setError(`Duplicate edge detected between ${uLab} and ${vLab}.`)
        return
      }

      seenEdges.add(edgeKey1)
      if (!isDirected) seenEdges.add(edgeKey2)

      edges.push({ from: u, to: v, weight: w })
      if (w !== undefined && w < 0) hasNegativeWeight = true
    }

    // Warnings
    const warnings: string[] = []
    if (warnNegativeWeights && hasNegativeWeight) {
      warnings.push('Negative weights detected. Dijkstra may produce incorrect results.')
    }
    if (warnDisconnected) {
      const adj = Array.from({ length: labels.length }, () => [] as number[])
      for (const e of edges) {
        adj[e.from].push(e.to)
        adj[e.to].push(e.from)
      }
      const visited = new Set([0])
      const q = [0]
      while (q.length > 0) {
        const u = q.shift()!
        for (const v of adj[u]) {
          if (!visited.has(v)) {
            visited.add(v)
            q.push(v)
          }
        }
      }
      if (visited.size < labels.length) {
        warnings.push('Graph is disconnected. MST algorithms will only process the component containing the source.')
      }
    }

    if (warnings.length > 0) setWarning(warnings.join(' '))

    const nodes = labels.map((l, i) => ({ id: i, label: l }))
    const layoutedNodes = applyGraphLayout(nodes, edges)

    // Resolve the source vertex from the selected label (or default to 0)
    const resolvedSource = allowSource && sourceLabel
      ? (labelToId.get(sourceLabel) ?? 0)
      : 0

    // Sync available labels so dropdown stays populated after apply
    if (allowSource) setAvailableLabels(labels)

    onGraphChange({ nodes: layoutedNodes, edges }, isDirected, resolvedSource)
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono-tight text-sm font-semibold uppercase tracking-wider text-text">
          Custom Graph Input
        </h3>
        {allowDirected && (
          <label className="flex items-center gap-2 font-mono-tight text-xs text-text-muted">
            <input
              type="checkbox"
              checked={isDirected}
              onChange={(e) => setIsDirected(e.target.checked)}
              className="accent-amber"
            />
            Directed Graph
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="h-32 w-full rounded border border-border bg-surface-raised p-2 font-mono text-sm text-text focus:border-amber focus:outline-none"
            placeholder={requireWeights ? 'A B 4\nB C 2' : 'A B\nB C'}
          />
          <div className="mt-1 text-xs text-text-faint">
            Format: <code>Vertex1 Vertex2 {requireWeights ? 'Weight' : '[Weight]'}</code> (one per line)
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-2">
            {error && (
              <div className="rounded border border-terracotta/30 bg-terracotta/10 p-2 text-xs text-terracotta">
                {error}
              </div>
            )}
            {warning && (
              <div className="rounded border border-amber/30 bg-amber/10 p-2 text-xs text-amber">
                {warning}
              </div>
            )}
            {!error && !warning && (
              <div className="text-xs text-text-muted">
                Enter your edge list to generate a custom graph. The layout will be calculated automatically.
              </div>
            )}

            {allowSource && availableLabels.length > 0 && (
              <div>
                <label className="mb-1 block font-mono-tight text-xs text-text-faint">
                  Source Vertex
                </label>
                <select
                  value={sourceLabel}
                  onChange={(e) => setSourceLabel(e.target.value)}
                  className="w-full rounded border border-border bg-surface-raised px-2 py-1.5 font-mono-tight text-sm text-text focus:border-amber focus:outline-none"
                >
                  {availableLabels.map((lbl) => (
                    <option key={lbl} value={lbl}>
                      {lbl}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleApply}
            className="mt-4 rounded bg-amber px-4 py-2 font-mono-tight text-sm font-bold text-bg hover:bg-amber-dim"
          >
            Generate Graph
          </button>
        </div>
      </div>
    </div>
  )
}
