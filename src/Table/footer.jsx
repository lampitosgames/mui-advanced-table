import PropTypes from 'prop-types';
import React, { useImperativeHandle, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import useScrollbarWidth from '../Hooks/useScrollbarWidth.js';
import useTableColumnTotals from '../Hooks/columnTotals.js';
import { CELL_TYPES, rightAlignedCellTypes } from './constants.jsx';
import TableCellCurrency from './Cell/currency.jsx';
import TableCellNumber from './Cell/number.jsx';
import { normSp } from './helpers.js';

const useFooterStyles = makeStyles(theme => ({
  footerRow: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  totalsLabel: {
    left: 0,
    paddingLeft: `${normSp(theme, 1.6)} !important`,
    borderTop: `1px solid ${theme.palette.grey.A100}`,
    position: 'absolute',
    top: 0,
  },
  footerCell: {
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.grey.A100}`,
    boxSizing: 'border-box',
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '&:first-child': {
      paddingLeft: normSp(theme, 1.6),
    },
    '&:nth-last-child(2)': {
      paddingRight: normSp(theme, 1.6),
    },
  },
  smallPadding: {
    paddingBottom: normSp(theme, 0.8),
    paddingLeft: normSp(theme, 0.4),
    paddingRight: normSp(theme, 0.4),
    paddingTop: normSp(theme, 0.8),
  },
  mediumPadding: {
    paddingBottom: normSp(theme, 1.6),
    paddingLeft: normSp(theme, 0.8),
    paddingRight: normSp(theme, 0.8),
    paddingTop: normSp(theme, 1.6),
  },
  largePadding: {
    paddingBottom: normSp(theme, 2),
    paddingLeft: normSp(theme, 1.2),
    paddingRight: normSp(theme, 1.2),
    paddingTop: normSp(theme, 2),
  },
  scrollbarPadder: {
    boxSizing: 'border-box',
    display: 'flex',
    paddingLeft: normSp(theme, 0.8),
    paddingRight: normSp(theme, 0.8),
    position: 'relative',
  },
}));

// eslint-disable-next-line react/display-name
const TableFooter = React.forwardRef(({
  classes,
  columns,
  rows,
  size,
  totalsLabel,
}, ref) => {
  const classList = useFooterStyles();
  const [scrollWidth] = useScrollbarWidth();
  const internalFooterRef = useRef();
  // Use column totals if they are enabled
  const [colTotals, recalculateColumnTotal] = useTableColumnTotals(rows, columns);
  useImperativeHandle(ref, () => ({
    setScrollLeft: (newScrollPos) => {
      if (internalFooterRef.current) {
        internalFooterRef.current.scrollLeft = newScrollPos;
      }
    },
    recalculateColumnTotal,
  }));
  if (Object.keys(colTotals).length === 0) { return ''; }
  return (
    <div className={classList.footerRow} ref={internalFooterRef}>
      <Typography
        className={clsx(classList[`${size}Padding`], classList.totalsLabel, classes.footerLabel)}
        component="div"
        variant="subtitle1"
      >
        {totalsLabel}
      </Typography>
      {columns.map((c) => {
        const cellAlign = c.align ? c.align : rightAlignedCellTypes(c.type);
        const style = {
          direction: cellAlign === 'right' ? 'rtl' : 'ltr',
          maxWidth: c.calculatedWidth,
          minWidth: c.calculatedWidth,
          width: c.calculatedWidth,
        };
        const totalCellProps = {
          cellValue: colTotals[c.dataKey],
          className: clsx(classList.footerCell, classList[`${size}Padding`], classes.footerCell),
          style,
        };
        if (colTotals[c.dataKey] === undefined || Number.isNaN(colTotals[c.dataKey])) {
          delete totalCellProps.cellValue;
          return (<div key={c.dataKey} {...totalCellProps} />);
        }
        if (c.type === CELL_TYPES.CURRENCY || c.type === CELL_TYPES.CURRENCY_INPUT) {
          return (<TableCellCurrency key={c.dataKey} {...totalCellProps} />);
        }
        return (<TableCellNumber key={c.dataKey} {...totalCellProps} />);
      })}
      <div style={{ paddingLeft: scrollWidth }} />
    </div>
  );
});

TableFooter.defaultProps = {
  size: 'medium',
  totalsLabel: '',
};

TableFooter.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  size: PropTypes.string,
  totalsLabel: PropTypes.string,
};

export default TableFooter;