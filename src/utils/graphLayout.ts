export function applyGraphLayout(
  nodes: { id: number; label: string }[],
  edges: { from: number; to: number }[],
  width = 420,
  height = 340
) {
  const n = nodes.length
  if (n === 0) return []
  if (n === 1) {
    return [{ ...nodes[0], x: width / 2, y: height / 2 }]
  }
  
  if (n <= 8) {
    // Circular layout
    const cx = width / 2
    const cy = height / 2
    const r = Math.min(width, height) / 2 - 40
    return nodes.map((node, i) => {
      const angle = (i * 2 * Math.PI) / n - Math.PI / 2
      return {
        ...node,
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      }
    })
  }

  // Force directed layout (Fruchterman-Reingold)
  const pos = nodes.map((_, i) => {
    // start in a small circle
    const angle = (i * 2 * Math.PI) / n
    const r = 50
    return {
      x: width / 2 + r * Math.cos(angle),
      y: height / 2 + r * Math.sin(angle),
      vx: 0,
      vy: 0,
    }
  })

  const ITERATIONS = 120
  const K = Math.sqrt((width * height) / n)
  const REPULSION = K * K
  const ATTRACTION = K

  for (let iter = 0; iter < ITERATIONS; iter++) {
    // Temperature cools down
    const t = 1 - iter / ITERATIONS

    // Calculate repulsive forces
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue
        const dx = pos[i].x - pos[j].x
        const dy = pos[i].y - pos[j].y
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1
        const force = REPULSION / dist
        pos[i].vx += (dx / dist) * force
        pos[i].vy += (dy / dist) * force
      }
    }

    // Calculate attractive forces
    for (const e of edges) {
      const dx = pos[e.to].x - pos[e.from].x
      const dy = pos[e.to].y - pos[e.from].y
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.1
      const force = (dist * dist) / ATTRACTION
      pos[e.from].vx += (dx / dist) * force
      pos[e.from].vy += (dy / dist) * force
      pos[e.to].vx -= (dx / dist) * force
      pos[e.to].vy -= (dy / dist) * force
    }

    // Apply forces and constrain to bounds
    const maxDisplace = ((width + height) / 10) * t
    for (let i = 0; i < n; i++) {
      const v = Math.sqrt(pos[i].vx * pos[i].vx + pos[i].vy * pos[i].vy) || 0.1
      const dispX = (pos[i].vx / v) * Math.min(v, maxDisplace)
      const dispY = (pos[i].vy / v) * Math.min(v, maxDisplace)
      
      pos[i].x += dispX
      pos[i].y += dispY

      // Padding
      const pad = 30
      pos[i].x = Math.max(pad, Math.min(width - pad, pos[i].x))
      pos[i].y = Math.max(pad, Math.min(height - pad, pos[i].y))

      pos[i].vx = 0
      pos[i].vy = 0
    }
  }

  return nodes.map((node, i) => ({
    ...node,
    x: pos[i].x,
    y: pos[i].y,
  }))
}
