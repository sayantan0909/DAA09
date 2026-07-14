import type { AlgorithmContent } from '@/types/algorithm'

const code = `#include <stdio.h>
#define MAX 100

int transpositionSearch(int arr[], int n, int key)
{
    for (int i = 0; i < n; i++)
    {
        if (arr[i] == key)
        {
            if (i > 0)
            {
                int temp = arr[i];
                arr[i] = arr[i - 1];
                arr[i - 1] = temp;
                return i - 1;
            }
            return i;
        }
    }
    return -1;
}

int main()
{
    int arr[MAX], n, key, result;

    printf("Enter number of elements: ");
    scanf("%d", &n);

    printf("Enter elements:\\n");
    for (int i = 0; i < n; i++)
    {
        scanf("%d", &arr[i]);
    }

    printf("Enter element to search: ");
    scanf("%d", &key);

    result = transpositionSearch(arr, n, key);

    if (result != -1)
        printf("Element found, now at index %d\\n", result);
    else
        printf("Element not found\\n");

    return 0;
}
`

export const modifiedLinearSearchContent: AlgorithmContent = {
  theory: `Modified linear search improves plain linear search for cases where a few elements are searched for repeatedly. It uses the transposition technique: whenever a match is found, that element is swapped one position closer to the front of the array.

Over many repeated searches, frequently-accessed elements migrate toward the start of the array, shortening the average number of comparisons for subsequent lookups — a simple form of self-organizing list.`,
  pseudocode: `TRANSPOSITION-SEARCH(arr, n, key)
  for i = 0 to n - 1
      if arr[i] == key
          if i > 0
              swap(arr[i], arr[i - 1])
              return i - 1
          return i
  return -1`,
  code,
  codeLines: {
    compare: 8,
    found: 8,
    shift: 14,
    'not-found': 20,
  },
  complexity: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
    stable: false,
    inPlace: true,
    recursive: false,
  },
  viva: [
    {
      question: 'What problem does transposition search solve that plain linear search does not?',
      answer:
        'It reduces the average search cost across repeated queries by moving frequently-found elements closer to the front, rather than leaving the array order untouched.',
    },
    {
      question: 'Why is this technique called "self-organizing"?',
      answer:
        'Because the array reorders itself over time based on access patterns, without an explicit separate sorting step.',
    },
    {
      question: 'Why is it marked as not stable?',
      answer:
        'Swapping elements to reposition them changes the relative order of equal keys, which violates the definition of stability used for sorting-style techniques.',
    },
    {
      question: 'What is the alternative to transposition in self-organizing lists?',
      answer:
        'Move-to-front, which relocates the found element all the way to index 0 instead of swapping it just one step forward.',
    },
  ],
  applications: [
    'Caches and symbol tables where a small subset of keys is looked up far more often than others.',
    'Compiler symbol tables during repeated lookups of commonly used identifiers.',
    'Any linear list structure where re-sorting is impractical but access locality can still be exploited.',
  ],
}
