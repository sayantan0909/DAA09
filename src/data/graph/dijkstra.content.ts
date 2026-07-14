import type { AlgorithmContent } from '@/types/algorithm'

const code = `#include <stdio.h>
#include <limits.h>
#define MAX 100
#define INF INT_MAX

int adj[MAX][MAX];
int dist[MAX];
int visited[MAX];
int parent[MAX];

int minDistance(int n)
{
    int min = INF, minIndex = -1;

    for (int v = 0; v < n; v++)
    {
        if (!visited[v] && dist[v] <= min)
        {
            min = dist[v];
            minIndex = v;
        }
    }
    return minIndex;
}

void Dijkstra(int src, int n)
{
    for (int i = 0; i < n; i++)
    {
        dist[i] = INF;
        visited[i] = 0;
        parent[i] = -1;
    }

    dist[src] = 0;

    for (int count = 0; count < n - 1; count++)
    {
        int u = minDistance(n);

        if (u == -1) break;

        visited[u] = 1;

        for (int v = 0; v < n; v++)
        {
            if (!visited[v] && adj[u][v] &&
                dist[u] != INF &&
                dist[u] + adj[u][v] < dist[v])
            {
                dist[v] = dist[u] + adj[u][v];
                parent[v] = u;
            }
        }
    }

    printf("\\nVertex\\tDistance\\tPath\\n");
    for (int i = 0; i < n; i++)
    {
        printf("%d\\t%d\\t\\t", i, dist[i]);
        int path[MAX], len = 0, cur = i;
        while (cur != -1) { path[len++] = cur; cur = parent[cur]; }
        for (int j = len - 1; j >= 0; j--)
            printf("%d%s", path[j], j > 0 ? " -> " : "\\n");
    }
}

int main()
{
    int n, e, u, v, w, src;

    printf("Enter number of vertices: ");
    scanf("%d", &n);

    printf("Enter number of edges: ");
    scanf("%d", &e);

    for (int i = 0; i < e; i++)
    {
        printf("Enter edge (u v weight): ");
        scanf("%d %d %d", &u, &v, &w);
        adj[u][v] = adj[v][u] = w;
    }

    printf("Enter source vertex: ");
    scanf("%d", &src);

    Dijkstra(src, n);
    return 0;
}
`

export const dijkstraContent: AlgorithmContent = {
  theory: `Dijkstra's Algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights.

The key idea: Maintain a distance table (dist[v] = shortest known distance from source to v). Greedily finalize the vertex with the smallest tentative distance, then relax its neighbors.

Relaxation: For each neighbor v of u, check if dist[u] + weight(u,v) < dist[v]. If yes, update dist[v].

Why it works: Once a vertex is finalized (minimum dist confirmed), its distance cannot be improved. This is because all edge weights are non-negative, so any other path going through a later vertex would be at least as long.

Important: Dijkstra FAILS on graphs with negative edge weights. Use Bellman-Ford instead.`,

  pseudocode: `DIJKSTRA(graph, source):
  for each vertex v:
      dist[v] = ∞
      visited[v] = false
  
  dist[source] = 0
  
  repeat V-1 times:
      u = vertex with minimum dist[u] among unvisited
      mark u as visited
      
      for each neighbor v of u:
          if dist[u] + weight(u,v) < dist[v]:
              dist[v] = dist[u] + weight(u,v)
              parent[v] = u`,

  code,

  codeLines: {
    start: 28,
    finalize: 38,
    relax: 43,
    done: 54,
  },

  complexity: {
    best: 'O(V²)',
    average: 'O((V + E) log V)',
    worst: 'O(V²)',
    space: 'O(V)',
    recursive: false,
    inPlace: false,
  },

  applications: [
    'GPS navigation — finding shortest driving route.',
    'Network routing protocols (OSPF uses Dijkstra).',
    'Social networks — finding degrees of separation.',
    'Game AI — pathfinding (A* is an extension of Dijkstra).',
    'Telephone networks — call routing.',
    'Flight path optimization.',
  ],

  viva: [
    {
      question: 'What is the relaxation step in Dijkstra\'s?',
      answer: 'For each neighbor v of the current vertex u: if dist[u] + weight(u,v) < dist[v], update dist[v] = dist[u] + weight(u,v). "Relaxing" an edge means checking if going through u gives a shorter path to v.',
    },
    {
      question: 'Why does Dijkstra\'s fail with negative edge weights?',
      answer: 'Dijkstra\'s assumes that once a vertex is finalized, its shortest distance is known. With negative edges, a longer path could become shorter later — violating this assumption. Use Bellman-Ford for negative weights.',
    },
    {
      question: 'What is the time complexity with adjacency matrix?',
      answer: 'O(V²) — V iterations, each scanning V vertices to find minimum and V vertices to relax.',
    },
    {
      question: 'What is the time complexity with a priority queue?',
      answer: 'O((V + E) log V) — using a min-heap, extract-min takes O(log V) and decrease-key takes O(log V), giving total O((V + E) log V).',
    },
    {
      question: 'What is the difference between Dijkstra\'s and Prim\'s?',
      answer: 'Both use a greedy approach with similar structure. Prim\'s selects the edge with minimum weight (building MST). Dijkstra\'s selects the vertex with minimum cumulative distance from source (finding shortest path). The key field being minimized is different.',
    },
    {
      question: 'What does dist[v] = ∞ mean initially?',
      answer: 'It means "we have no known path to vertex v yet." As the algorithm progresses and relaxes edges, ∞ is replaced with actual shortest path lengths.',
    },
    {
      question: 'Can Dijkstra\'s handle disconnected graphs?',
      answer: 'Yes — vertices unreachable from the source simply remain at dist = ∞ after the algorithm completes.',
    },
  ],
}
