import { ensureSafeColumnObject } from 'Table/helpers';
import { useState, useEffect, useCallback } from 'react';

const sortColumnsByOrder = (a, b) => {
  if (a.order > b.order) { return 1; }
  if (a.order < b.order) { return -1; }
  return 0;
};

const useTableValidSortedColumns = (columns, table, stopLoading) => {
  const [columnState, setColumnState] = useState(() => {
    const validatedCols = columns
      .map((col, i) => ensureSafeColumnObject(col, i))
      .sort(sortColumnsByOrder);
    return validatedCols;
  });
  useEffect(() => {
    setColumnState(columns
      .map((col, i) => ensureSafeColumnObject(col, i))
      .sort(sortColumnsByOrder));
  }, [columns]);

  const onColumnOrderChange = useCallback(({ oldIndex: o, newIndex: n }) => {
    setColumnState((prev) => {
      const newState = [...prev];
      if (o > n) {
        //       n        o
        // [0, 1, 2, 3, 4, 5, 6]
        //       +  +  +  n
        // [0, 1, 5, 2, 3, 4, 6]
        for (let i = n; i < o; i++) { newState[i].order = i + 1; }
        newState[o].order = n;
      } else if (o < n) {
        //    o  ->    n
        // [0, 1, 2, 3, 4, 5, 6]
        //    n  -  -  -
        // [0, 2, 3, 4, 1, 5, 6]
        newState[o].order = n;
        for (let i = o + 1; i <= n; i++) { newState[i].order = i - 1; }
      }
      newState.sort(sortColumnsByOrder);
      return newState;
    });
    stopLoading();
    table.current.resetAfterColumnIndex(Math.min(o, n));
  }, [table, stopLoading]);

  return [columnState, onColumnOrderChange];
};

export default useTableValidSortedColumns;
