import type { AlgorithmContent } from '@/types/algorithm'

export const minMaxContent: AlgorithmContent = {
  theory: `The Min-Max algorithm uses a Divide and Conquer approach to find both the minimum and maximum elements in an array simultaneously. Instead of comparing each element sequentially to a running minimum and maximum (which requires 2N - 2 comparisons in the worst case), this approach divides the array into two halves, recursively finds the min and max in each half, and then combines the results. This reduces the number of comparisons to exactly 3N/2 - 2, which is optimal.`,
  pseudocode: `procedure getMinMax(A, l, r)
    if l == r then
        return (A[l], A[l])
    end if
    
    if l == r - 1 then
        if A[l] < A[r] then
            return (A[l], A[r])
        else
            return (A[r], A[l])
        end if
    end if
    
    mid = (l + r) / 2
    (minLeft, maxLeft) = getMinMax(A, l, mid)
    (minRight, maxRight) = getMinMax(A, mid + 1, r)
    
    return (
        min(minLeft, minRight),
        max(maxLeft, maxRight)
    )
end procedure`,
  code: `#include <stdio.h>

struct Pair {
    int min;
    int max;
};

struct Pair getMinMax(int arr[], int l, int r) {
    struct Pair minmax, left, right;
    int mid;

    // Base case 1: If there is only one element
    if (l == r) {
        minmax.max = arr[l];
        minmax.min = arr[l];
        return minmax;
    }

    // Base case 2: If there are two elements
    if (r == l + 1) {
        if (arr[l] > arr[r]) {
            minmax.max = arr[l];
            minmax.min = arr[r];
        } else {
            minmax.max = arr[r];
            minmax.min = arr[l];
        }
        return minmax;
    }

    // Divide: If there are more than 2 elements
    mid = (l + r) / 2;
    left = getMinMax(arr, l, mid);
    right = getMinMax(arr, mid + 1, r);

    // Combine: Compare minimums of two parts
    if (left.min < right.min)
        minmax.min = left.min;
    else
        minmax.min = right.min;

    // Combine: Compare maximums of two parts
    if (left.max > right.max)
        minmax.max = left.max;
    else
        minmax.max = right.max;

    return minmax;
}

int main() {
    int arr[] = {22, 13, -5, -8, 15, 60, 17, 31, 47};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    struct Pair minmax = getMinMax(arr, 0, n - 1);
    printf("Minimum element is %d\\n", minmax.min);
    printf("Maximum element is %d\\n", minmax.max);
    
    return 0;
}`,
  codeLines: {
    'start': 50,
    'divide': 33,
    'base-case-1': 13,
    'base-case-2': 20,
    'combine': 37,
    'done': 52
  },
  complexity: {
    best: 'O(N)',
    average: 'O(N)',
    worst: 'O(N)',
    space: 'O(log N)',
    stable: false,
    inPlace: true,
    recursive: true
  },
  viva: [
    { question: 'What is the recurrence relation for the Min-Max divide and conquer algorithm?', answer: 'T(n) = 2T(n/2) + 2 for n > 2. T(1) = 0 and T(2) = 1.' },
    { question: 'What is the exact number of comparisons made in the worst case?', answer: '3n/2 - 2 comparisons, which is better than the 2n - 2 comparisons required by the naive linear scan.' },
    { question: 'Is the divide and conquer approach for Min-Max strictly better than the naive approach?', answer: 'Theoretically yes in terms of comparisons. However, practically, the overhead of recursion (function calls and stack memory) might make it slower for very small arrays compared to a simple iterative loop.' },
    { question: 'What is the space complexity of this algorithm?', answer: 'O(log N) due to the recursive call stack. The depth of the recursion tree is log N.' }
  ],
  applications: [
    'Finding boundary values in datasets efficiently',
    'Computer graphics algorithms calculating bounding boxes',
    'An educational example for the Divide & Conquer paradigm beyond sorting'
  ]
}
