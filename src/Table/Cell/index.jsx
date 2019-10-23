import PropTypes from 'prop-types';
import React, { memo, useMemo } from 'react';
import clsx from 'clsx';
import { areEqual } from 'react-window';
import { makeStyles } from '@material-ui/core/styles';
import { cellTypeMap, rightAlignedCellTypes, CELL_TYPES } from '../constants.jsx';
import { useRowContext, useColumnContext } from '../context.jsx';
import TableCellSkeleton from './skeleton.jsx';

const useCellStyles = makeStyles(theme => ({
  cell: {
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.grey}`,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  hover: {
    backgroundColor: theme.palette.background.lightGrey,
  },
  cellClickableCursor: {
    cursor: 'pointer',
  },
  smallPadding: {
    paddingLeft: theme.spacing(0.4),
    paddingRight: theme.spacing(0.4),
  },
  mediumPadding: {
    paddingLeft: theme.spacing(0.8),
    paddingRight: theme.spacing(0.8),
  },
  largePadding: {
    paddingLeft: theme.spacing(1.2),
    paddingRight: theme.spacing(1.2),
  },
  leftCellAlign: {
    direction: 'ltr',
  },
  rightCellAlign: {
    direction: 'rtl',
  },
  leftmostCell: {
    paddingLeft: theme.spacing(1.6),
  },
  rightmostCell: {
    paddingRight: theme.spacing(1.6),
  },
}));

const TableCell = ({
  columnIndex,
  data,
  rowIndex: displayRowIndex,
  style,
}) => {
  const classList = useCellStyles();
  const columns = useColumnContext(data.tableID);
  const rows = useRowContext(data.tableID);

  const columnData = columns[columnIndex];
  const rowData = rows[displayRowIndex];
  const cellValue = rowData[columnData.dataKey];

  // Memoize on the cell value. Prevents re-rendering all cells when a single cell needs updating
  return useMemo(() => {
    const {
      callbacks,
      classes,
      expandedRowElement,
      getExpandedHeight,
      getRowHeight,
      selectedRows,
      size,
      tableID,
      toggleRowExpansion,
    } = data;
    const {
      align,
      dataKey,
      inputAction,
      type,
    } = columnData;

    const uniqueID = `${tableID}~${dataKey}~${displayRowIndex}`;

    const cellAlign = align || rightAlignedCellTypes(type);
    const cellClasses = clsx(
      classList.cell, // Base class for table cells
      `table-${tableID}-${dataKey}-${displayRowIndex}`, // Used for selecting specific cells based on row/column
      classList[`${size}Padding`], // Set padding based on the size prop
      cellAlign === 'right' ? classList.rightCellAlign : classList.leftCellAlign, // col alignment
      columnIndex === 0 ? classList.leftmostCell : '', // First cell in a row
      columnIndex === columns.length - 1 ? classList.rightmostCell : '', // last cell in a row
      expandedRowElement || callbacks.onRowClick ? classList.cellClickableCursor : '', // If row is expandable, change cursor type
      classes.cell, // class for all cells
      classes.cellInColumn[dataKey], // class for cells in a specific column
      classes.cellInRow[rowData.index], // class for cells in a specific row
    );

    const onHoverChange = hovering => () => {
      // Update hover state for all cells in this row
      columns.forEach((c) => {
        const cellInRow = document.querySelector(`.table-${tableID}-${c.dataKey}-${displayRowIndex}`);
        if (!cellInRow) { return; }
        if (hovering) {
          cellInRow.classList.add(classList.hover);
          if (classes.rowHover !== '') {
            cellInRow.classList.add(classes.rowHover);
          }
        } else {
          cellInRow.classList.remove(classList.hover);
          if (classes.rowHover !== '') {
            cellInRow.classList.remove(classes.rowHover);
          }
        }
      });
    };

    const cellEvents = {
      onClick: (!!expandedRowElement || !!callbacks.onRowClick ? () => {
        if (callbacks.onRowClick) { callbacks.onRowClick(rowData); }
        if (expandedRowElement) { toggleRowExpansion(displayRowIndex); }
      } : undefined),
      onMouseEnter: expandedRowElement || !!callbacks.onRowClick ? onHoverChange(true) : undefined,
      onMouseLeave: expandedRowElement || !!callbacks.onRowClick ? onHoverChange(false) : undefined,
    };

    let cellElement;
    let cellProps;
    if (type === CELL_TYPES.CHECKBOX ||
      type === CELL_TYPES.ACTION_BUTTON ||
      (cellValue !== null && cellValue !== undefined)) {
      // Cell has data. Render normally
      cellElement = typeof type !== 'string' ? type : cellTypeMap[type];
      cellProps = {
        ...cellElement.props,
        ...columnData.cellProps,
        cellValue,
        className: cellClasses,
        events: cellEvents,
        inputAction,
        rowData,
        style: { ...style, height: getRowHeight(rowData.index) },
        uniqueID,
      };
    } else {
      // Cell doesn't have data. Render a placeholder
      cellElement = <TableCellSkeleton />;
      cellProps = {
        className: cellClasses,
        events: cellEvents,
        style: { ...style, height: getRowHeight(rowData.index) },
      };
    }
    // If row expansion is enabled, make sure to render expanded rows
    if (columnIndex === 0 && !!expandedRowElement && selectedRows.indexOf(displayRowIndex) !== -1) {
      const expansionProps = {
        ...expandedRowElement.props,
        rowData,
        style: {
          height: getExpandedHeight(displayRowIndex) - getRowHeight(displayRowIndex),
          left: 0,
          position: 'absolute',
          top: style.top + getRowHeight(displayRowIndex),
          width: '100%',
        },
      };
      return (
        <React.Fragment key={uniqueID}>
          {React.cloneElement(cellElement, cellProps)}
          {React.cloneElement(expandedRowElement, expansionProps)}
        </React.Fragment>
      );
    }
    return React.cloneElement(cellElement, cellProps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellValue, style, displayRowIndex, classList, columnIndex]);
};

TableCell.defaultProps = {
  data: {},
  style: {},
};

TableCell.propTypes = {
  columnIndex: PropTypes.number.isRequired,
  data: PropTypes.objectOf(PropTypes.any),
  rowIndex: PropTypes.number.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};

export default memo(TableCell, areEqual);