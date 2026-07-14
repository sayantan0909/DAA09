import type { AlgorithmContent } from '@/types/algorithm'

export const heapSortContent: AlgorithmContent = {
  theory: `Heapsort is a comparison-based sorting algorithm. Heapsort can be thought of as an improved selection sort: like selection sort, heapsort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region. Unlike selection sort, heapsort does not waste time with a linear-time scan of the unsorted region; rather, heap sort maintains the unsorted region in a heap data structure to more quickly find the largest element in each step.`,
  pseudocode: `procedure heapSort( A : list of sortable items )
    n = length(A)
    
    /* Build max heap */
    for i = n / 2 - 1 down to 0 do
        heapify(A, n, i)
    end for
    
    /* One by one extract an element from heap */
    for i = n - 1 down to 1 do
        /* Move current root to end */
        swap(A[0], A[i])
        
        /* call max heapify on the reduced heap */
        heapify(A, i, 0)
    end for
end procedure

procedure heapify( A, n, i )
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    /* If left child is larger than root */
    if left < n and A[left] > A[largest] then
        largest = left
    end if
    
    /* If right child is larger than largest so far */
    if right < n and A[right] > A[largest] then
        largest = right
    end if
    
    /* If largest is not root */
    if largest != i then
        swap(A[i], A[largest])
        
        /* Recursively heapify the affected sub-tree */
        heapify(A, n, largest)
    end if
end procedure`,
  code: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;

    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    for (int i = n - 1; i > 0; i--) {
        swap(&arr[0], &arr[i]);
        heapify(arr, i, 0);
    }
}

int main() {
    int arr[] = {12, 11, 13, 5, 6, 7};
    int n = sizeof(arr) / sizeof(arr[0]);
    heapSort(arr, n);
    return 0;
}`,
  codeLines: {
    'start': 26,
    'heapify-start': 9,
    'heapify-compare': 14,
    'heapify-swap': 21,
    'heapify-done': 20,
    'heap-built': 30,
    'extract-max': 31,
    'done': 39
  },
  complexity: {
    best: 'O(N log N)',
    average: 'O(N log N)',
    worst: 'O(N log N)',
    space: 'O(1)',
    stable: false,
    inPlace: true
  },
  viva: [
    { question: 'Why is Heap Sort typically slower than Quick Sort?', answer: 'Although both are O(N log N), Heap Sort has poor cache locality because it constantly jumps around the array to access children (2*i + 1, 2*i + 2).' },
    { question: 'What is a Max-Heap?', answer: 'A complete binary tree where the value of a parent node is always strictly greater than or equal to the values of its children.' },
    { question: 'Why does Heap Sort start heapifying from n/2 - 1?', answer: 'Because all nodes from n/2 to n-1 are leaf nodes. A single node is already a valid heap, so we only need to heapify the non-leaf nodes in reverse order.' },
    { question: 'Is Heap Sort stable?', answer: 'No, because operations in the heap can change the relative order of equal keys.' }
  ],
  applications: [
    'Systems where worst-case performance must be bounded (e.g., Linux kernel)',
    'Priority Queues (heaps are the standard implementation of priority queues)',
    'When space is limited (in-place O(1) auxiliary space)'
  ]
}
