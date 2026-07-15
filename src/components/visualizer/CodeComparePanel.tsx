import { useRef, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeComparePanelProps {
  pseudocode: string
  code: string
  pseudoHighlightLine?: number
  codeHighlightLine?: number
  caption?: string
}

/** Splits a string into lines and returns them 1-indexed */
function splitLines(src: string): string[] {
  return src.split('\n')
}

export function CodeComparePanel({
  pseudocode,
  code,
  pseudoHighlightLine,
  codeHighlightLine,
  caption,
}: CodeComparePanelProps) {
  const pseudoScrollRef = useRef<HTMLDivElement>(null)
  const codeScrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll the highlighted pseudocode line into view
  useEffect(() => {
    if (!pseudoHighlightLine || !pseudoScrollRef.current) return
    const lineEl = pseudoScrollRef.current.querySelector(`[data-line="${pseudoHighlightLine}"]`) as HTMLElement
    if (lineEl) {
      lineEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [pseudoHighlightLine])

  // Auto-scroll the highlighted C code line into view
  useEffect(() => {
    if (!codeHighlightLine || !codeScrollRef.current) return
    // react-syntax-highlighter renders line wrappers, find by counting
    const lines = codeScrollRef.current.querySelectorAll('.line-highlight-target')
    if (lines[0]) lines[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [codeHighlightLine])

  const pseudoLines = splitLines(pseudocode)

  return (
    <div className="flex flex-col gap-3">
      {/* Caption bar */}
      {(pseudoHighlightLine || codeHighlightLine) && (
        <div className="flex items-center gap-2 rounded-md border border-amber/30 bg-amber/5 px-3 py-2">
          <span className="font-mono-tight text-xs text-amber">
            {pseudoHighlightLine && `Pseudocode line ${pseudoHighlightLine}`}
            {pseudoHighlightLine && codeHighlightLine && (
              <span className="mx-1.5 text-amber/60">↔</span>
            )}
            {codeHighlightLine && `C code line ${codeHighlightLine}`}
          </span>
          {caption && (
            <span className="font-mono-tight text-xs text-text-muted">— {caption}</span>
          )}
        </div>
      )}

      {/* Dual columns */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Pseudocode panel */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-border">
          <div className="ledger-rule flex items-center justify-between bg-surface px-4 py-2">
            <span className="font-mono-tight text-xs uppercase tracking-wider text-text-faint">
              Pseudocode
            </span>
            {pseudoHighlightLine && (
              <span className="font-mono-tight text-xs text-amber">
                line {pseudoHighlightLine}
              </span>
            )}
          </div>
          <div
            ref={pseudoScrollRef}
            className="flex-1 overflow-y-auto"
            style={{ maxHeight: '420px', background: '#12161C' }}
          >
            <pre className="p-4 text-xs leading-relaxed" style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>
              {pseudoLines.map((line, idx) => {
                const lineNo = idx + 1
                const isHighlighted = lineNo === pseudoHighlightLine
                return (
                  <div
                    key={lineNo}
                    data-line={lineNo}
                    style={{
                      display: 'flex',
                      backgroundColor: isHighlighted ? 'rgba(240, 168, 104, 0.18)' : undefined,
                      borderLeft: isHighlighted ? '2px solid #F0A868' : '2px solid transparent',
                      paddingLeft: '0.5rem',
                      borderRadius: isHighlighted ? '0 2px 2px 0' : undefined,
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <span
                      style={{
                        minWidth: '1.8rem',
                        color: isHighlighted ? '#F0A868' : '#5B6472',
                        userSelect: 'none',
                        textAlign: 'right',
                        marginRight: '1rem',
                        flexShrink: 0,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {lineNo}
                    </span>
                    <span
                      style={{
                        color: isHighlighted ? '#F0A868' : '#8B95A3',
                        whiteSpace: 'pre',
                        fontWeight: isHighlighted ? 600 : 400,
                      }}
                    >
                      {line}
                    </span>
                  </div>
                )
              })}
            </pre>
          </div>
        </div>

        {/* C Code panel */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-border">
          <div className="ledger-rule flex items-center justify-between bg-surface px-4 py-2">
            <span className="font-mono-tight text-xs uppercase tracking-wider text-text-faint">
              C Implementation
            </span>
            {codeHighlightLine && (
              <span className="font-mono-tight text-xs text-amber">
                line {codeHighlightLine}
              </span>
            )}
          </div>
          <div ref={codeScrollRef} style={{ maxHeight: '420px', overflow: 'auto' }}>
            <SyntaxHighlighter
              language="c"
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber) => ({
                className: lineNumber === codeHighlightLine ? 'line-highlight-target' : '',
                style: {
                  display: 'block',
                  backgroundColor:
                    lineNumber === codeHighlightLine ? 'rgba(240, 168, 104, 0.18)' : undefined,
                  borderLeft:
                    lineNumber === codeHighlightLine
                      ? '2px solid #F0A868'
                      : '2px solid transparent',
                  paddingLeft: '0.5rem',
                  transition: 'background-color 0.2s',
                },
              })}
              customStyle={{
                margin: 0,
                fontSize: '0.75rem',
                padding: '1rem',
                background: '#12161C',
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Connector legend */}
      <div className="flex items-center gap-2 text-xs text-text-faint">
        <span className="inline-block h-2 w-2 rounded-full bg-amber" />
        <span>Amber highlight on both panels = same algorithm step</span>
      </div>
    </div>
  )
}
