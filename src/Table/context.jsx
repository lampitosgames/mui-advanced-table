import React, { useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const tableContexts = {};

const TableContextProvider = ({
  children,
  columns,
  rows,
  tableID,
}) => {
  if (!tableContexts[tableID]) {
    tableContexts[tableID] = {
      row: createContext(),
      column: createContext(),
    };
  }
  useEffect(() => () => {
    delete tableContexts[tableID].column;
    delete tableContexts[tableID].row;
    delete tableContexts[tableID];
  }, [tableID]);
  const ColumnProvider = tableContexts[tableID].column.Provider;
  const RowProvider = tableContexts[tableID].row.Provider;
  return (
    <ColumnProvider value={columns}>
      <RowProvider value={rows}>
        {children}
      </RowProvider>
    </ColumnProvider>
  );
};

TableContextProvider.defaultProps = {};

TableContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]).isRequired,
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  tableID: PropTypes.number.isRequired,
};

const useRowContext = (tableID) => {
  const tableRows = useContext(tableContexts[tableID].row);
  return tableRows;
};
const useColumnContext = (tableID) => {
  const tableColumns = useContext(tableContexts[tableID].column);
  return tableColumns;
};

export { TableContextProvider, useRowContext, useColumnContext };