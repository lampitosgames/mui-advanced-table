import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeGrid } from 'react-window';
import clsx from 'clsx';
import TableCell from './Table/Cell/index.jsx';
import TableFooter from './Table/footer.jsx';
import TableHeader from './Table/Header/index.jsx';
import TableTitle from './Table/title.jsx';
import FILTER_TYPES from './Hooks/Filter/constants.js';
import useTableDynamicColSizes from './Hooks/dynamicColSizes.js';
import useTableFilter from './Hooks/Filter/index.jsx';
import useTableIndexedRows from './Hooks/indexedRows.js';
import useTableRefsAndSize from './Hooks/refsAndSize.js';
import useTableRowSelection from './Hooks/rowSelection.js';
import useTableSort from './Hooks/sort.jsx';
import useTableValidSortedColumns from './Hooks/validSortedColumns.js';
import useTableWrappedInputActions from './Hooks/wrappedInputActions.js';
import { CELL_TYPES, getTableID } from './Table/constants.jsx';
import { TableContextProvider } from './Table/context.jsx';
import { ensureSafeClassesObject } from './Table/helpers.js';
import { useTableNav } from './Hooks/nav.js';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

/*
TODO
Features
  - infinite loading support - https://www.npmjs.com/package/react-window-infinite-loader
  - Checkbox column header needs to optionally have text in place of the default 'select all' input
  - Need a way to add filters for keys that don't have a column
  - Need a way to overwrite how individual cells render. Useful if a column doesn't have consistent
    cell components
  - Expose all useful events/updates via the 'callbacks' property  
Bugs
  - Some interactions cause double calls of the main table function body. Not a big problem, but
    could use optimization
  - Sorting directly after editing a field does not cause that cell to re-render (probably
    memoization issue)
  - When a row is expanded, the first cell's background reverts to a non-hover state (first cell is
    the one that renders the expanded element, so likely its breaking the memo)
  - Deleting an expanded row crashes the app in some instances (deletion is handled externally by
    component consumer)
  - When a row is expanded and the first column is unmounted due to horizontal scrolling, the
    expansion component also gets unmounted
  - The 'align' column property can break keyboard navigation between editable cells if the column
    takes user input in the form of a text field. This is because navigation relies on cursor 
    position, something that conflicts with the 'direction' css property
  - If the table's width is not bounded in some way, the custom flex algorithm causes it to 
    infinitely widen. This is caused by a 'divide by zero' fix and isn't an issue if the CSS is
    set up properly
 */
const useTableStyles = makeStyles(theme => ({
  table: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  autoSizer: {
    display: 'block',
    flexGrow: 1,
  },
  tableBody: {
    display: 'block',
    position: 'relative',
  },
  loadingOverlay: {
    backgroundColor: theme.palette.text.secondary,
    left: 0,
    position: 'absolute',
    top: 0,
    zIndex: 40,
  },
}));

