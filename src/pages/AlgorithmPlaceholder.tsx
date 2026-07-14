import { Link, useParams } from 'react-router-dom'
import { getAlgorithm } from '@/data/algorithms'
import { getCategory } from '@/data/categories'
import { ExptBadge } from '@/components/ui/ExptBadge'

export default function AlgorithmPlaceholder() {
  const { slug } = useParams<{ slug: string }>()
  const algorithm = getAlgorithm(slug ?? '')

  if (!algorithm) {
    return (
      <div className="rounded-lg border border-border bg-surface p-8 text-text-muted">
        Unknown algorithm.{' '}
        <Link to="/" className="text-amber hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

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

      <div className="mb-4 flex items-center gap-3">
        <ExptBadge exptNo={algorithm.exptNo} />
      </div>

      <h1 className="mb-3 font-mono-tight text-2xl font-semibold text-text">
        {algorithm.name}
      </h1>
      <p className="mb-8 max-w-xl text-sm text-text-muted">{algorithm.tagline}</p>

      <div className="rounded-lg border border-dashed border-border-strong bg-surface p-8 text-center">
        <p className="mb-2 font-mono-tight text-sm text-text-muted">
          Visualizer under construction
        </p>
        <p className="mx-auto max-w-md text-xs text-text-faint">
          This page will get its theory, animation, controls, C code, dry
          run, complexity notes and viva questions in a later build phase.
        </p>
      </div>
    </div>
  )
}
