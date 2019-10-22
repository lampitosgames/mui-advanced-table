import PropTypes from 'prop-types';
import React, { useImperativeHandle, useRef } from 'react';
import TableCellCurrency from 'Table/Cell/currency';
import TableCellNumber from 'Table/Cell/number';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import useScrollbarWidth from 'Hooks/UseScrollbarWidth';
import useTableColumnTotals from 'Hooks/UseTable/columnTotals';
import { CELL_TYPES, rightAlignedCellTypes } from 'Table/constants';
import { makeStyles } from '@material-ui/core/styles';

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
    paddingLeft: `${theme.spacing(1.6)} !important`,
    borderTop: `1px solid ${theme.palette.light.dark}`,
    position: 'absolute',
    top: 0,
  },
  footerCell: {
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.light.dark}`,
    boxSizing: 'border-box',
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '&:first-child': {
      paddingLeft: theme.spacing(1.6),
    },
    '&:nth-last-child(2)': {
      paddingRight: theme.spacing(1.6),
    },
  },
  smallPadding: {
    paddingBottom: theme.spacing(0.8),
    paddingLeft: theme.spacing(0.4),
    paddingRight: theme.spacing(0.4),
    paddingTop: theme.spacing(0.8),
  },
  mediumPadding: {
    paddingBottom: theme.spacing(1.6),
    paddingLeft: theme.spacing(0.8),
    paddingRight: theme.spacing(0.8),
    paddingTop: theme.spacing(1.6),
  },
  largePadding: {
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1.2),
    paddingRight: theme.spacing(1.2),
    paddingTop: theme.spacing(2),
  },
  scrollbarPadder: {
    boxSizing: 'border-box',
    display: 'flex',
    paddingLeft: theme.spacing(0.8),
    paddingRight: theme.spacing(0.8),
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