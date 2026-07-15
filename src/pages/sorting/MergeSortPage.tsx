import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { mergeSortContent } from '@/data/sorting/mergeSort.content'
import { generateMergeSortSteps, mergeSortExamples } from '@/algorithms/sorting/mergeSort'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { ExampleSelector } from '@/components/visualizer/ExampleSelector'
import { SortArrayInput } from '@/components/visualizer/SortArrayInput'
import { SortingVisualizer } from '@/components/visualizer/SortingVisualizer'
import { SortStatsPanel } from '@/components/visualizer/SortStatsPanel'
import { MergeTreePanel } from '@/components/visualizer/MergeTreePanel'

const algorithm = getAlgorithm('merge-sort')!

export default function MergeSortPage() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [customArray, setCustomArray] = useState<number[] | null>(null)

  const activeArray = customArray ?? mergeSortExamples[exampleIdx].array

  const steps = useMemo(
    () => generateMergeSortSteps(activeArray),
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
      content={mergeSortContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={mergeSortContent.codeLines[player.currentStep.phase]}
      pseudoHighlightLine={mergeSortContent.pseudoLines?.[player.currentStep.phase]}
      stepCaption={player.currentStep.message}
      visualizer={
        <div className="space-y-4">
          <SortArrayInput onApply={handleCustomArray} />

          <div className="flex items-center justify-between">
            <ExampleSelector
              examples={mergeSortExamples}
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
          
          <MergeTreePanel step={player.currentStep} />

          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={() => handleExampleChange(Math.floor(Math.random() * mergeSortExamples.length))}
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
