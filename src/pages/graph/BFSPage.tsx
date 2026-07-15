import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { bfsContent } from '@/data/graph/bfs.content'
import { generateBFSSteps, bfsExamples } from '@/algorithms/graph/bfs'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { GraphCanvas, GraphLegend } from '@/components/visualizer/GraphCanvas'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { ExampleSelector } from '@/components/visualizer/ExampleSelector'
import { GraphInput } from '@/components/visualizer/GraphInput'
import { BFSQueuePanel } from '@/components/visualizer/BFSQueuePanel'
import type { StaticGraph } from '@/types/graphStep'

const algorithm = getAlgorithm('bfs')!

export default function BFSPage() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [useCustom, setUseCustom] = useState(false)
  const [customGraph, setCustomGraph] = useState<StaticGraph | null>(null)
  const [customSource, setCustomSource] = useState(0)
  
  const currentGraph = useCustom && customGraph ? customGraph : bfsExamples[exampleIdx].graph
  // Custom graph source comes from GraphInput; preset examples define their own source
  const source = useCustom && customGraph ? customSource : bfsExamples[exampleIdx].source

  const steps = useMemo(
    () => generateBFSSteps(currentGraph, source),
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

  return (
    <AlgorithmPageShell
      algorithm={algorithm}
      content={bfsContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={bfsContent.codeLines[player.currentStep.phase]}
      pseudoHighlightLine={bfsContent.pseudoLines?.[player.currentStep.phase]}
      stepCaption={player.currentStep.message}
      visualizer={
        <div className="space-y-4">
          <GraphInput onGraphChange={handleCustomGraph} allowSource />
          
          <div className="flex items-center justify-between">
            <ExampleSelector
              examples={bfsExamples}
              selected={useCustom ? -1 : exampleIdx}
              onSelect={handleExampleChange}
            />
            <GraphLegend />
          </div>

          <GraphCanvas
            graph={currentGraph}
            nodeStates={player.currentStep.nodeStates}
            edgeStates={player.currentStep.edgeStates}
          />

          <BFSQueuePanel step={player.currentStep} />

          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={() => handleExampleChange(Math.floor(Math.random() * bfsExamples.length))}
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
