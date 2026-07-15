import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { primContent } from '@/data/graph/prim.content'
import { generatePrimSteps, primExamples } from '@/algorithms/graph/prim'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { GraphCanvas, GraphLegend } from '@/components/visualizer/GraphCanvas'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { ExampleSelector } from '@/components/visualizer/ExampleSelector'
import { GraphInput } from '@/components/visualizer/GraphInput'
import { PrimCandidatePanel } from '@/components/visualizer/PrimCandidatePanel'
import type { StaticGraph } from '@/types/graphStep'

const algorithm = getAlgorithm('prim')!

export default function PrimPage() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [useCustom, setUseCustom] = useState(false)
  const [customGraph, setCustomGraph] = useState<StaticGraph | null>(null)
  const [customSource, setCustomSource] = useState(0)
  
  const currentGraph = useCustom && customGraph ? customGraph : primExamples[exampleIdx].graph
  const source = useCustom && customGraph ? customSource : primExamples[exampleIdx].source

  const steps = useMemo(
    () => generatePrimSteps(currentGraph, source),
    [currentGraph, source]
  )
  const player = useStepPlayer(steps)

  const handleExampleChange = (i: number) => {
    setUseCustom(false)
    setExampleIdx(i)
    player.reset()
  }

  const handleCustomGraph = (graph: StaticGraph, _directed: boolean, source: number) => {
    setCustomGraph(graph)
    setCustomSource(source)
    setUseCustom(true)
    player.reset()
  }

  const dryRunLog = useMemo(() => steps.map((s) => s.message), [steps])

  const step = player.currentStep
  const mstCost = step.mstCost ?? 0
  const mstEdges = step.mstEdges ?? []

  return (
    <AlgorithmPageShell
      algorithm={algorithm}
      content={primContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={primContent.codeLines[step.phase]}
      pseudoHighlightLine={primContent.pseudoLines?.[step.phase]}
      stepCaption={step.message}
      visualizer={
        <div className="space-y-4">
          <GraphInput onGraphChange={handleCustomGraph} requireWeights warnDisconnected allowSource />

          <div className="flex items-center justify-between">
            <ExampleSelector
              examples={primExamples}
              selected={useCustom ? -1 : exampleIdx}
              onSelect={handleExampleChange}
            />
            <GraphLegend showMST />
          </div>

          <GraphCanvas
            graph={currentGraph}
            nodeStates={step.nodeStates}
            edgeStates={step.edgeStates}
            showWeights
          />

          <PrimCandidatePanel step={step} />

          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-2 font-mono-tight text-xs uppercase tracking-wider text-text-faint">
              Minimum Spanning Tree (MST) Edges
            </div>
            <div className="flex flex-wrap gap-2">
              {mstEdges.length === 0 ? (
                <span className="font-mono-tight text-sm text-text-faint italic">No edges added yet</span>
              ) : (
                mstEdges.map((e, i) => (
                  <span
                    key={i}
                    className="rounded border border-teal/30 bg-teal/10 px-2 py-1 font-mono-tight text-sm text-teal"
                  >
                    {e.from}–{e.to} ({e.weight})
                  </span>
                ))
              )}
            </div>
          </div>

          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={() => handleExampleChange(Math.floor(Math.random() * primExamples.length))}
            atStart={player.atStart}
            atEnd={player.atEnd}
            speed={player.speed}
            onSpeedChange={player.setSpeed}
            stepLabel={`Step ${player.index + 1} / ${player.totalSteps}`}
          />
        </div>
      }
    />
  )
}
