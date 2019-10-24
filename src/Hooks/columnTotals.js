import {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

const useTableColumnTotals = (rows, columns) => {
  const totalableCols = useMemo(() => {
    const tc = [];
    columns.forEach((c) => {
      if (c.totalable) { tc.push(c.dataKey); }
    });
    return tc;
  }, [columns]);

  const calculateTotals = useCallback(() => {
    const tempTotals = {};
    totalableCols.forEach((colKey) => {
      tempTotals[colKey] = 0;
      rows.forEach((r) => { tempTotals[colKey] += r[colKey]; });
    });
    return tempTotals;
  }, [rows, totalableCols]);

  const [colTotals, setColTotals] = useState(calculateTotals);
  useEffect(() => {
    setColTotals(calculateTotals());
  }, [calculateTotals]);

  const recalculateColumnTotal = (colKey) => {
    setColTotals((prev) => {
      const newState = { ...prev };
      newState[colKey] = 0;
      rows.forEach((r) => { newState[colKey] += r[colKey]; });
      return newState;
    });
  };
  return [colTotals, recalculateColumnTotal];
};

export default useTableColumnTotals;