import type { AlgorithmContent } from '@/types/algorithm'

const code = `#include <stdio.h>
#define MAX 100

int visited[MAX];
int stack[MAX];
int top = -1;
int adj[MAX][MAX];

void push(int v) { stack[++top] = v; }
int pop()        { return stack[top--]; }
int isEmpty()    { return top == -1; }

void DFS(int start, int n)
{
    push(start);

    printf("DFS Traversal: ");

    while (!isEmpty())
    {
        int v = pop();

        if (!visited[v])
        {
            visited[v] = 1;
            printf("%d ", v);

            /* Push neighbors in reverse so smaller
               numbered vertex is processed first */
            for (int i = n - 1; i >= 0; i--)
            {
                if (adj[v][i] == 1 && !visited[i])
                {
                    push(i);
                }
            }
        }
    }
    printf("\\n");
}

int main()
{
    int n, e, u, v, start;

    printf("Enter number of vertices: ");
    scanf("%d", &n);

    printf("Enter number of edges: ");
    scanf("%d", &e);

    for (int i = 0; i < e; i++)
    {
        printf("Enter edge (u v): ");
        scanf("%d %d", &u, &v);
        adj[u][v] = adj[v][u] = 1;
    }

    printf("Enter start vertex: ");
    scanf("%d", &start);

    DFS(start, n);

    return 0;
}
`

export const dfsContent: AlgorithmContent = {
  theory: `Depth-First Search (DFS) explores a graph by going as deep as possible along each branch before backtracking. It uses a Stack (explicit or via recursion) to track the path.

The key idea: from the current vertex, go to an unvisited neighbor. If no unvisited neighbor exists, backtrack to the previous vertex and try another branch.

Algorithm Idea:
1. Push the source vertex onto the stack.
2. While the stack is not empty:
   a. Pop a vertex v.
   b. If v is not visited, mark it visited and process it.
   c. Push all unvisited neighbors of v onto the stack.

Backtracking happens naturally: when a vertex has no unvisited neighbors, the loop continues popping the stack.`,

  pseudocode: `DFS(graph, source):
  create stack S
  S.push(source)

  while S is not empty:
      v = S.pop()

      if v is not visited:
          mark v as visited
          process(v)

          for each neighbor u of v (in reverse order):
              if u is not visited:
                  S.push(u)`,

  code,

  codeLines: {
    start: 15,
    pop: 21,
    visit: 24,
    push: 29,
    backtrack: 20,
    done: 37,
  },
  pseudoLines: {
    start: 1,
    pop: 5,
    visit: 8,
    push: 13,
    backtrack: 4,
    done: 1,
  },

  complexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
    space: 'O(V)',
    recursive: true,
    inPlace: false,
  },

  applications: [
    'Topological sorting of a Directed Acyclic Graph (DAG).',
    'Finding strongly connected components (Tarjan\'s / Kosaraju\'s algorithms).',
    'Solving mazes — explore one path fully before trying another.',
    'Detecting cycles in a directed graph.',
    'Path finding in game trees (chess, puzzles).',
    'Web crawlers exploring linked content depth-first.',
    'Generating spanning trees.',
  ],

  viva: [
    {
      question: 'Why does DFS use a Stack?',
      answer: 'DFS follows LIFO — the most recently discovered vertex is explored first, pushing deeper and deeper into one path before backtracking. A Stack naturally implements this LIFO behavior.',
    },
    {
      question: 'What is the time complexity of DFS?',
      answer: 'O(V + E). Every vertex is visited once and every edge is checked once from each endpoint.',
    },
    {
      question: 'What is the difference between BFS and DFS?',
      answer: 'BFS uses a Queue and explores level by level (shortest path in unweighted graphs). DFS uses a Stack and goes deep first (useful for cycle detection, topological sort, connected components).',
    },
    {
      question: 'What is backtracking in DFS?',
      answer: 'When DFS reaches a vertex with no unvisited neighbors, it backtracks to the most recently visited vertex that still has unexplored neighbors. In the stack-based version, this means popping vertices that are already visited.',
    },
    {
      question: 'Can DFS find the shortest path?',
      answer: 'No — DFS is not guaranteed to find the shortest path. It finds a path but may explore a very long route before finding the destination. Use BFS for shortest path in unweighted graphs.',
    },
    {
      question: 'What is the space complexity of DFS?',
      answer: 'O(V) — in the worst case (a linear chain), the stack holds all V vertices simultaneously.',
    },
    {
      question: 'How do you detect a cycle using DFS?',
      answer: 'In an undirected graph: if during DFS you visit a neighbor that is already visited and is not the parent of the current vertex, a cycle exists. In a directed graph, use three colors (WHITE/GRAY/BLACK) — a back edge (to a GRAY vertex) indicates a cycle.',
    },
  ],
}
