import { useMemo, useState } from 'react'
import { getAlgorithm } from '@/data/algorithms'
import { mcmContent } from '@/data/dp/mcm.content'
import { generateMCMSteps, mcmExamples } from '@/algorithms/dp/mcm'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { AlgorithmPageShell } from '@/components/layout/AlgorithmPageShell'
import { PlaybackControls } from '@/components/visualizer/PlaybackControls'
import { MCMTable } from '@/components/visualizer/MCMTable'
import { ExampleSelector } from '@/components/visualizer/ExampleSelector'
import { MCMInputForm } from '@/components/visualizer/MCMInputForm'

const algorithm = getAlgorithm('matrix-chain-multiplication')!

export default function MCMPage() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [customDims, setCustomDims] = useState<number[] | null>(null)

  // Active dims: prefer custom input over preset example
  const activeDims = customDims ?? mcmExamples[exampleIdx].dims

  const steps = useMemo(
    () => generateMCMSteps(activeDims),
    [activeDims]
  )
  const player = useStepPlayer(steps)

  const handleExampleChange = (i: number) => {
    setExampleIdx(i)
    setCustomDims(null)   // clear custom when switching to a preset
    player.reset()
  }

  const handleCustomDims = (dims: number[]) => {
    setCustomDims(dims)
    player.reset()
  }

  const dryRunLog = useMemo(() => steps.map((s) => s.message), [steps])

  return (
    <AlgorithmPageShell
      algorithm={algorithm}
      content={mcmContent}
      dryRunLog={dryRunLog}
      codeHighlightLine={mcmContent.codeLines[player.currentStep.phase]}
      visualizer={
        <div className="space-y-4">
          <MCMInputForm onApply={handleCustomDims} />

          <div className="flex items-center justify-between">
            <ExampleSelector
              examples={mcmExamples}
              selected={customDims ? -1 : exampleIdx}
              onSelect={handleExampleChange}
            />
            {customDims && (
              <span className="font-mono-tight text-xs text-amber">
                Custom: [{activeDims.join(', ')}]
              </span>
            )}
          </div>

          <MCMTable step={player.currentStep} />

          <PlaybackControls
            isPlaying={player.isPlaying}
            onPlay={player.play}
            onPause={player.pause}
            onNext={player.next}
            onPrev={player.prev}
            onReset={player.reset}
            onRandom={() => handleExampleChange(Math.floor(Math.random() * mcmExamples.length))}
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
