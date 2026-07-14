import type { AlgorithmContent } from '@/types/algorithm'

const code = `#include <stdio.h>
#define MAX 100

int binarySearchRecursive(int arr[], int low, int high, int key)
{
    if (low > high)
    {
        return -1;
    }

    int mid = (low + high) / 2;

    if (arr[mid] == key)
    {
        return mid;
    }
    else if (arr[mid] < key)
    {
        return binarySearchRecursive(arr, mid + 1, high, key);
    }
    else
    {
        return binarySearchRecursive(arr, low, mid - 1, key);
    }
}

int main()
{
    int arr[MAX], n, key, result;

    printf("Enter number of elements: ");
    scanf("%d", &n);

    printf("Enter elements in sorted order:\\n");
    for (int i = 0; i < n; i++)
    {
        scanf("%d", &arr[i]);
    }

    printf("Enter element to search: ");
    scanf("%d", &key);

    result = binarySearchRecursive(arr, 0, n - 1, key);

    if (result != -1)
        printf("Element found at index %d\\n", result);
    else
        printf("Element not found\\n");

    return 0;
}
`

export const binarySearchRecursiveContent: AlgorithmContent = {
  theory: `The recursive form of binary search expresses the same halving idea as the iterative version, but as a function that calls itself on a shrinking sub-range [low, high] instead of looping.

Each call either hits a base case — the range is empty (not found) or the middle element matches (found) — or it recurses into exactly one half, discarding the other. The recursion depth is O(log n), matching the number of halvings.`,
  pseudocode: `BINARY-SEARCH-RECURSIVE(arr, low, high, key)
  if low > high
      return -1
  mid = (low + high) / 2
  if arr[mid] == key
      return mid
  else if arr[mid] < key
      return BINARY-SEARCH-RECURSIVE(arr, mid + 1, high, key)
  else
      return BINARY-SEARCH-RECURSIVE(arr, low, mid - 1, key)`,
  code,
  codeLines: {
    compare: 13,
    found: 15,
    recurse: 19,
    'not-found': 8,
  },
  complexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
    space: 'O(log n)',
    stable: true,
    inPlace: false,
    recursive: true,
  },
  viva: [
    {
      question: 'Why is the space complexity O(log n) here, unlike the iterative version?',
      answer:
        'Each recursive call adds a stack frame, and the recursion depth equals the number of halvings, roughly log2(n), so the call stack itself uses O(log n) space.',
    },
    {
      question: 'Is this recursion tail recursive, and does that matter in C?',
      answer:
        'Yes, both recursive calls are the last operation in their branch, making it tail recursion. Standard C compilers may or may not optimize this into a loop depending on optimization flags, so the stack usage is not guaranteed to be eliminated.',
    },
    {
      question: 'What are the base cases for this recursion?',
      answer:
        'low > high (target absent, return -1) and arr[mid] == key (target found, return mid).',
    },
    {
      question: 'Why does passing low and high as parameters work instead of using global state?',
      answer:
        'It keeps each recursive call self-contained and makes the function reentrant, avoiding the bugs that shared mutable state can introduce across recursive calls.',
    },
  ],
  applications: [
    'Any context where a recursive formulation reads more naturally as a direct translation of the halving idea, such as teaching or specification.',
    'Recursive descent parsers and divide-and-conquer routines that already work with sub-ranges the same way.',
    'Building blocks for recursive tree-search structures like binary search trees.',
  ],
}
