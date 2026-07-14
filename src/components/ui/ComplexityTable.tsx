import type { ComplexityInfo } from '@/types/algorithm'

export function ComplexityTable({ complexity }: { complexity: ComplexityInfo }) {
  const rows: [string, string][] = [
    ['Best case', complexity.best],
    ['Average case', complexity.average],
    ['Worst case', complexity.worst],
    ['Space', complexity.space],
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label} className={i !== rows.length - 1 ? 'ledger-rule' : ''}>
              <td className="bg-surface px-4 py-2.5 text-text-muted">{label}</td>
              <td className="bg-surface px-4 py-2.5 text-right font-mono-tight font-medium text-amber">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(complexity.stable !== undefined ||
        complexity.inPlace !== undefined ||
        complexity.recursive !== undefined) && (
        <div className="flex flex-wrap gap-2 border-t border-border bg-surface px-4 py-3">
          {complexity.stable !== undefined && (
            <Tag label="Stable" positive={complexity.stable} />
          )}
          {complexity.inPlace !== undefined && (
            <Tag label="In-place" positive={complexity.inPlace} />
          )}
          {complexity.recursive !== undefined && (
            <Tag label="Recursive" positive={complexity.recursive} />
          )}
        </div>
      )}
    </div>
  )
}

function Tag({ label, positive }: { label: string; positive: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 font-mono-tight text-[11px] ${
        positive
          ? 'border-teal-dim bg-teal-dim/40 text-teal'
          : 'border-border text-text-faint'
      }`}
    >
      {label}: {positive ? 'yes' : 'no'}
    </span>
  )
}
