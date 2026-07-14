import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { AlgorithmMeta, AlgorithmContent } from '@/types/algorithm'
import { getCategory } from '@/data/categories'
import { ExptBadge } from '@/components/ui/ExptBadge'
import { ComplexityTable } from '@/components/ui/ComplexityTable'
import { VivaQuestions } from '@/components/ui/VivaQuestions'
import { CodePanel } from '@/components/visualizer/CodePanel'

type TabId =
  | 'theory'
  | 'visualization'
  | 'pseudocode'
  | 'code'
  | 'dry-run'
  | 'complexity'
  | 'applications'
  | 'viva'

const TABS: { id: TabId; label: string }[] = [
  { id: 'theory', label: 'Theory' },
  { id: 'visualization', label: 'Visualization' },
  { id: 'pseudocode', label: 'Pseudocode' },
  { id: 'code', label: 'C Code' },
  { id: 'dry-run', label: 'Dry Run' },
  { id: 'complexity', label: 'Complexity' },
  { id: 'applications', label: 'Applications' },
  { id: 'viva', label: 'Viva' },
]

interface AlgorithmPageShellProps {
  algorithm: AlgorithmMeta
  content: AlgorithmContent
  /** the interactive visualization + controls, rendered on the Visualization tab */
  visualizer: ReactNode
  /** transcript of every step's narration, rendered on the Dry Run tab */
  dryRunLog: string[]
  /** current highlighted code line, kept in sync with the visualizer's step */
  codeHighlightLine?: number
}

export function AlgorithmPageShell({
  algorithm,
  content,
  visualizer,
  dryRunLog,
  codeHighlightLine,
}: AlgorithmPageShellProps) {
  const [tab, setTab] = useState<TabId>('visualization')
  const category = getCategory(algorithm.category)

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-xs text-text-faint">
        <Link to="/" className="hover:text-text-muted">
          Home
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link to={category.path} className="hover:text-text-muted">
              {category.label}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-text-muted">{algorithm.name}</span>
      </div>

      <div className="mb-4">
        <ExptBadge exptNo={algorithm.exptNo} />
      </div>
      <h1 className="mb-2 font-mono-tight text-2xl font-semibold text-text">
        {algorithm.name}
      </h1>
      <p className="mb-6 max-w-xl text-sm text-text-muted">{algorithm.tagline}</p>

      <div className="mb-6 flex flex-wrap gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border-b-2 px-3 py-2 font-mono-tight text-xs uppercase tracking-wider transition-colors ${
              tab === t.id
                ? 'border-amber text-amber'
                : 'border-transparent text-text-faint hover:text-text-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'theory' && (
        <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-text-muted">
          {content.theory.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {tab === 'visualization' && <div>{visualizer}</div>}

      {tab === 'pseudocode' && (
        <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-5 font-mono-tight text-sm leading-relaxed text-text-muted">
          {content.pseudocode}
        </pre>
      )}

      {tab === 'code' && <CodePanel code={content.code} highlightLine={codeHighlightLine} />}

      {tab === 'dry-run' && (
        <ol className="space-y-2">
          {dryRunLog.map((line, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-text-muted"
            >
              <span className="font-mono-tight text-text-faint">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      )}

      {tab === 'complexity' && (
        <div className="max-w-md">
          <ComplexityTable complexity={content.complexity} />
        </div>
      )}

      {tab === 'applications' && (
        <ul className="max-w-xl space-y-2">
          {content.applications.map((app, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-text-muted"
            >
              <span className="mt-0.5 text-amber">›</span>
              <span>{app}</span>
            </li>
          ))}
        </ul>
      )}

      {tab === 'viva' && (
        <div className="max-w-xl">
          <VivaQuestions questions={content.viva} />
        </div>
      )}
    </div>
  )
}
