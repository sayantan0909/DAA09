import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

export function useStepPlayer<T>(steps: T[]) {
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(700) // ms between steps, lower = faster
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const atEnd = index >= steps.length - 1

  useEffect(() => {
    if (!isPlaying) return
    if (atEnd) {
      setIsPlaying(false)
      return
    }
    timerRef.current = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 1))
    }, speed)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPlaying, index, speed, atEnd, steps.length])

  const play = useCallback(() => {
    if (atEnd) setIndex(0)
    setIsPlaying(true)
  }, [atEnd])

  const pause = useCallback(() => setIsPlaying(false), [])

  const next = useCallback(() => {
    setIsPlaying(false)
    setIndex((i) => Math.min(i + 1, steps.length - 1))
  }, [steps.length])

  const prev = useCallback(() => {
    setIsPlaying(false)
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setIndex(0)
  }, [])

  const currentStep = useMemo(() => steps[index] ?? steps[0], [steps, index])

  return {
    index,
    setIndex,
    currentStep,
    isPlaying,
    play,
    pause,
    next,
    prev,
    reset,
    speed,
    setSpeed,
    atStart: index === 0,
    atEnd,
    totalSteps: steps.length,
  }
}
