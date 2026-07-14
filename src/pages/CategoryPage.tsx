import { Link, useParams } from 'react-router-dom'
import { getCategory } from '@/data/categories'
import { getAlgorithmsByCategory } from '@/data/algorithms'
import { ExptBadge } from '@/components/ui/ExptBadge'

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = getCategory(categoryId ?? '')

  if (!category) {
    return (
      <div className="rounded-lg border border-border bg-surface p-8 text-text-muted">
        Unknown category.{' '}
        <Link to="/" className="text-amber hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  const items = getAlgorithmsByCategory(category.id)

  return (
    <div>
      <div className="mb-8 ledger-rule pb-5">
        <p className="mb-1 font-mono-tight text-xs uppercase tracking-wider text-text-faint">
          Section
        </p>
        <h1 className="mb-2 font-mono-tight text-2xl font-semibold text-text">
          {category.label}
        </h1>
        <p className="max-w-xl text-sm text-text-muted">{category.description}</p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((a) => (
          <li key={a.slug}>
            <Link
              to={`${category.path}/${a.slug}`}
              className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-raised"
            >
              <div className="flex items-center justify-between">
                <ExptBadge exptNo={a.exptNo} />
                {!a.implemented && (
                  <span className="font-mono-tight text-[10px] uppercase tracking-wider text-text-faint">
                    coming soon
                  </span>
                )}
              </div>
              <h3 className="font-mono-tight text-base font-medium text-text">
                {a.name}
              </h3>
              <p className="text-sm text-text-muted">{a.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
