import { useState, useCallback } from 'react';

const useTableRowSelection = (defaultHeight, expandedHeight, size, table) => {
  // Currently selected (expanded) rows
  const [selectedRows, setSelectedRows] = useState(new Array(0));
  const storedRowHeights = {
    small: defaultHeight - 18,
    medium: defaultHeight,
    large: defaultHeight + 24,
  };

  // Memoized callbacks so the function refs remain consistent
  const getRowHeight = useCallback(() => (
    size ? storedRowHeights[size] : defaultHeight
  ), [defaultHeight, size]); // eslint-disable-line react-hooks/exhaustive-deps
  const getExpandedHeight = useCallback((rowIndex) => {
    if (selectedRows.indexOf(rowIndex) > -1) {
      return expandedHeight;
    }
    return getRowHeight();
  }, [selectedRows, getRowHeight, expandedHeight]);

  const toggleRowExpansion = useCallback((rowIndex) => {
    const selectedInd = selectedRows.indexOf(rowIndex);
    if (selectedInd === -1) {
      setSelectedRows(prev => ([...prev, rowIndex]));
    } else {
      setSelectedRows((prev) => {
        const newState = [...prev];
        newState.splice(selectedInd, 1);
        return newState;
      });
    }
    table.current.resetAfterRowIndex(rowIndex, true);
  }, [table, selectedRows]);

  return [selectedRows, setSelectedRows, toggleRowExpansion, getRowHeight, getExpandedHeight];
};

export default useTableRowSelection;
