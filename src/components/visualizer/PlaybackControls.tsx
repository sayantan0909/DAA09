interface PlaybackControlsProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrev: () => void
  onReset: () => void
  onRandom: () => void
  atStart: boolean
  atEnd: boolean
  speed: number
  onSpeedChange: (ms: number) => void
  stepLabel: string
}

export function PlaybackControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onRandom,
  atStart,
  atEnd,
  speed,
  onSpeedChange,
  stepLabel,
}: PlaybackControlsProps) {
  const btn =
    'inline-flex items-center justify-center rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-text-muted transition-colors hover:border-border-strong hover:text-text disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <button onClick={onPrev} disabled={atStart} className={btn} aria-label="Previous step">
          ⏮
        </button>

        {isPlaying ? (
          <button onClick={onPause} className={btn} aria-label="Pause">
            ⏸ Pause
          </button>
        ) : (
          <button onClick={onPlay} className={btn} aria-label="Play">
            ▶ {atEnd ? 'Replay' : 'Play'}
          </button>
        )}

        <button onClick={onNext} disabled={atEnd} className={btn} aria-label="Next step">
          ⏭
        </button>

        <button onClick={onReset} className={btn} aria-label="Reset">
          🔄 Reset
        </button>

        <button onClick={onRandom} className={btn} aria-label="Random input">
          🎲 Random
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <label htmlFor="speed" className="whitespace-nowrap">
          Speed
        </label>
        <input
          id="speed"
          type="range"
          min={150}
          max={1500}
          step={50}
          value={1650 - speed}
          onChange={(e) => onSpeedChange(1650 - Number(e.target.value))}
          className="w-28 accent-amber"
        />
      </div>

      <span className="ml-auto font-mono-tight text-xs text-text-faint">{stepLabel}</span>
    </div>
  )
}
