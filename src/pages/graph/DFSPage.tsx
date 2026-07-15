import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { dfsContent } from '@/data/graph/dfs.content'
import { generateDFSSteps, dfsExamples } from '@/algorithms/graph/dfs'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { GraphCanvas, GraphLegend } from '@/components/visualizer/GraphCanvas'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { ExampleSelector } from '@/components/visualizer/ExampleSelector'
import { GraphInput } from '@/components/visualizer/GraphInput'
import { DFSStackPanel } from '@/components/visualizer/DFSStackPanel'
import type { StaticGraph } from '@/types/graphStep'

const algorithm = getAlgorithm('dfs')!

export default function DFSPage() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [useCustom, setUseCustom] = useState(false)
  const [customGraph, setCustomGraph] = useState<StaticGraph | null>(null)
  const [customSource, setCustomSource] = useState(0)
  
  const currentGraph = useCustom && customGraph ? customGraph : dfsExamples[exampleIdx].graph
  const source = useCustom && customGraph ? customSource : dfsExamples[exampleIdx].source

  const steps = useMemo(
    () => generateDFSSteps(currentGraph, source),
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
      content={dfsContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={dfsContent.codeLines[player.currentStep.phase]}
      pseudoHighlightLine={dfsContent.pseudoLines?.[player.currentStep.phase]}
      stepCaption={player.currentStep.message}
      visualizer={
        <div className="space-y-4">
          <GraphInput onGraphChange={handleCustomGraph} allowSource />
          
          <div className="flex items-center justify-between">
            <ExampleSelector
              examples={dfsExamples}
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

          <DFSStackPanel step={player.currentStep} />

          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={() => handleExampleChange(Math.floor(Math.random() * dfsExamples.length))}
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
