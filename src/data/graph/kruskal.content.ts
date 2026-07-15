import type { AlgorithmContent } from '@/types/algorithm'

const code = `#include <stdio.h>
#include <stdlib.h>
#define MAX 100

struct Edge
{
    int src, dest, weight;
};

struct Subset
{
    int parent, rank;
};

int compare(const void *a, const void *b)
{
    struct Edge *edgeA = (struct Edge *)a;
    struct Edge *edgeB = (struct Edge *)b;
    return edgeA->weight - edgeB->weight;
}

int find(struct Subset subsets[], int i)
{
    if (subsets[i].parent != i)
        subsets[i].parent = find(subsets, subsets[i].parent);
    return subsets[i].parent;
}

void Union(struct Subset subsets[], int x, int y)
{
    int rx = find(subsets, x);
    int ry = find(subsets, y);

    if (subsets[rx].rank < subsets[ry].rank)
        subsets[rx].parent = ry;
    else if (subsets[rx].rank > subsets[ry].rank)
        subsets[ry].parent = rx;
    else
    {
        subsets[ry].parent = rx;
        subsets[rx].rank++;
    }
}

void KruskalMST(struct Edge edges[], int V, int E)
{
    struct Edge result[MAX];
    int e = 0, i = 0;

    qsort(edges, E, sizeof(struct Edge), compare);

    struct Subset subsets[MAX];
    for (int v = 0; v < V; v++)
    {
        subsets[v].parent = v;
        subsets[v].rank = 0;
    }

    while (e < V - 1 && i < E)
    {
        struct Edge nextEdge = edges[i++];
        int x = find(subsets, nextEdge.src);
        int y = find(subsets, nextEdge.dest);

        if (x != y)
        {
            result[e++] = nextEdge;
            Union(subsets, x, y);
        }
    }

    int minimumCost = 0;
    printf("\\nEdges in MST:\\n");
    for (i = 0; i < e; i++)
    {
        printf("%d -- %d == %d\\n",
               result[i].src, result[i].dest, result[i].weight);
        minimumCost += result[i].weight;
    }
    printf("\\nMinimum Cost = %d\\n", minimumCost);
}

int main()
{
    int V, E;
    printf("Enter number of vertices: ");
    scanf("%d", &V);

    printf("Enter number of edges: ");
    scanf("%d", &E);

    struct Edge edges[MAX];
    printf("\\nEnter Source Destination Weight\\n");
    for (int i = 0; i < E; i++)
    {
        printf("Edge %d: ", i + 1);
        scanf("%d %d %d", &edges[i].src, &edges[i].dest, &edges[i].weight);
    }

    KruskalMST(edges, V, E);
    return 0;
}
`

export const kruskalContent: AlgorithmContent = {
  theory: `Kruskal's Algorithm finds the Minimum Spanning Tree (MST) by processing edges in sorted order and using a Union-Find data structure to detect cycles.

The key idea: Sort all edges by weight. For each edge (from cheapest to most expensive), add it to the MST if it does not form a cycle.

Union-Find (Disjoint Set Union):
- find(v): Returns the representative (root) of v's component. Uses path compression to flatten trees.
- union(x, y): Merges the two components. Uses union-by-rank to keep trees shallow.

A cycle is detected when find(src) == find(dest) — both endpoints are already in the same component.

Kruskal's works best on sparse graphs where sorting E edges (O(E log E)) is efficient.`,

  pseudocode: `KRUSKAL-MST(graph):
  sort all edges by weight (ascending)
  initialize Union-Find: parent[v] = v for all v
  result = []
  
  for each edge (u, v, w) in sorted order:
      x = find(u)
      y = find(v)
      
      if x ≠ y:          // no cycle
          add (u, v, w) to result
          union(x, y)
      
      if |result| == V - 1:
          break
  
  return result`,

  code,

  codeLines: {
    start: 52,
    'pick-edge': 62,
    'accept-edge': 66,
    'reject-edge': 62,
    done: 74,
  },
  pseudoLines: {
    start: 1,
    'pick-edge': 6,
    'accept-edge': 10,
    'reject-edge': 6,
    done: 15,
  },

  complexity: {
    best: 'O(E log E)',
    average: 'O(E log E)',
    worst: 'O(E log V)',
    space: 'O(V + E)',
    recursive: false,
    inPlace: false,
  },

  applications: [
    'Network design (electrical grids, pipe networks, road systems).',
    'Cluster analysis — merging clusters with smallest inter-cluster distance.',
    'Image segmentation.',
    'Approximation of NP-hard problems like TSP.',
    'Computer network routing protocols.',
  ],

  viva: [
    {
      question: 'What is the Union-Find data structure?',
      answer: 'A data structure that tracks a partition of elements into disjoint sets. Supports two operations: find(x) — returns the representative of x\'s set; union(x, y) — merges the two sets containing x and y.',
    },
    {
      question: 'What is path compression in Union-Find?',
      answer: 'During find(), after finding the root, all nodes along the path are made to point directly to the root. This flattens the tree and makes future find() calls faster.',
    },
    {
      question: 'How does Kruskal\'s detect cycles?',
      answer: 'If find(u) == find(v), then u and v are already in the same connected component. Adding edge (u,v) would create a cycle, so it is rejected.',
    },
    {
      question: 'Why does Kruskal\'s sort edges first?',
      answer: 'Kruskal\'s greedy strategy requires processing edges from cheapest to most expensive. If a safe edge (not creating a cycle) is available, taking the cheapest one at each step leads to the globally optimal MST — proven by the cycle property of MST theory.',
    },
    {
      question: 'What is the difference between Prim\'s and Kruskal\'s?',
      answer: 'Prim\'s grows a single connected component from a vertex (better for dense graphs: O(V²) with adjacency matrix). Kruskal\'s processes edges globally and uses union-find (better for sparse graphs: O(E log E)). Both produce a valid MST.',
    },
    {
      question: 'What is union-by-rank?',
      answer: 'When merging two sets, the root with the lower rank (tree height estimate) is attached under the root with the higher rank. This prevents trees from becoming too tall, keeping find() efficient.',
    },
    {
      question: 'Is it possible for Kruskal\'s to have multiple valid MSTs?',
      answer: 'Yes — if some edges have equal weights, different selections can yield different MSTs, all with the same total cost. Each is a valid MST.',
    },
  ],
}
