import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { heapSortContent } from '@/data/sorting/heapSort.content'
import { generateHeapSortSteps, heapSortExamples } from '@/algorithms/sorting/heapSort'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { ExampleSelector } from '@/components/visualizer/ExampleSelector'
import { SortArrayInput } from '@/components/visualizer/SortArrayInput'
import { SortingVisualizer } from '@/components/visualizer/SortingVisualizer'
import { SortStatsPanel } from '@/components/visualizer/SortStatsPanel'
import { HeapTreePanel } from '@/components/visualizer/HeapTreePanel'

const algorithm = getAlgorithm('heap-sort')!

export default function HeapSortPage() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [customArray, setCustomArray] = useState<number[] | null>(null)

  const activeArray = customArray ?? heapSortExamples[exampleIdx].array

  const steps = useMemo(
    () => generateHeapSortSteps(activeArray),
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
      content={heapSortContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={heapSortContent.codeLines[player.currentStep.phase]}
      pseudoHighlightLine={heapSortContent.pseudoLines?.[player.currentStep.phase]}
      stepCaption={player.currentStep.message}
      visualizer={
        <div className="space-y-4">
          <SortArrayInput onApply={handleCustomArray} />

          <div className="flex items-center justify-between">
            <ExampleSelector
              examples={heapSortExamples}
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-surface p-4 pt-12 flex flex-col justify-end">
              <SortingVisualizer step={player.currentStep} />
            </div>
            
            <HeapTreePanel step={player.currentStep} />
          </div>

          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={() => handleExampleChange(Math.floor(Math.random() * heapSortExamples.length))}
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