const Table = ({
  callbacks,
  className,
  classes,
  columns,
  expandedRowElement,
  expandedRowHeight,
  rows,
  size,
  style,
  title,
  totalsLabel,
}) => {
  // # State variables
  // Every table has a unique ID used for IDs and the nav
  const [tableID] = useState(() => getTableID());
  // Force a re-render in case nested changes are detected
  const [, forceUpdate] = useState(undefined);
  // Get class names from JSS styles
  const classList = useTableStyles();
  // Ensure no undefined values exist in the classes object to prevent downstream errors
  const classOverwrites = useMemo(() => ensureSafeClassesObject(classes), [classes]);
  // Track loading state. If loading, grey out table data
  const [loading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  // Hook to manage all table refs, sizing, and scrolling
  const [
    refs,
    outerBounds,
    innerBounds,
    scrollbarActive,
    handleResize,
    resetCellSizeCache,
  ] = useTableRefsAndSize();
  // Hook to manage row selection / expansion. Will do nothing if row expansion props are omitted
  const [
    selectedRows,
    setSelectedRows,
    toggleRowExpansion,
    getRowHeight,
    getExpandedHeight,
  ] = useTableRowSelection(52, expandedRowHeight, size, refs.tableRef);
  // Helper function to close expanded rows. Used for when the row data changes internally
  const resetSelectedRows = () => {
    setSelectedRows(new Array(0));
    resetCellSizeCache();
  };

  // # Table Column Hooks
  // Validate column inputs and ensure column order remains consistent
  const [orderedColumns, onColumnOrderChange] = useTableValidSortedColumns(
    columns,
    refs.tableRef,
    stopLoading,
  );
  // Properly size all columns according to their parameters
  const [sizedColumns, getColumnWidth] = useTableDynamicColSizes(
    orderedColumns,
    outerBounds.width,
    scrollbarActive,
    resetCellSizeCache,
  );
  // Wrap all inputAction functions to cause relevant table state updates
  const columnState = useTableWrappedInputActions(
    sizedColumns,
    forceUpdate,
    refs.headerRef,
    refs.footerRef,
  );
  // Hook that handles inter-cell navigation between input cells
  useTableNav(tableID, sizedColumns);

  // # Table Row Hooks
  // Use static row indices according to how the rows were passed in
  const indexedRows = useTableIndexedRows(rows);
  // Allow row filtering (if no columns have filters, the filter UI will not appear)
  const [filteredRows, filterElement] = useTableFilter(
    indexedRows,
    columnState,
    classOverwrites,
    resetSelectedRows,
  );
  // Allow multi-column sorting
  const [sortedRows, sortState] = useTableSort(filteredRows, resetSelectedRows);

  // Data all cells need access to for rendering purposes. Pass to the itemData prop on the table
  const cellDataStore = useMemo(() => ({
    callbacks,
    classes: classOverwrites,
    expandedRowElement,
    getExpandedHeight,
    getRowHeight,
    selectedRows,
    size,
    tableID,
    toggleRowExpansion,
  }), [
    callbacks,
    classOverwrites,
    expandedRowElement,
    getExpandedHeight,
    getRowHeight,
    selectedRows,
    size,
    tableID,
    toggleRowExpansion,
  ]);

  return (
    <div className={clsx(classList.table, className, classOverwrites.root)} style={style}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <TableContextProvider columns={columnState} rows={sortedRows} tableID={tableID}>
          <TableTitle title={title} size={size} className={classOverwrites.title} />
          {filterElement}
          <TableHeader
            classes={classOverwrites}
            forceUpdate={forceUpdate}
            innerWidth={innerBounds.width}
            onSortEnd={onColumnOrderChange}
            onSortStart={startLoading}
            ref={refs.headerRef}
            size={size}
            sortState={sortState}
            tableID={tableID}
          />
          <div className={classList.autoSizer}>
            <AutoSizer onResize={handleResize}>
              {({ height: autoSizerHeight, width: autoSizerWidth }) => (
                <React.Fragment>
                  <VariableSizeGrid
                    columnCount={columnState.length}
                    columnWidth={getColumnWidth}
                    height={autoSizerHeight}
                    itemData={cellDataStore}
                    outerRef={refs.scrollContainerRef}
                    overscanRowCount={5}
                    ref={refs.tableRef}
                    rowCount={sortedRows.length}
                    rowHeight={getExpandedHeight}
                    width={autoSizerWidth}
                  >
                    {TableCell}
                  </VariableSizeGrid>
                  {loading ? <div style={{ height: autoSizerHeight, width: autoSizerWidth }} className={classList.loadingOverlay} /> : ''}
                </React.Fragment>
              )}
            </AutoSizer>
          </div>
          <TableFooter
            classes={classOverwrites}
            columns={columnState}
            innerWidth={innerBounds.width}
            ref={refs.footerRef}
            rows={rows}
            size={size}
            totalsLabel={totalsLabel}
          />
        </TableContextProvider>
      </MuiPickersUtilsProvider>
    </div>
  );
};

Table.defaultProps = {
  callbacks: {},
  className: '',
  classes: {},
  columns: [{}, {}, {}],
  expandedRowElement: undefined,
  expandedRowHeight: undefined,
  rows: [{}, {}, {}],
  size: 'medium',
  style: undefined,
  title: '',
  totalsLabel: '',
};

Table.propTypes = {
  callbacks: PropTypes.shape({
    onRowClick: PropTypes.func,
  }),
  className: PropTypes.string,
  classes: PropTypes.shape({
    root: PropTypes.string,
    title: PropTypes.string,
    filter: PropTypes.string,
    filterMenu: PropTypes.string,
    filterButton: PropTypes.string,
    filterChip: PropTypes.string,
    header: PropTypes.string,
    headerCell: PropTypes.string,
    headerCellText: PropTypes.string,
    cell: PropTypes.string,
    cellInColumn: PropTypes.objectOf(PropTypes.string),
    cellInRow: PropTypes.objectOf(PropTypes.string),
    rowHover: PropTypes.string,
    footer: PropTypes.string,
    footerLabel: PropTypes.string,
    footerCell: PropTypes.string,
  }),
  columns: PropTypes.arrayOf(PropTypes.shape({
    align: PropTypes.string,
    cellProps: PropTypes.objectOf(PropTypes.any),
    dataKey: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    draggable: PropTypes.bool,
    filter: PropTypes.shape({
      choices: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.objectOf(PropTypes.string),
      ]),
      label: PropTypes.string,
      type: PropTypes.oneOf(Object.values(FILTER_TYPES)),
    }),
    flex: PropTypes.number,
    flexBasis: PropTypes.number,
    flexGrow: PropTypes.number,
    flexShrink: PropTypes.number,
    inputAction: PropTypes.func,
    label: PropTypes.string,
    maxWidth: PropTypes.number,
    minWidth: PropTypes.number,
    order: PropTypes.number,
    size: PropTypes.string,
    sortable: PropTypes.bool,
    totalable: PropTypes.bool,
    type: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.oneOf(Object.values(CELL_TYPES)),
    ]),
    width: PropTypes.number,
  })),
  expandedRowElement: PropTypes.element,
  expandedRowHeight: PropTypes.number,
  rows: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  totalsLabel: PropTypes.string,
};

