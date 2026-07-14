import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { AlgorithmCategory } from '@/types/algorithm'
import { getAlgorithmsByCategory } from '@/data/algorithms'

interface CategoryCardProps {
  category: AlgorithmCategory
  index: number
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const items = getAlgorithmsByCategory(category.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Link
        to={category.path}
        className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-raised"
      >
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-mono-tight text-[11px] uppercase tracking-wider text-text-faint">
            {items.length} {items.length === 1 ? 'experiment' : 'experiments'}
          </span>
        </div>

        <h3 className="mb-1.5 font-mono-tight text-lg font-semibold text-text">
          {category.label}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-text-muted">
          {category.description}
        </p>

        <ul className="mt-auto space-y-1 border-t border-border pt-3">
          {items.slice(0, 4).map((a) => (
            <li key={a.slug} className="flex items-center gap-2 text-xs text-text-muted">
              <span className="text-text-faint">{String(a.exptNo).padStart(2, '0')}</span>
              <span className="truncate">{a.name}</span>
            </li>
          ))}
          {items.length > 4 && (
            <li className="text-xs text-text-faint">+ {items.length - 4} more</li>
          )}
        </ul>

        <span className="mt-4 inline-flex items-center gap-1 font-mono-tight text-xs font-medium text-amber opacity-0 transition-opacity group-hover:opacity-100">
          Open section →
        </span>
      </Link>
    </motion.div>
  )
}
