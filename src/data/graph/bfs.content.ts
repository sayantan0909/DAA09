import type { AlgorithmContent } from '@/types/algorithm'

const code = `#include <stdio.h>
#define MAX 100

int visited[MAX];
int queue[MAX];
int front = 0, rear = 0;
int adj[MAX][MAX];

void enqueue(int v) { queue[rear++] = v; }
int dequeue()       { return queue[front++]; }
int isEmpty()       { return front == rear; }

void BFS(int start, int n)
{
    enqueue(start);
    visited[start] = 1;

    printf("BFS Traversal: ");

    while (!isEmpty())
    {
        int v = dequeue();
        printf("%d ", v);

        for (int i = 0; i < n; i++)
        {
            if (adj[v][i] == 1 && !visited[i])
            {
                enqueue(i);
                visited[i] = 1;
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

    BFS(start, n);

    return 0;
}
`

export const bfsContent: AlgorithmContent = {
  theory: `Breadth-First Search (BFS) explores a graph level by level, starting from a source vertex. It uses a Queue to track which vertices to visit next.

The key idea: visit all vertices at distance 1 from the source, then all at distance 2, and so on. This guarantees the shortest path (in terms of edges) is found in an unweighted graph.

Algorithm Idea:
1. Enqueue the source vertex, mark it visited.
2. While the queue is not empty:
   a. Dequeue a vertex v.
   b. Process v (print/record it).
   c. Enqueue all unvisited neighbors of v, mark them visited.

The "visited" array prevents revisiting and infinite loops in graphs with cycles.`,

  pseudocode: `BFS(graph, source):
  create queue Q
  mark source as visited
  Q.enqueue(source)

  while Q is not empty:
      v = Q.dequeue()
      process(v)

      for each neighbor u of v:
          if u is not visited:
              mark u as visited
              Q.enqueue(u)`,

  code,

  codeLines: {
    start: 14,
    enqueue: 24,
    dequeue: 20,
    visit: 21,
    done: 29,
  },
  pseudoLines: {
    start: 1,
    enqueue: 13,
    dequeue: 7,
    visit: 8,
    done: 6,
  },

  complexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
    space: 'O(V)',
    recursive: false,
    inPlace: false,
  },

  applications: [
    'Finding the shortest path in an unweighted graph (e.g., social network friend suggestions).',
    'Web crawlers — explore pages level by level.',
    'GPS navigation — find nearest points of interest.',
    'Peer-to-peer networks — finding all nodes within a given number of hops.',
    'Solving puzzles like mazes or Rubik\'s cube (minimum moves).',
    'Cycle detection in undirected graphs.',
    'Connected components identification.',
  ],

  viva: [
    {
      question: 'Why does BFS use a Queue and not a Stack?',
      answer: 'A Queue enforces FIFO order — vertices are processed in the order they were discovered, which guarantees level-by-level (breadth-first) exploration. A Stack would give LIFO and produce DFS behavior.',
    },
    {
      question: 'What is the time complexity of BFS and why?',
      answer: 'O(V + E). Each vertex is enqueued and dequeued exactly once (O(V)), and each edge is examined exactly twice in an undirected graph (once from each endpoint) → O(E).',
    },
    {
      question: 'What is the space complexity?',
      answer: 'O(V) — in the worst case (star graph), the queue holds V-1 vertices simultaneously.',
    },
    {
      question: 'Does BFS find the shortest path?',
      answer: 'Yes — in an unweighted graph. Since BFS explores by increasing hop count, the first time a vertex is visited is via the shortest (fewest-edge) path. For weighted graphs, use Dijkstra\'s instead.',
    },
    {
      question: 'What happens if the graph is disconnected?',
      answer: 'BFS only visits vertices reachable from the source. To visit all vertices of a disconnected graph, you must call BFS separately for each unvisited vertex (one call per connected component).',
    },
    {
      question: 'How does BFS differ from DFS?',
      answer: 'BFS uses a Queue and explores breadth-first (neighbors before going deeper). DFS uses a Stack (or recursion) and explores depth-first (goes as deep as possible before backtracking). BFS guarantees shortest path in unweighted graphs; DFS does not.',
    },
    {
      question: 'Can BFS detect cycles?',
      answer: 'Yes. During BFS, if you encounter an already-visited neighbor that is not the parent of the current vertex, a cycle exists.',
    },
  ],
}
