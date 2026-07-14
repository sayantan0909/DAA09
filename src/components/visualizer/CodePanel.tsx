import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodePanelProps {
  code: string
  highlightLine?: number
}

export function CodePanel({ code, highlightLine }: CodePanelProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="ledger-rule flex items-center justify-between bg-surface px-4 py-2">
        <span className="font-mono-tight text-xs uppercase tracking-wider text-text-faint">
          C Implementation
        </span>
        {highlightLine && (
          <span className="font-mono-tight text-xs text-amber">
            line {highlightLine}
          </span>
        )}
      </div>
      <SyntaxHighlighter
        language="c"
        style={vscDarkPlus}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) => ({
          style: {
            display: 'block',
            backgroundColor:
              lineNumber === highlightLine ? 'rgba(240, 168, 104, 0.18)' : undefined,
            borderLeft:
              lineNumber === highlightLine ? '2px solid #F0A868' : '2px solid transparent',
            paddingLeft: '0.5rem',
          },
        })}
        customStyle={{
          margin: 0,
          fontSize: '0.8rem',
          padding: '1rem',
          background: '#12161C',
          maxHeight: '480px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
