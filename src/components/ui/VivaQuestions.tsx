import { useState } from 'react'
import type { VivaQuestion } from '@/types/algorithm'

export function VivaQuestions({ questions }: { questions: VivaQuestion[] }) {
  const [order, setOrder] = useState(() => questions.map((_, i) => i))
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const shuffle = () => {
    const shuffled = [...order].sort(() => Math.random() - 0.5)
    setOrder(shuffled)
    setRevealed(new Set())
  }

  const toggle = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono-tight text-xs uppercase tracking-wider text-text-faint">
          Practice Viva
        </p>
        <button
          onClick={shuffle}
          className="rounded-md border border-border px-2.5 py-1 text-xs text-text-muted hover:border-border-strong hover:text-text"
        >
          🔀 Shuffle
        </button>
      </div>

      <ul className="space-y-2">
        {order.map((i) => {
          const q = questions[i]
          const isOpen = revealed.has(i)
          return (
            <li key={i} className="rounded-lg border border-border bg-surface">
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-text"
              >
                <span>{q.question}</span>
                <span className="text-text-faint">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <p className="ledger-rule border-t px-4 pb-3 pt-1 text-sm text-text-muted">
                  {q.answer}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
