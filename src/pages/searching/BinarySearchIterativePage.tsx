import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { binarySearchIterativeContent } from '@/data/searching/binarySearchIterative.content'
import { generateBinarySearchIterativeSteps } from '@/algorithms/searching/binarySearchIterative'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { randomSortedArray } from '@/utils/random'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { ArraySearchView } from '@/components/visualizer/ArraySearchView'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { ArrayInputForm } from '@/components/visualizer/ArrayInputForm'

const algorithm = getAlgorithm('binary-search-iterative')!

export default function BinarySearchIterativePage() {
  const [array, setArray] = useState(() => randomSortedArray(8))
  const [target, setTarget] = useState(() => array[Math.floor(array.length / 2)])

  const steps = useMemo(
    () => generateBinarySearchIterativeSteps(array, target),
    [array, target],
  )
  const player = useStepPlayer(steps)

  const handleRandom = () => {
    const next = randomSortedArray(8)
    setArray(next)
    setTarget(next[Math.floor(Math.random() * next.length)])
    player.reset()
  }

  const dryRunLog = useMemo(
    () => generateBinarySearchIterativeSteps(array, target).map((s) => s.message),
    [array, target],
  )

  return (
    <AlgorithmPageShell
      algorithm={algorithm}
      content={binarySearchIterativeContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={binarySearchIterativeContent.codeLines[player.currentStep.phase]}
      pseudoHighlightLine={binarySearchIterativeContent.pseudoLines?.[player.currentStep.phase]}
      stepCaption={player.currentStep.message}
      visualizer={
        <div className="space-y-4">
          <ArrayInputForm
            arrayValue={array}
            targetValue={target}
            sortedHint
            onApply={(a, t) => {
              setArray(a)
              setTarget(t)
              player.reset()
            }}
          />
          <ArraySearchView step={player.currentStep} target={target} />
          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={handleRandom}
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
