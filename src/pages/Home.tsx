import { motion } from 'framer-motion'
import { categories } from '@/data/categories'
import { algorithms } from '@/data/algorithms'
import { CategoryCard } from '@/components/ui/CategoryCard'

export default function Home() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-10 rounded-lg border border-border bg-surface px-6 py-8 lg:px-10 lg:py-12"
      >
        <p className="mb-3 font-mono-tight text-xs uppercase tracking-wider text-amber">
          Practical Record — DAA
        </p>
        <h1 className="mb-4 max-w-2xl font-mono-tight text-3xl font-semibold leading-tight text-text lg:text-4xl">
          An algorithm visualizer built for the exam table, not the classroom wall.
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-text-muted lg:text-base">
          {algorithms.length} experiments across searching, sorting, divide &amp;
          conquer, graphs, and dynamic programming — each with a step-by-step
          animation, the matching C code, a dry run, and viva questions to
          drill before you walk in.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <CategoryCard key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </div>
  )
}
