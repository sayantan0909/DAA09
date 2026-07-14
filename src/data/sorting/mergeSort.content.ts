import type { AlgorithmContent } from '@/types/algorithm'

export const mergeSortContent: AlgorithmContent = {
  theory: `Merge Sort is an efficient, general-purpose, and comparison-based sorting algorithm. Most implementations produce a stable sort, which means that the order of equal elements is the same in the input and output. Merge sort is a divide-and-conquer algorithm that was invented by John von Neumann in 1945. It works by dividing the unsorted list into n sublists, each containing one element (a list of one element is considered sorted), and then repeatedly merging sublists to produce new sorted sublists until there is only one sorted list remaining.`,
  pseudocode: `procedure mergeSort( A : list of sortable items, l : index, r : index )
    if l < r then
        mid = (l + r) / 2
        mergeSort(A, l, mid)
        mergeSort(A, mid + 1, r)
        merge(A, l, mid, r)
    end if
end procedure

procedure merge( A, l, mid, r )
    create leftArray from A[l..mid]
    create rightArray from A[mid+1..r]
    
    i = 0, j = 0, k = l
    while i < length(leftArray) and j < length(rightArray) do
        if leftArray[i] <= rightArray[j] then
            A[k] = leftArray[i]
            i = i + 1
        else
            A[k] = rightArray[j]
            j = j + 1
        end if
        k = k + 1
    end while
    
    while i < length(leftArray) do
        A[k] = leftArray[i]
        i = i + 1, k = k + 1
    end while
    
    while j < length(rightArray) do
        A[k] = rightArray[j]
        j = j + 1, k = k + 1
    end while
end procedure`,
  code: `#include <stdio.h>

void merge(int arr[], int l, int mid, int r) {
    int i, j, k;
    int n1 = mid - l + 1;
    int n2 = r - mid;

    int L[n1], R[n2];

    for (i = 0; i < n1; i++) L[i] = arr[l + i];
    for (j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    i = 0; j = 0; k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++; k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++; k++;
    }
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int mid = l + (r - l) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }
}

int main() {
    int arr[] = {38, 27, 43, 3, 9, 82, 10};
    int n = sizeof(arr) / sizeof(arr[0]);
    mergeSort(arr, 0, n - 1);
    return 0;
}`,
  codeLines: {
    'start': 38,
    'divide': 39,
    'merge-compare': 14,
    'merge-copy-left': 16,
    'merge-copy-right': 19,
    'merge-remainder': 26, // or 31 depending on which one
    'merge-done': 35,
    'done': 50
  },
  complexity: {
    best: 'O(N log N)',
    average: 'O(N log N)',
    worst: 'O(N log N)',
    space: 'O(N)',
    stable: true,
    inPlace: false,
    recursive: true
  },
  viva: [
    { question: 'What algorithmic paradigm does Merge Sort use?', answer: 'Divide and Conquer.' },
    { question: 'Is Merge Sort an in-place algorithm?', answer: 'No, it requires O(N) auxiliary space to merge the sub-arrays.' },
    { question: 'Why is Merge Sort preferred for Linked Lists?', answer: 'In linked lists, nodes can be merged without extra space (by just changing pointers), making it O(1) space complexity. It also doesn\'t require random access.' },
    { question: 'What is the recurrence relation for Merge Sort?', answer: 'T(n) = 2T(n/2) + O(n).' }
  ],
  applications: [
    'Sorting linked lists',
    'External sorting (sorting data too large to fit in memory)',
    'Inversion count problem'
  ]
}
