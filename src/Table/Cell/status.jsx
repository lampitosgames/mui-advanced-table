import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import AutorenewIcon from '@material-ui/icons/AutorenewSharp';
import ClearIcon from '@material-ui/icons/ClearSharp';
import DoneIcon from '@material-ui/icons/DoneSharp';
import { makeStyles } from '@material-ui/core/styles';
import { normSp } from '../../Table/helpers.js';

export const STATUS = {
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
};

const useStyles = makeStyles((theme) => ({
  '@keyframes spinner': {
    to: { transform: 'rotate(180deg)' }
  },
  statusIcon: {
    borderRadius: '50%',
    width: normSp(theme, 3.2),
    height: normSp(theme, 3.2),
    fontWeight: 'bold',
    padding: normSp(theme, 0.4),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  complete: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  pending: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    animation: '$spinner 0.8s ease infinite',
  },
}));

// Given cell data, return the type of status icon to be displayed
const getStatusCellEnumValue = (data) => {
  if (typeof data === 'string') {
    if (data.toUpperCase() === STATUS.PENDING) { return STATUS.PENDING; }
    if (data.toUpperCase() === STATUS.COMPLETE) { return STATUS.COMPLETE; }
    if (data.toUpperCase() === STATUS.ERROR) { return STATUS.ERROR; }
  }

  if (data === 'pending') {
    return STATUS.PENDING;
  }
  if (data === true || data === 'true' || data === 'paid') {
    return STATUS.COMPLETE;
  }
  if (data === false || data === 'false' || data === 'error') {
    return STATUS.ERROR;
  }
  return STATUS.ERROR;
};

const TableCellStatus = ({
  cellValue,
  className,
  events,
  style,
}) => {
  const classList = useStyles();
  const type = getStatusCellEnumValue(cellValue);

  let selectedIcon;
  switch (type) {
  case STATUS.COMPLETE:
    selectedIcon = <div className={clsx(classList.statusIcon, classList.complete)}><DoneIcon /></div>;
    break;
  case STATUS.ERROR:
    selectedIcon = <div className={clsx(classList.statusIcon, classList.error)}><ClearIcon /></div>;
    break;
  case STATUS.PENDING:
    selectedIcon = <div className={clsx(classList.statusIcon, classList.pending)}><AutorenewIcon /></div>;
    break;
  default:
    selectedIcon = <div />;
    break;
  }
  return (
    <div className={className} style={style} {...events}>
      {selectedIcon}
    </div>
  );
};

TableCellStatus.defaultProps = {
  cellValue: false,
  className: '',
  events: {},
  style: {},
};

TableCellStatus.propTypes = {
  cellValue: PropTypes.oneOf([true, 'true', false, 'false', 'pending', 'paid', 'error']),
  className: PropTypes.string,
  events: PropTypes.objectOf(PropTypes.func),
  style: PropTypes.objectOf(PropTypes.any),
};

export default TableCellStatus;