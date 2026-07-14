export function randomArray(length = 8, min = 1, max = 99): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

export function randomSortedArray(length = 8, min = 1, max = 99): number[] {
  return randomArray(length, min, max).sort((a, b) => a - b)
}

export function parseNumberList(input: string): number[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
}
