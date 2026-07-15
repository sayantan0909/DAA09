import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { dijkstraContent } from '@/data/graph/dijkstra.content'
import { generateDijkstraSteps, dijkstraExamples } from '@/algorithms/graph/dijkstra'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { GraphCanvas, GraphLegend } from '@/components/visualizer/GraphCanvas'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { DistanceTable } from '@/components/visualizer/DistanceTable'
import { ExampleSelector } from '@/components/visualizer/ExampleSelector'
import { GraphInput } from '@/components/visualizer/GraphInput'
import type { StaticGraph } from '@/types/graphStep'

const algorithm = getAlgorithm('dijkstra')!

export default function DijkstraPage() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [useCustom, setUseCustom] = useState(false)
  const [customGraph, setCustomGraph] = useState<StaticGraph | null>(null)
  const [isDirected, setIsDirected] = useState(false)
  const [customSource, setCustomSource] = useState(0)
  
  const currentGraph = useCustom && customGraph ? customGraph : dijkstraExamples[exampleIdx].graph
  const source = useCustom && customGraph ? customSource : dijkstraExamples[exampleIdx].source

  const steps = useMemo(
    () => generateDijkstraSteps(currentGraph, source, useCustom ? isDirected : false),
    [currentGraph, source, useCustom, isDirected]
  )
  const player = useStepPlayer(steps)

  const handleExampleChange = (i: number) => {
    setUseCustom(false)
    setExampleIdx(i)
    player.reset()
  }

  const handleCustomGraph = (graph: StaticGraph, directed: boolean, source: number) => {
    setCustomGraph(graph)
    setIsDirected(directed)
    setCustomSource(source)
    setUseCustom(true)
    player.reset()
  }

  const dryRunLog = useMemo(() => steps.map((s) => s.message), [steps])
  const step = player.currentStep

  return (
    <AlgorithmPageShell
      algorithm={algorithm}
      content={dijkstraContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={dijkstraContent.codeLines[step.phase]}
      pseudoHighlightLine={dijkstraContent.pseudoLines?.[step.phase]}
      stepCaption={step.message}
      visualizer={
        <div className="space-y-4">
          <GraphInput
            onGraphChange={handleCustomGraph}
            requireWeights
            allowDirected
            warnNegativeWeights
            allowSource
          />

          <div className="flex items-center justify-between">
            <ExampleSelector
              examples={dijkstraExamples}
              selected={useCustom ? -1 : exampleIdx}
              onSelect={handleExampleChange}
            />
            <GraphLegend showPath />
          </div>

          <GraphCanvas
            graph={currentGraph}
            nodeStates={step.nodeStates}
            edgeStates={step.edgeStates}
            showWeights
          />

          <DistanceTable
            rows={step.distTable ?? []}
            currentVertex={step.currentVertex}
            relaxingVertex={step.relaxingVertex}
            relaxationCheck={step.relaxationCheck}
          />

          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={() => handleExampleChange(Math.floor(Math.random() * dijkstraExamples.length))}
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
