import { useMemo } from 'react';

const useTableIndexedRows = (rows) => {
  const indexedRows = useMemo(() => rows.map((r, i) => {
    const newRow = r;
    newRow.index = i;
    return newRow;
  }), [rows, rows.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return indexedRows;
};

export default useTableIndexedRows;
