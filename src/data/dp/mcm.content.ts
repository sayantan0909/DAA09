import type { AlgorithmContent } from '@/types/algorithm'

const code = `#include <stdio.h>
#include <limits.h>
#define MAX 20
#define INF INT_MAX

int dp[MAX][MAX];
int split[MAX][MAX];

void printOptimalParens(int i, int j)
{
    if (i == j)
    {
        printf("A%d", i);
        return;
    }
    printf("(");
    printOptimalParens(i, split[i][j]);
    printf(" x ");
    printOptimalParens(split[i][j] + 1, j);
    printf(")");
}

void MatrixChainOrder(int p[], int n)
{
    /* n = number of matrices, p has n+1 entries */

    for (int i = 1; i <= n; i++)
        dp[i][i] = 0;

    /* l = chain length */
    for (int l = 2; l <= n; l++)
    {
        for (int i = 1; i <= n - l + 1; i++)
        {
            int j = i + l - 1;
            dp[i][j] = INF;

            for (int k = i; k <= j - 1; k++)
            {
                int cost = dp[i][k] + dp[k + 1][j]
                         + p[i - 1] * p[k] * p[j];

                if (cost < dp[i][j])
                {
                    dp[i][j] = cost;
                    split[i][j] = k;
                }
            }
        }
    }

    printf("\\nMinimum number of multiplications: %d\\n", dp[1][n]);
    printf("Optimal Parenthesization: ");
    printOptimalParens(1, n);
    printf("\\n");
}

int main()
{
    int n;
    printf("Enter number of matrices: ");
    scanf("%d", &n);

    int p[MAX];
    printf("Enter %d dimensions (d0 d1 d2 ... d%d):\\n", n + 1, n);
    for (int i = 0; i <= n; i++)
        scanf("%d", &p[i]);

    MatrixChainOrder(p, n);
    return 0;
}
`

export const mcmContent: AlgorithmContent = {
  theory: `Matrix Chain Multiplication (MCM) finds the most efficient order to multiply a chain of matrices. The number of scalar multiplications depends on the parenthesization order.

Problem: Given matrices A₁, A₂, …, Aₙ with dimensions p₀×p₁, p₁×p₂, …, pₙ₋₁×pₙ, find the parenthesization that minimizes total scalar multiplications.

Key insight: Matrix multiplication is associative — (AB)C = A(BC) — so the order doesn't change the result, only the cost.

Cost of multiplying (i×j) × (j×k) = i × j × k scalar multiplications.

DP Recurrence:
- dp[i][j] = 0 if i == j (single matrix, no multiplication needed)
- dp[i][j] = min over all k (i ≤ k < j) of:
    dp[i][k] + dp[k+1][j] + p[i-1] × p[k] × p[j]

The split table records the optimal k for each (i,j) pair, enabling reconstruction of the optimal parenthesization.`,

  pseudocode: `MCM(p[], n):
  // p[0..n] are the dimensions
  for i = 1 to n:
      dp[i][i] = 0          // single matrix

  for l = 2 to n:            // l = chain length
      for i = 1 to n-l+1:
          j = i + l - 1
          dp[i][j] = ∞

          for k = i to j-1:  // try each split
              cost = dp[i][k] + dp[k+1][j]
                   + p[i-1] * p[k] * p[j]

              if cost < dp[i][j]:
                  dp[i][j] = cost
                  split[i][j] = k

  return dp[1][n]`,

  code,

  codeLines: {
    init: 27,
    fill: 35,
    done: 48,
  },

  complexity: {
    best: 'O(n³)',
    average: 'O(n³)',
    worst: 'O(n³)',
    space: 'O(n²)',
    recursive: false,
    inPlace: false,
  },

  applications: [
    'Compiler optimization — reordering matrix operations in linear algebra libraries.',
    'Scientific computing — efficient neural network computations.',
    'Computer graphics — transformation matrix chains (model-view-projection).',
    'Natural Language Processing — optimal parsing of sentences (CYK algorithm).',
    'Gene sequence alignment — biological sequence analysis.',
    'BLAS/LAPACK libraries — batch matrix multiply optimization.',
  ],

  viva: [
    {
      question: 'Why can\'t we just use a greedy approach for MCM?',
      answer: 'Greedy fails because locally optimal choices (e.g., always multiply the smallest matrices first) don\'t guarantee a globally optimal solution. The optimal split depends on the full chain, not just adjacent pairs.',
    },
    {
      question: 'What is the time complexity of MCM and why?',
      answer: 'O(n³): three nested loops — chain length l (n levels), start index i (n options each), and split k (up to n options each). There are O(n²) subproblems, each solved in O(n) time.',
    },
    {
      question: 'What is the space complexity?',
      answer: 'O(n²) — we store the dp[][] and split[][] tables, each of size n×n.',
    },
    {
      question: 'What is the purpose of the split table?',
      answer: 'split[i][j] stores the optimal split position k for the subproblem (i,j). After filling the dp table, we use split to reconstruct the optimal parenthesization via the printOptimalParens() function.',
    },
    {
      question: 'What are "overlapping subproblems" in MCM?',
      answer: 'Many subproblems (like computing dp[2][4]) are needed to solve multiple larger problems (dp[1][5], dp[2][5], etc.). Without memoization/tabulation, a recursive solution recomputes them exponentially many times. DP stores each result once.',
    },
    {
      question: 'How many ways can you parenthesize n matrices?',
      answer: 'The number of parenthesizations is the (n-1)th Catalan number: C(n-1) = C(2(n-1), n-1) / n. For n=4 matrices, that\'s C(3) = 5 ways. It grows exponentially — 4862 ways for n=10!',
    },
    {
      question: 'What is the difference between MCM and Fibonacci DP?',
      answer: 'Fibonacci has linear subproblem dependency (each value depends on two previous values). MCM has 2D tabulation — each cell dp[i][j] depends on other cells dp[i][k] and dp[k+1][j] for all k between i and j-1.',
    },
    {
      question: 'Why is MCM filled diagonally?',
      answer: 'dp[i][j] depends on dp[i][k] and dp[k+1][j] — subproblems of shorter chain length. By filling in order of increasing chain length l (l=2,3,...,n), all required sub-results are already computed.',
    },
  ],
}
