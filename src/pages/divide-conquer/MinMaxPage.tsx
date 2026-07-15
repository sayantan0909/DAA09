import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { minMaxContent } from '@/data/divide-conquer/minMax.content'
import { generateMinMaxSteps, minMaxExamples } from '@/algorithms/divide-conquer/minMax'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { ExampleSelector } from '@/components/visualizer/ExampleSelector'
import { SortArrayInput } from '@/components/visualizer/SortArrayInput'
import { SortingVisualizer } from '@/components/visualizer/SortingVisualizer'
import { MinMaxStatsPanel } from '@/components/visualizer/MinMaxStatsPanel'
import { MinMaxTreePanel } from '@/components/visualizer/MinMaxTreePanel'

// Type coercion for SortingVisualizer which expects a SortStep
import type { SortStep } from '@/types/sortStep'

const algorithm = getAlgorithm('min-max')!

export default function MinMaxPage() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [customArray, setCustomArray] = useState<number[] | null>(null)

  const activeArray = customArray ?? minMaxExamples[exampleIdx].array

  const steps = useMemo(
    () => generateMinMaxSteps(activeArray),
    [activeArray]
  )
  const player = useStepPlayer(steps)

  const handleExampleChange = (i: number) => {
    setExampleIdx(i)
    setCustomArray(null)
    player.reset()
  }

  const handleCustomArray = (arr: number[]) => {
    setCustomArray(arr)
    player.reset()
  }

  const dryRunLog = useMemo(() => steps.map((s) => s.message), [steps])

  // Cast for visualizer compatibility
  const sortStepCompat = player.currentStep as unknown as SortStep

  return (
    <AlgorithmPageShell
      algorithm={algorithm}
      content={minMaxContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={minMaxContent.codeLines[player.currentStep.phase]}
      pseudoHighlightLine={minMaxContent.pseudoLines?.[player.currentStep.phase]}
      stepCaption={player.currentStep.message}
      visualizer={
        <div className="space-y-4">
          <SortArrayInput onApply={handleCustomArray} />

          <div className="flex items-center justify-between">
            <ExampleSelector
              examples={minMaxExamples}
              selected={customArray ? -1 : exampleIdx}
              onSelect={handleExampleChange}
            />
            {customArray && (
              <span className="font-mono-tight text-xs text-amber">
                Custom Array
              </span>
            )}
          </div>

          <MinMaxStatsPanel step={player.currentStep} totalElements={activeArray.length} />

          <div className="rounded-lg border border-border bg-surface p-4 pt-12">
            <SortingVisualizer step={sortStepCompat} />
          </div>
          
          <MinMaxTreePanel step={player.currentStep} />

          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={() => handleExampleChange(Math.floor(Math.random() * minMaxExamples.length))}
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
