import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import Home from '@/pages/Home'
import CategoryPage from '@/pages/CategoryPage'
import AlgorithmPlaceholder from '@/pages/AlgorithmPlaceholder'
import LinearSearchPage from '@/pages/searching/LinearSearchPage'
import ModifiedLinearSearchPage from '@/pages/searching/ModifiedLinearSearchPage'
import BinarySearchIterativePage from '@/pages/searching/BinarySearchIterativePage'
import BinarySearchRecursivePage from '@/pages/searching/BinarySearchRecursivePage'

// Sorting pages
import BubbleSortPage from '@/pages/sorting/BubbleSortPage'
import SelectionSortPage from '@/pages/sorting/SelectionSortPage'
import InsertionSortPage from '@/pages/sorting/InsertionSortPage'
import MergeSortPage from '@/pages/sorting/MergeSortPage'
import QuickSortPage from '@/pages/sorting/QuickSortPage'
import HeapSortPage from '@/pages/sorting/HeapSortPage'

// Divide & Conquer pages
import MinMaxPage from '@/pages/divide-conquer/MinMaxPage'

// Graph pages
import BFSPage from '@/pages/graph/BFSPage'
import DFSPage from '@/pages/graph/DFSPage'
import PrimPage from '@/pages/graph/PrimPage'
import KruskalPage from '@/pages/graph/KruskalPage'
import DijkstraPage from '@/pages/graph/DijkstraPage'

// DP pages
import MCMPage from '@/pages/dp/MCMPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/:categoryId" element={<CategoryPage />} />

        {/* Searching — Phase 2 */}
        <Route path="/searching/linear-search" element={<LinearSearchPage />} />
        <Route path="/searching/modified-linear-search" element={<ModifiedLinearSearchPage />} />
        <Route path="/searching/binary-search-iterative" element={<BinarySearchIterativePage />} />
        <Route path="/searching/binary-search-recursive" element={<BinarySearchRecursivePage />} />

        {/* Sorting — Phase 2 */}
        <Route path="/sorting/bubble-sort" element={<BubbleSortPage />} />
        <Route path="/sorting/selection-sort" element={<SelectionSortPage />} />
        <Route path="/sorting/insertion-sort" element={<InsertionSortPage />} />
        <Route path="/sorting/merge-sort" element={<MergeSortPage />} />
        <Route path="/sorting/quick-sort" element={<QuickSortPage />} />
        <Route path="/sorting/heap-sort" element={<HeapSortPage />} />

        {/* Divide & Conquer */}
        <Route path="/divide-conquer/min-max" element={<MinMaxPage />} />

        {/* Graph — Phase 3 */}
        <Route path="/graph/bfs" element={<BFSPage />} />
        <Route path="/graph/dfs" element={<DFSPage />} />
        <Route path="/graph/prim" element={<PrimPage />} />
        <Route path="/graph/kruskal" element={<KruskalPage />} />
        <Route path="/graph/dijkstra" element={<DijkstraPage />} />

        {/* DP — Phase 3 */}
        <Route path="/dp/matrix-chain-multiplication" element={<MCMPage />} />

        {/* Fallback placeholder for everything not yet built */}
        <Route path="/:categoryId/:slug" element={<AlgorithmPlaceholder />} />
      </Route>
    </Routes>
  )
}

export default App
