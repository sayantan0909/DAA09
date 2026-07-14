interface ExptBadgeProps {
  exptNo: number
}

export function ExptBadge({ exptNo }: ExptBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 py-1 font-mono-tight text-xs text-text-muted">
      Expt No. {String(exptNo).padStart(2, '0')}
    </span>
  )
}
