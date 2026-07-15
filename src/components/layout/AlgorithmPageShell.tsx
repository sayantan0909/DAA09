import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { AlgorithmMeta, AlgorithmContent } from '@/types/algorithm'
import { getCategory } from '@/data/categories'
import { ExptBadge } from '@/components/ui/ExptBadge'
import { ComplexityTable } from '@/components/ui/ComplexityTable'
import { VivaQuestions } from '@/components/ui/VivaQuestions'
import { CodePanel } from '@/components/visualizer/CodePanel'
import { CodeComparePanel } from '@/components/visualizer/CodeComparePanel'

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
  /** current highlighted C code line, kept in sync with the visualizer's step */
  codeHighlightLine?: number
  /** current highlighted pseudocode line, kept in sync with the visualizer's step */
  pseudoHighlightLine?: number
  /** optional human-readable annotation for the current step (shown in compare caption) */
  stepCaption?: string
}

export function AlgorithmPageShell({
  algorithm,
  content,
  visualizer,
  dryRunLog,
  codeHighlightLine,
  pseudoHighlightLine,
  stepCaption,
}: AlgorithmPageShellProps) {
  const [tab, setTab] = useState<TabId>('visualization')
  const [compareOpen, setCompareOpen] = useState(false)
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

      {tab === 'visualization' && (
        <div className="space-y-4">
          {/* Visualizer + optional compare panel toggle */}
          <div>{visualizer}</div>

          {/* Compare panel toggle button */}
          <div className="flex items-center gap-3 border-t border-border pt-4">
            <button
              onClick={() => setCompareOpen((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-mono-tight text-xs uppercase tracking-wider transition-all ${
                compareOpen
                  ? 'border-amber bg-amber/10 text-amber'
                  : 'border-border text-text-faint hover:border-border-strong hover:text-text-muted'
              }`}
              aria-expanded={compareOpen}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="2" y="3" width="9" height="18" rx="1" />
                <rect x="13" y="3" width="9" height="18" rx="1" />
              </svg>
              {compareOpen ? 'Hide Code Compare' : 'Show Code Compare'}
            </button>
            {compareOpen && (
              <span className="font-mono-tight text-xs text-text-faint">
                Pseudocode ↔ C Code synchronized with animation step
              </span>
            )}
          </div>

          {/* Split compare panel — inline below visualizer */}
          {compareOpen && (
            <div
              className="rounded-lg border border-border bg-surface p-4"
              style={{
                animation: 'slideDown 200ms ease',
              }}
            >
              <CodeComparePanel
                pseudocode={content.pseudocode}
                code={content.code}
                pseudoHighlightLine={pseudoHighlightLine}
                codeHighlightLine={codeHighlightLine}
                caption={stepCaption}
              />
            </div>
          )}
        </div>
      )}

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

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
