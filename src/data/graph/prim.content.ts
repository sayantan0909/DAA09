import type { AlgorithmContent } from '@/types/algorithm'

const code = `#include <stdio.h>
#include <limits.h>
#define MAX 100
#define INF INT_MAX

int adj[MAX][MAX];
int inMST[MAX];
int key[MAX];
int parent[MAX];

int minKey(int n)
{
    int min = INF, minIndex = -1;

    for (int v = 0; v < n; v++)
    {
        if (!inMST[v] && key[v] < min)
        {
            min = key[v];
            minIndex = v;
        }
    }
    return minIndex;
}

void PrimMST(int n)
{
    for (int i = 0; i < n; i++)
    {
        key[i] = INF;
        inMST[i] = 0;
        parent[i] = -1;
    }

    key[0] = 0;

    for (int count = 0; count < n - 1; count++)
    {
        int u = minKey(n);
        inMST[u] = 1;

        for (int v = 0; v < n; v++)
        {
            if (adj[u][v] && !inMST[v] && adj[u][v] < key[v])
            {
                parent[v] = u;
                key[v] = adj[u][v];
            }
        }
    }

    int cost = 0;
    printf("\\nEdges in MST:\\n");
    for (int i = 1; i < n; i++)
    {
        printf("%d -- %d  weight: %d\\n", parent[i], i, adj[i][parent[i]]);
        cost += adj[i][parent[i]];
    }
    printf("Total MST cost: %d\\n", cost);
}

int main()
{
    int n, e, u, v, w;

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

    PrimMST(n);
    return 0;
}
`

export const primContent: AlgorithmContent = {
  theory: `Prim's Algorithm finds the Minimum Spanning Tree (MST) of a weighted, connected, undirected graph. It grows the MST one edge at a time using a greedy approach.

The key idea: Start with any vertex. Repeatedly add the cheapest edge that connects a vertex inside the MST to a vertex outside it, until all vertices are included.

This is similar to Dijkstra's algorithm but instead of minimizing total path length, we minimize the edge weight added each time.

A Priority Queue (Min Heap) is used in the efficient implementation to always pick the minimum-weight crossing edge in O(log V) time.

Why Greedy works: At each step, the cheapest crossing edge cannot be part of any cycle (since one endpoint is outside the MST), and the "cut property" of MST theory guarantees it must belong to some MST.`,

  pseudocode: `PRIM-MST(graph, source):
  for each vertex v:
      key[v] = ∞
      parent[v] = NIL
      inMST[v] = false
  
  key[source] = 0
  PQ = min-priority-queue of all vertices by key
  
  while PQ is not empty:
      u = EXTRACT-MIN(PQ)
      inMST[u] = true
      
      for each neighbor v of u:
          if v not in MST and weight(u,v) < key[v]:
              parent[v] = u
              key[v] = weight(u,v)
              UPDATE-KEY(PQ, v)`,

  code,

  codeLines: {
    start: 28,
    'pick-edge': 14,
    'accept-edge': 38,
    relax: 42,
    done: 51,
  },

  complexity: {
    best: 'O(E log V)',
    average: 'O(E log V)',
    worst: 'O(V²)',
    space: 'O(V)',
    recursive: false,
    inPlace: false,
  },

  applications: [
    'Network design — laying cable/fiber with minimum total length.',
    'Road construction — connecting cities with minimum road cost.',
    'Cluster analysis in data mining.',
    'Approximation algorithms for the Travelling Salesman Problem.',
    'Circuit design — minimizing wire length on a PCB.',
  ],

  viva: [
    {
      question: 'What is a Minimum Spanning Tree?',
      answer: 'A spanning tree of a graph is a subgraph that connects all V vertices with exactly V-1 edges and no cycles. An MST is the spanning tree with the minimum total edge weight.',
    },
    {
      question: 'How does Prim\'s algorithm work?',
      answer: 'It grows the MST greedily from a starting vertex. At each step, it picks the minimum-weight edge connecting a vertex inside the current MST to a vertex outside it, and adds that vertex to the MST.',
    },
    {
      question: 'What data structure makes Prim\'s efficient?',
      answer: 'A Min-Heap (Priority Queue). It allows extracting the minimum-key vertex in O(log V) time, reducing overall complexity to O(E log V).',
    },
    {
      question: 'What is the difference between Prim\'s and Kruskal\'s?',
      answer: 'Prim\'s starts from a vertex and grows the MST by adding one vertex at a time — it works well on dense graphs (using an adjacency matrix + linear scan: O(V²)). Kruskal\'s sorts all edges first and adds the cheapest safe edge — it works better on sparse graphs (O(E log E)).',
    },
    {
      question: 'Is Prim\'s greedy? Why does it produce the optimal MST?',
      answer: 'Yes. The correctness is proven by the "cut property": for any partition of vertices into two sets S and V−S, the minimum-weight edge crossing the cut must be part of some MST. Prim\'s always picks such an edge.',
    },
    {
      question: 'What is the time complexity of Prim\'s with adjacency matrix?',
      answer: 'O(V²) — V iterations of extracting the minimum (O(V) scan) and V iterations of relaxing neighbors (O(V) scan).',
    },
    {
      question: 'Does Prim\'s work on directed graphs?',
      answer: 'Prim\'s is designed for undirected graphs. For directed graphs, the equivalent is the Edmonds-Chu-Liu algorithm for minimum spanning arborescences.',
    },
  ],
}
