import type { AlgorithmContent } from '@/types/algorithm'

export const quickSortContent: AlgorithmContent = {
  theory: `Quicksort is an efficient, general-purpose sorting algorithm. Quicksort is a divide-and-conquer algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively. This can be done in-place, requiring small additional amounts of memory to perform the sorting.`,
  pseudocode: `procedure quickSort( A : list of sortable items, low : index, high : index )
    if low < high then
        /* pi is partitioning index, A[pi] is now at right place */
        pi = partition(A, low, high)
        
        quickSort(A, low, pi - 1)  // Before pi
        quickSort(A, pi + 1, high) // After pi
    end if
end procedure

function partition( A, low, high )
    pivot = A[high]
    i = (low - 1)  // Index of smaller element
    
    for j = low to high - 1 do
        /* If current element is smaller than the pivot */
        if A[j] < pivot then
            i = i + 1
            swap(A[i], A[j])
        end if
    end for
    
    swap(A[i + 1], A[high])
    return (i + 1)
end function`,
  code: `#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int arr[] = {10, 7, 8, 9, 1, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    quickSort(arr, 0, n - 1);
    return 0;
}`,
  codeLines: {
    'start': 24,
    'divide': 25,
    'pivot-select': 10,
    'partition-compare': 14,
    'partition-swap': 16,
    'partition-done': 19,
    'done': 35
  },
  complexity: {
    best: 'O(N log N)',
    average: 'O(N log N)',
    worst: 'O(N^2)',
    space: 'O(log N)',
    stable: false,
    inPlace: true,
    recursive: true
  },
  viva: [
    { question: 'Why is Quick Sort usually preferred over Merge Sort?', answer: 'Although both have O(N log N) average complexity, Quick Sort has smaller hidden constants and excellent cache locality. It also operates in-place, avoiding the O(N) memory overhead of Merge Sort.' },
    { question: 'When does the worst case occur in Quick Sort?', answer: 'When the array is already sorted (or reverse sorted) and the pivot chosen is always the largest or smallest element, leading to highly unbalanced partitions.' },
    { question: 'How can you avoid the worst case?', answer: 'By using Randomized Quick Sort (picking a random pivot) or the Median-of-Three method.' },
    { question: 'Is Quick Sort stable?', answer: 'No, the standard implementation is not stable because swapping elements across the pivot can disrupt the relative order of equal elements.' }
  ],
  applications: [
    'General purpose sorting (default in many languages like C\'s qsort)',
    'When space is a constraint (in-place algorithm)',
    'When average-case performance is more critical than worst-case'
  ]
}
