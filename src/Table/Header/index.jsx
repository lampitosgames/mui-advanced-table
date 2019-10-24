import DragHandleIcon from '@material-ui/icons/HeightSharp';
import PropTypes from 'prop-types';
import React, { useMemo, useRef, useImperativeHandle } from 'react';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import useScrollbarWidth from '../../Hooks/useScrollbarWidth.js';
import { CELL_TYPES, rightAlignedCellTypes } from '../constants.jsx';
import { useRowContext, useColumnContext } from '../context.jsx';
import { makeStyles } from '@material-ui/core/styles';
import TableHeaderCheckbox from './checkbox.jsx';
import { normSp } from '../helpers.js';

const useHeaderStyles = makeStyles(theme => ({
  headerRow: {
    borderBottom: `1px solid ${theme.palette.grey.A100}`,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
  },
  headerCell: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    boxSizing: 'border-box',
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 500,
    position: 'relative',
    userSelect: 'none',
    '&:first-child': {
      paddingLeft: normSp(theme, 1.6),
    },
    // Select second to last child
    '&:nth-last-child(2)': {
      paddingRight: normSp(theme, 1.6),
    },
  },
  smallHorPadding: {
    paddingLeft: normSp(theme, 0.4),
    paddingRight: normSp(theme, 0.4),
  },
  smallVertPadding: {
    paddingBottom: normSp(theme, 0.8),
    paddingTop: normSp(theme, 0.8),
  },
  mediumHorPadding: {
    paddingLeft: normSp(theme, 0.8),
    paddingRight: normSp(theme, 0.8),
  },
  mediumVertPadding: {
    paddingBottom: normSp(theme, 1.6),
    paddingTop: normSp(theme, 1.6),
  },
  largeHorPadding: {
    paddingLeft: normSp(theme, 1.2),
    paddingRight: normSp(theme, 1.2),
  },
  largeVertPadding: {
    paddingBottom: normSp(theme, 2),
    paddingTop: normSp(theme, 2),
  },
  cellText: {
    boxSizing: 'border-box',
    flexGrow: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  icon: {
    color: theme.palette.text.secondary,
    fontSize: `${normSp(theme, 2.2)}`,
    transition: 'all 100ms linear',
  },
  sortLabel: {
    color: theme.palette.text.primary,
    '&:hover, &:focus, &:active': {
      color: theme.palette.text.primary,
    },
  },
  dragLabel: {
    cursor: 'pointer',
    '&:hover': {
      '& $handleIcon': {
        opacity: 1,
      },
    },
  },
  handleIcon: {
    color: theme.palette.text.hint,
    opacity: 0,
    position: 'absolute',
    transform: 'rotate(90deg)',
    transition: 'opacity 100ms linear',
  },
  smallHandleIcon: {
    top: normSp(theme, 3),
  },
  mediumHandleIcon: {
    top: normSp(theme, 4),
  },
  largeHandleIcon: {
    top: normSp(theme, 4.5),
  },
}));

const DraggableHeader = sortableContainer(({ className, children, forwardedRef }) => (
  <div className={className} ref={forwardedRef}>{children}</div>
));

const DraggableHeaderCell = sortableElement(({ children, ...other }) => (
  React.cloneElement(children, other)
));

// eslint-disable-next-line react/display-name
const TableHeader = React.forwardRef(({
  classes,
  forceUpdate,
  onSortEnd,
  onSortStart,
  size,
  sortState,
  tableID,
}, ref) => {
  const classList = useHeaderStyles();
  const columns = useColumnContext(tableID);
  const rows = useRowContext(tableID);
  const draggingEnabled = useMemo(() => columns.some(col => col.draggable), [columns]);
  const [scrollWidth] = useScrollbarWidth();
  const internalHeaderRef = useRef();

  useImperativeHandle(ref, () => ({
    setScrollLeft: (newScrollPos) => {
      if (internalHeaderRef.current) {
        internalHeaderRef.current.scrollLeft = newScrollPos;
      }
    },
  }));

  const columnElements = columns.map((c, i) => {
    const cellAlign = c.align ? c.align : rightAlignedCellTypes(c.type);
    const style = {
      direction: cellAlign === 'right' ? 'rtl' : 'ltr',
      maxWidth: c.calculatedWidth,
      minWidth: c.calculatedWidth,
      width: c.calculatedWidth,
    };

    const headerCellProps = {
      className: clsx(
        classList.headerCell,
        classList[`${size}HorPadding`],
        draggingEnabled && c.draggable ? classList.dragLabel : '',
        classes.headerCell,
      ),
      style,
    };

    if (c.type === CELL_TYPES.CHECKBOX) {
      return (
        <TableHeaderCheckbox
          columnData={c}
          forceUpdate={forceUpdate}
          key={c.dataKey}
          rows={rows}
          {...headerCellProps}
        />
      );
    }

    const handleClick = dataKey => (e) => {
      sortState.sort(e, dataKey);
    };
    const headerLabel = c.sortable ? (
      <TableSortLabel
        active={sortState.sortBy.indexOf(c.dataKey) !== -1}
        className={classList[`${size}VertPadding`]}
        classes={{ root: classList.sortLabel, icon: classList.icon }}
        component="div"
        direction={sortState.sortDirection[c.dataKey]}
        onClick={handleClick(c.dataKey)}
        style={{ width: '100%' }}
      >
        <Typography
          className={clsx(classList.cellText, classes.headerCellText)}
          component="h3"
          variant="subtitle1"
        >
          {c.label}
        </Typography>
        {draggingEnabled && c.draggable ? <DragHandleIcon fontSize="small" viewBox="8 3 16 18" color="inherit" className={clsx(classList.handleIcon, classList[`${size}HandleIcon`])} /> : ''}
      </TableSortLabel>
    ) : (
      <React.Fragment>
        <Typography
          className={clsx(classList.cellText, classList[`${size}VertPadding`], classes.headerCellText)}
          component="h3"
          variant="subtitle1"
        >
          {c.label}
        </Typography>
        {draggingEnabled && c.draggable ? <DragHandleIcon fontSize="small" viewBox="8 3 16 18" color="inherit" className={clsx(classList.handleIcon, classList[`${size}HandleIcon`])} /> : ''}
      </React.Fragment>
    );
    if (draggingEnabled) {
      return (
        <DraggableHeaderCell disabled={!c.draggable} key={c.dataKey} index={i}>
          <div {...headerCellProps}>
            {headerLabel}
          </div>
        </DraggableHeaderCell>
      );
    }
    return (<div key={c.dataKey} {...headerCellProps}>{headerLabel}</div>);
  });

  if (draggingEnabled) {
    return (
      <DraggableHeader
        axis="x"
        className={clsx(classList.headerRow, classes.header)}
        forwardedRef={internalHeaderRef}
        lockAxis="x"
        onSortEnd={onSortEnd}
        onSortStart={onSortStart}
        pressDelay={150}
      >
        {columnElements}
        <div style={{ paddingLeft: scrollWidth }} />
      </DraggableHeader>
    );
  }
  return (
    <div className={clsx(classList.headerRow, classes.header)} ref={internalHeaderRef}>
      {columnElements}
      <div style={{ paddingLeft: scrollWidth }} />
    </div>
  );
});

TableHeader.defaultProps = {
  onSortEnd: () => {},
  onSortStart: () => {},
  size: 'medium',
};

TableHeader.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  forceUpdate: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func,
  onSortStart: PropTypes.func,
  size: PropTypes.string,
  sortState: PropTypes.objectOf(PropTypes.any).isRequired,
  tableID: PropTypes.number.isRequired,
};

export default TableHeader;