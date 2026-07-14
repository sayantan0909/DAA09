import type { AlgorithmContent } from '@/types/algorithm'

export const selectionSortContent: AlgorithmContent = {
  theory: `Selection Sort is a simple in-place comparison sorting algorithm. It divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire input list. The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element (putting it in sorted order), and moving the sublist boundaries one element to the right.`,
  pseudocode: `procedure selectionSort( A : list of sortable items )
    n = length(A)
    for i = 0 to n-1 do
        /* find the minimum element in the unsorted a[i .. n-1] */
        min_idx = i
        for j = i+1 to n-1 do
            if A[j] < A[min_idx] then
                min_idx = j
            end if
        end for
        
        /* swap the found minimum element with the first element */
        if min_idx != i then
            swap(A[i], A[min_idx])
        end if
    end for
end procedure`,
  code: `#include <stdio.h>

void swap(int *xp, int *yp) {
    int temp = *xp;
    *xp = *yp;
    *yp = temp;
}

void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n - 1; i++) {
        min_idx = i;
        for (j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        if (min_idx != i) {
            swap(&arr[min_idx], &arr[i]);
        }
    }
}

int main() {
    int arr[] = {64, 25, 12, 22, 11};
    int n = sizeof(arr) / sizeof(arr[0]);
    selectionSort(arr, n);
    return 0;
}`,
  codeLines: {
    'start': 9,
    'pass-start': 11,
    'compare': 13,
    'select-min': 14,
    'swap': 17,
    'no-swap': 16,
    'done': 26
  },
  complexity: {
    best: 'O(N^2)',
    average: 'O(N^2)',
    worst: 'O(N^2)',
    space: 'O(1)',
    stable: false,
    inPlace: true
  },
  viva: [
    { question: 'What is the main advantage of Selection Sort?', answer: 'It never makes more than O(N) swaps, which can be useful when memory write is a costly operation.' },
    { question: 'Is Selection Sort stable?', answer: 'No, because swapping a minimum element might move an equal element past another equal element.' },
    { question: 'What is the best case time complexity?', answer: 'O(N^2). Even if the array is sorted, it still has to scan the remaining elements to find the minimum.' },
    { question: 'Does Selection Sort adapt to the data?', answer: 'No, it performs the same number of comparisons regardless of the initial order of the data.' }
  ],
  applications: [
    'Situations where auxiliary memory is strictly limited',
    'When write operations to memory are significantly more expensive than reads'
  ]
}
