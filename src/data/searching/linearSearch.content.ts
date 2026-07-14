import type { AlgorithmContent } from '@/types/algorithm'

const code = `#include <stdio.h>
#define MAX 100

int linearSearch(int arr[], int n, int key)
{
    for (int i = 0; i < n; i++)
    {
        if (arr[i] == key)
        {
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

    result = linearSearch(arr, n, key);

    if (result != -1)
        printf("Element found at index %d\\n", result);
    else
        printf("Element not found\\n");

    return 0;
}
`

export const linearSearchContent: AlgorithmContent = {
  theory: `Linear search checks every element of the array one by one, in order, comparing it against the target value until a match is found or the array is exhausted.

It makes no assumption about the order of the data, which is what makes it universally applicable but also the slowest of the standard search techniques on large inputs.`,
  pseudocode: `LINEAR-SEARCH(arr, n, key)
  for i = 0 to n - 1
      if arr[i] == key
          return i
  return -1`,
  code,
  codeLines: {
    compare: 8,
    found: 10,
    'not-found': 13,
  },
  complexity: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
    stable: true,
    inPlace: true,
    recursive: false,
  },
  viva: [
    {
      question: 'Why is the best case O(1) for linear search?',
      answer:
        'If the target happens to be the very first element compared, the search ends after a single comparison, independent of array size.',
    },
    {
      question: 'When would you prefer linear search over binary search?',
      answer:
        'When the array is unsorted and sorting it first would cost more than a single linear scan, or when the array is very small.',
    },
    {
      question: 'Does linear search require the array to be sorted?',
      answer: 'No — it works correctly on any arrangement of elements.',
    },
    {
      question: 'What is the space complexity, and why?',
      answer:
        'O(1), since the iterative version only needs a loop counter and no auxiliary data structure that grows with input size.',
    },
  ],
  applications: [
    'Searching small or unsorted collections where sorting overhead is not justified.',
    'Scanning linked lists, where random access needed for binary search is unavailable.',
    'A first pass in more complex algorithms that need to check every element regardless of order, such as computing a minimum or maximum.',
  ],
}
