import type { AlgorithmContent } from '@/types/algorithm'

export const insertionSortContent: AlgorithmContent = {
  theory: `Insertion Sort is a simple sorting algorithm that builds the final sorted array (or list) one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort. However, insertion sort provides several advantages: simple implementation, efficient for (quite) small data sets, adaptive (efficient for data sets that are already substantially sorted), stable, in-place, and online (can sort a list as it receives it).`,
  pseudocode: `procedure insertionSort( A : list of sortable items )
    n = length(A)
    for i = 1 to n-1 do
        key = A[i]
        j = i - 1
        
        /* Move elements of A[0..i-1], that are greater than key, 
           to one position ahead of their current position */
        while j >= 0 and A[j] > key do
            A[j + 1] = A[j]
            j = j - 1
        end while
        
        A[j + 1] = key
    end for
end procedure`,
  code: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int arr[] = {12, 11, 13, 5, 6};
    int n = sizeof(arr) / sizeof(arr[0]);
    insertionSort(arr, n);
    return 0;
}`,
  codeLines: {
    'start': 3,
    'select-key': 5,
    'compare': 8,
    'shift': 9,
    'no-swap': 8,
    'insert': 12,
    'done': 20
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
    { question: 'When is Insertion Sort the most efficient?', answer: 'When the array is already mostly sorted (best case O(N)) or when the array size is very small.' },
    { question: 'Is Insertion Sort stable?', answer: 'Yes, it does not change the relative order of elements with equal keys.' },
    { question: 'What is an "online" algorithm?', answer: 'An algorithm that can process its input piece-by-piece in a serial fashion, i.e., in the order that the input is fed to the algorithm, without having the entire input available from the start. Insertion sort is an online algorithm.' },
    { question: 'How does it compare to Bubble Sort and Selection Sort?', answer: 'Insertion sort is generally faster than both on average and is adaptive, making it very efficient for nearly sorted data.' }
  ],
  applications: [
    'Sorting very small arrays',
    'As a building block for more complex algorithms (like Timsort)',
    'When the data is arriving in real-time (online sorting)'
  ]
}
