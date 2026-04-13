#include <iostream>
#include <chrono>
#include <cmath>
using namespace std;
using namespace std::chrono;

void merge(int arr[], int left, int mid, int right)
{
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int L[n1], R[n2];

    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2)
    {
        if (L[i] <= R[j])
            arr[k++] = L[i++];
        else
            arr[k++] = R[j++];
    }

    while (i < n1)
        arr[k++] = L[i++];
    while (j < n2)
        arr[k++] = R[j++];
}

void mergeSort(int arr[], int left, int right)
{
    if (left < right)
    {
        int mid = (left + right) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

int main()
{
    int n;
    cout << "Enter number of elements: ";
    cin >> n;

    int arr[n];
    cout << "Enter elements:\n";
    for (int i = 0; i < n; i++)
        cin >> arr[i];

    // Start time
    auto start = high_resolution_clock::now();

    mergeSort(arr, 0, n - 1);

    // End time
    auto end = high_resolution_clock::now();

    cout << "\nSorted array:\n";
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";

    // Time calculation
    auto duration = duration_cast<microseconds>(end - start);

    // Space calculation
    int inputSpace = n * sizeof(int);
    int tempSpace = n * sizeof(int);        // L + R arrays
    int stackSpace = log2(n) * sizeof(int); // recursion stack

    int totalSpace = inputSpace + tempSpace + stackSpace;

    cout << "\n\nExecution Time: " << duration.count() << " microseconds";
    cout << "\nApproximate Space Used: " << totalSpace << " bytes";

    return 0;
}
