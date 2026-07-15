import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { kruskalContent } from '@/data/graph/kruskal.content'
import { generateKruskalSteps, kruskalExamples } from '@/algorithms/graph/kruskal'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { GraphCanvas, GraphLegend } from '@/components/visualizer/GraphCanvas'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { KruskalPanel } from '@/components/visualizer/KruskalPanel'
import { ExampleSelector } from '@/components/visualizer/ExampleSelector'
import { GraphInput } from '@/components/visualizer/GraphInput'
import type { StaticGraph } from '@/types/graphStep'

const algorithm = getAlgorithm('kruskal')!

export default function KruskalPage() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [useCustom, setUseCustom] = useState(false)
  const [customGraph, setCustomGraph] = useState<StaticGraph | null>(null)
  
  const currentGraph = useCustom && customGraph ? customGraph : kruskalExamples[exampleIdx].graph

  const steps = useMemo(
    () => generateKruskalSteps(currentGraph),
    [currentGraph]
  )
  const player = useStepPlayer(steps)

  const handleExampleChange = (i: number) => {
    setUseCustom(false)
    setExampleIdx(i)
    player.reset()
  }

  const handleCustomGraph = (graph: StaticGraph, _directed: boolean, _source: number) => {
    setCustomGraph(graph)
    setUseCustom(true)
    player.reset()
  }

  const dryRunLog = useMemo(() => steps.map((s) => s.message), [steps])
  const step = player.currentStep

  return (
    <AlgorithmPageShell
      algorithm={algorithm}
      content={kruskalContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={kruskalContent.codeLines[step.phase]}
      pseudoHighlightLine={kruskalContent.pseudoLines?.[step.phase]}
      stepCaption={step.message}
      visualizer={
        <div className="space-y-4">
          <GraphInput onGraphChange={handleCustomGraph} requireWeights warnDisconnected />

          <div className="flex items-center justify-between">
            <ExampleSelector
              examples={kruskalExamples}
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

          <KruskalPanel
            sortedEdges={step.sortedEdges ?? []}
            subsets={step.subsets ?? []}
            mstCost={step.mstCost ?? 0}
            mstEdges={step.mstEdges ?? []}
          />

          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={() => handleExampleChange(Math.floor(Math.random() * kruskalExamples.length))}
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
