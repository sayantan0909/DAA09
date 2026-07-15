import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { modifiedLinearSearchContent } from '@/data/searching/modifiedLinearSearch.content'
import { generateModifiedLinearSearchSteps } from '@/algorithms/searching/modifiedLinearSearch'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { randomArray } from '@/utils/random'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { ArraySearchView } from '@/components/visualizer/ArraySearchView'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { ArrayInputForm } from '@/components/visualizer/ArrayInputForm'

const algorithm = getAlgorithm('modified-linear-search')!

export default function ModifiedLinearSearchPage() {
  const [array, setArray] = useState(() => randomArray(8))
  const [target, setTarget] = useState(() => array[Math.floor(array.length / 2)])

  const steps = useMemo(
    () => generateModifiedLinearSearchSteps(array, target),
    [array, target],
  )
  const player = useStepPlayer(steps)

  const handleRandom = () => {
    const next = randomArray(8)
    setArray(next)
    setTarget(next[Math.floor(Math.random() * next.length)])
    player.reset()
  }

  const dryRunLog = useMemo(
    () => generateModifiedLinearSearchSteps(array, target).map((s) => s.message),
    [array, target],
  )

  return (
    <AlgorithmPageShell
      algorithm={algorithm}
      content={modifiedLinearSearchContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={modifiedLinearSearchContent.codeLines[player.currentStep.phase]}
      pseudoHighlightLine={modifiedLinearSearchContent.pseudoLines?.[player.currentStep.phase]}
      stepCaption={player.currentStep.message}
      visualizer={
        <div className="space-y-4">
          <ArrayInputForm
            arrayValue={array}
            targetValue={target}
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