const defaultColumnData = { // eslint-disable-line no-unused-vars
  // # Required for every column
  dataKey: 'column1Key', // Row object data for this column should be accessible with this key
  // # Recommended
  label: 'Column 1', // Header text / element
  type: CELL_TYPES.TEXT, // Either a pre-defined cell type, or a custom component
  // # Column widths
  width: 128, // Fixed width for this column if not using flex. Otherwise, same as flexBasis
  minWidth: 128, // Min size when doing flex calculations
  maxWidth: 128, // Max size...
  flexBasis: 0, // Flex basis if using flexbox. Otherwise this property isn't used
  flex: 0, // Setter for both flexShrink and flexGrow
  flexShrink: 0,
  flexGrow: 0,
  // # Useful for in-table forms
  inputAction: (data, rowData) => {}, // eslint-disable-line no-unused-vars
  // # Optional Features
  draggable: true,
  sortable: true,
  totalable: false, // Display the total for this row. Table will calculate this value before render
  align: 'left', // Override CSS text alignment for this column
  cellProps: {}, // Allows passthrough of props to cells in this column
  order: 0, // Order in which columns will appear. Used by drag & drop, but can be set manually
  size: 'medium', // small, medium, large - affects padding
  filter: {
    type: FILTER_TYPES.DROPDOWN,
    label: 'Display Label', // Optional label. If not provided, the column label is used
    choices: {
      Choice1: 'Choice 1 display text',
      Choice2: 'Choice 2 display text',
    },
  },
};

export { CELL_TYPES, FILTER_TYPES };

export default Table;