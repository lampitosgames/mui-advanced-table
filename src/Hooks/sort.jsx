import { useState, useEffect, useCallback } from 'react';

// This function is based on this:
// - https://github.com/bvaughn/react-virtualized/blob/master/source/Table/createMultiSort.js
const makeSortState = (callback, prevSortBy = [], prevSortDirection = {}) => {
  const sortBy = prevSortBy || [];
  const sortDirection = prevSortDirection || {};
  sortBy.forEach((dataKey) => {
    sortDirection[dataKey] = prevSortDirection[dataKey] ?
      prevSortDirection[dataKey] :
      'asc';
  });
  const sort = (event, dataKey, defaultSortDirection = 'asc') => {
    if (event.shiftKey) {
      // Shift + click appends a column to existing criteria
      if (sortDirection[dataKey]) {
        sortDirection[dataKey] = sortDirection[dataKey] === 'asc' ? 'desc' : 'asc';
      } else {
        sortDirection[dataKey] = defaultSortDirection;
        sortBy.push(dataKey);
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Control + click removes column from sort (if pressent)
      const index = sortBy.indexOf(dataKey);
      if (index >= 0) {
        sortBy.splice(index, 1);
        delete sortDirection[dataKey];
      }
    } else {
      // Clear sortBy array of all non-selected keys
      sortBy.length = 0;
      sortBy.push(dataKey);
      // Clear sortDirection object of all non-selected keys
      const sortDirectionKeys = Object.keys(sortDirection);
      sortDirectionKeys.forEach((key) => {
        if (key !== dataKey) delete sortDirection[key];
      });
      // If key is already selected, reverse sort direction.
      // Else, set sort direction to default direction.
      if (sortDirection[dataKey]) {
        sortDirection[dataKey] = sortDirection[dataKey] === 'asc' ? 'desc' : 'asc';
      } else {
        sortDirection[dataKey] = defaultSortDirection;
      }
    }

    // Notify application code
    callback({
      sortBy,
      sortDirection,
    });
  };
  return {
    sort,
    sortBy,
    sortDirection,
  };
};

// Helper function for the quicksort algorithm
const partition = (arr, low, high, compare) => {
  const swap = (i, j) => {
    [arr[i], arr[j]] = [arr[j], arr[i]]; // eslint-disable-line no-param-reassign
  };

  const pivot = arr[high];
  let smallIndex = low - 1;

  for (let curIndex = low; curIndex <= high - 1; curIndex++) {
    // compare = arr[j] <= pivot
    if (compare(arr[curIndex], pivot)) {
      smallIndex++;
      swap(smallIndex, curIndex);
    }
  }

  swap(smallIndex + 1, high);
  return (smallIndex + 1);
};

// Quicksort algorithm
const quickSortRows = (arr, low, high, compare) => {
  if (low < high) {
    const partitionIndex = partition(arr, low, high, compare);
    quickSortRows(arr, low, partitionIndex - 1, compare);
    quickSortRows(arr, partitionIndex + 1, high, compare);
  }
};

const useTableSort = (rowData, onSort = () => {}) => {
  const [sortedRows, setSortedRows] = useState(rowData);

  const sortRows = useCallback(({ sortBy, sortDirection }) => {
    // make a copy of the rows array since the quicksort function operates on the array it is passed
    const clonedRowData = [...rowData];
    // Build a compare function
    const compareRows = (r1, r2) => {
      for (let i = 0; i < sortBy.length; i++) {
        let val1 = r1[sortBy[i]];
        let val2 = r2[sortBy[i]];
        //typecast to string if values are not of the same type
        if (typeof r1[sortBy[i]] !== typeof r2[sortBy[i]]) {
          val1 += "";
          val2 += "";
        }
        // If the vals are equal, continue to the next sort column
        if (val1 !== val2) {
          // Ascending or descending sort
          if (sortDirection[sortBy[i]] === 'asc') {
            return val1 > val2;
          }
          return val1 < val2;
        }
      }
      return false;
    };
    // Sort all rows using compare function
    quickSortRows(clonedRowData, 0, clonedRowData.length - 1, compareRows);
    // Call passed-in event listener
    onSort({ sortBy, sortDirection });
    // Set sorted rows to the now-sorted clonedRowData
    setSortedRows(clonedRowData);
  }, [rowData, setSortedRows, onSort]);

  // Keep the multisort state in a state hook. Only create it if sorting is enabled
  const [sortState, setSortState] = useState(() => makeSortState(sortRows));
  // Reset sort
  useEffect(() => {
    setSortedRows(rowData);
    // New sort state with same sort params applied to updated row data
    setSortState(makeSortState(
      sortRows, sortState.sortBy, sortState.sortDirection,
    ));
    sortRows(sortState);
  }, [rowData]); // eslint-disable-line react-hooks/exhaustive-deps

  return [sortedRows, sortState];
};

export default useTableSort;