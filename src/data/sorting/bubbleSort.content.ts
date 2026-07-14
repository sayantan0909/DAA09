import type { AlgorithmContent } from '@/types/algorithm'

export const bubbleSortContent: AlgorithmContent = {
  theory: `Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm, which is a comparison sort, is named for the way smaller or larger elements "bubble" to the top of the list.`,
  pseudocode: `procedure bubbleSort( A : list of sortable items )
    n = length(A)
    repeat 
        swapped = false
        for i = 1 to n-1 inclusive do
            /* if this pair is out of order */
            if A[i-1] > A[i] then
                /* swap them and remember something changed */
                swap( A[i-1], A[i] )
                swapped = true
            end if
        end for
        /* optimization: reduce n */
        n = n - 1
    until not swapped
end procedure`,
  code: `#include <stdio.h>
#include <stdbool.h>

void swap(int *xp, int *yp) {
    int temp = *xp;
    *xp = *yp;
    *yp = temp;
}

void bubbleSort(int arr[], int n) {
    int i, j;
    bool swapped;
    for (i = 0; i < n - 1; i++) {
        swapped = false;
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
                swapped = true;
            }
        }
        if (swapped == false)
            break;
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    bubbleSort(arr, n);
    return 0;
}`,
  codeLines: {
    'start': 10,
    'pass-start': 13,
    'compare': 16,
    'swap': 17,
    'pass-done': 21,
    'done': 30
  },
  complexity: {
    best: 'O(N)',
    average: 'O(N^2)',
    worst: 'O(N^2)',
    space: 'O(1)',
    stable: true,
    inPlace: true
  },
  viva: [
    { question: 'What is the best case time complexity of Bubble Sort?', answer: 'O(N), when the array is already sorted.' },
    { question: 'Why is Bubble Sort called "Bubble Sort"?', answer: 'Because the largest elements "bubble up" to their correct positions at the end of the array, like bubbles rising to the surface.' },
    { question: 'Is Bubble Sort stable?', answer: 'Yes, because it only swaps adjacent elements if they are strictly greater.' },
    { question: 'How can you optimize Bubble Sort?', answer: 'By keeping track of whether any swaps were made in a pass. If no swaps were made, the array is already sorted, and we can stop early.' }
  ],
  applications: [
    'Educational purposes (easy to understand and implement)',
    'Computer graphics (sometimes used in polygon filling algorithms)',
    'When the array is almost sorted (few inversions)'
  ]
}
