import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { selectionSortContent } from '@/data/sorting/selectionSort.content'
import { generateSelectionSortSteps, selectionSortExamples } from '@/algorithms/sorting/selectionSort'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { ExampleSelector } from '@/components/visualizer/ExampleSelector'
import { SortArrayInput } from '@/components/visualizer/SortArrayInput'
import { SortingVisualizer } from '@/components/visualizer/SortingVisualizer'
import { SortStatsPanel } from '@/components/visualizer/SortStatsPanel'

const algorithm = getAlgorithm('selection-sort')!

export default function SelectionSortPage() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [customArray, setCustomArray] = useState<number[] | null>(null)

  const activeArray = customArray ?? selectionSortExamples[exampleIdx].array

  const steps = useMemo(
    () => generateSelectionSortSteps(activeArray),
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

  return (
    <AlgorithmPageShell
      algorithm={algorithm}
      content={selectionSortContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={selectionSortContent.codeLines[player.currentStep.phase]}
      visualizer={
        <div className="space-y-4">
          <SortArrayInput onApply={handleCustomArray} />

          <div className="flex items-center justify-between">
            <ExampleSelector
              examples={selectionSortExamples}
              selected={customArray ? -1 : exampleIdx}
              onSelect={handleExampleChange}
            />
            {customArray && (
              <span className="font-mono-tight text-xs text-amber">
                Custom Array
              </span>
            )}
          </div>

          <SortStatsPanel step={player.currentStep} totalElements={activeArray.length} />

          <div className="rounded-lg border border-border bg-surface p-4 pt-12">
            <SortingVisualizer step={player.currentStep} />
          </div>

          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={() => handleExampleChange(Math.floor(Math.random() * selectionSortExamples.length))}
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
