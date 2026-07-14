interface ExampleSelectorProps {
  examples: { label: string }[]
  selected: number
  onSelect: (i: number) => void
  extraControls?: React.ReactNode
}

export function ExampleSelector({
  examples,
  selected,
  onSelect,
  extraControls,
}: ExampleSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {examples.map((ex, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`rounded-md border px-3 py-1.5 font-mono-tight text-xs transition-colors ${
            selected === i
              ? 'border-amber bg-amber/10 text-amber'
              : 'border-border text-text-faint hover:border-border-strong hover:text-text-muted'
          }`}
        >
          {ex.label}
        </button>
      ))}
      {extraControls}
    </div>
  )
}
