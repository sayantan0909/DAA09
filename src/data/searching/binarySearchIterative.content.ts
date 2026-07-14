import type { AlgorithmContent } from '@/types/algorithm'

const code = `#include <stdio.h>
#define MAX 100

int binarySearchIterative(int arr[], int n, int key)
{
    int low = 0, high = n - 1;

    while (low <= high)
    {
        int mid = (low + high) / 2;

        if (arr[mid] == key)
        {
            return mid;
        }
        else if (arr[mid] < key)
        {
            low = mid + 1;
        }
        else
        {
            high = mid - 1;
        }
    }
    return -1;
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

    result = binarySearchIterative(arr, n, key);

    if (result != -1)
        printf("Element found at index %d\\n", result);
    else
        printf("Element not found\\n");

    return 0;
}
`

export const binarySearchIterativeContent: AlgorithmContent = {
  theory: `Binary search exploits a sorted array by repeatedly comparing the target to the middle element and discarding the half of the array that cannot contain it.

Two pointers, low and high, bound the current search space. Each iteration computes mid = (low + high) / 2, and depending on the comparison, moves low up or high down — halving the space until the target is found or the space is empty.`,
  pseudocode: `BINARY-SEARCH-ITERATIVE(arr, n, key)
  low = 0, high = n - 1
  while low <= high
      mid = (low + high) / 2
      if arr[mid] == key
          return mid
      else if arr[mid] < key
          low = mid + 1
      else
          high = mid - 1
  return -1`,
  code,
  codeLines: {
    compare: 12,
    found: 14,
    recurse: 16,
    'not-found': 25,
  },
  complexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
    space: 'O(1)',
    stable: true,
    inPlace: true,
    recursive: false,
  },
  viva: [
    {
      question: 'Why does binary search require a sorted array?',
      answer:
        'The decision to discard the left or right half relies on comparing the middle element and trusting that everything to one side is uniformly smaller or larger — which only holds if the array is sorted.',
    },
    {
      question: 'Why is the worst case O(log n)?',
      answer:
        'Each comparison halves the remaining search space, so after k comparisons at most n / 2^k elements remain; the search ends once that shrinks to 1, giving k ≈ log2(n).',
    },
    {
      question: 'What happens if low and high are computed as (low + high) / 2 on very large arrays?',
      answer:
        'In languages with fixed-width integers, low + high can overflow; a safer formula is low + (high - low) / 2. In C this matters for very large arrays near INT_MAX.',
    },
    {
      question: 'Is iterative binary search preferred over recursive in practice?',
      answer:
        'Yes generally, since it avoids the function-call overhead and stack usage of recursion while solving the exact same problem.',
    },
  ],
  applications: [
    'Looking up entries in sorted arrays, dictionaries, or database indexes.',
    "Locating the insertion point for maintaining a sorted structure (as in C++'s lower_bound).",
    'Searching over a monotonic function\u2019s output in competitive programming ("binary search on the answer").',
  ],
}
