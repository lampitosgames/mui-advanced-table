import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/core/styles';

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
    width: theme.spacing(3.25),
    height: theme.spacing(3.25),
    fontWeight: 'bold',
    padding: theme.spacing(0.4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  complete: {
    bakgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  error: {
    bakgroundColor: theme.palette.error.main,
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
  if (data === STATUS.PENDING) { return STATUS.PENDING; }
  if (data === STATUS.COMPLETE) { return STATUS.COMPLETE; }
  if (data === STATUS.ERROR) { return STATUS.ERROR; }

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
    selectedIcon = <div className={clsx(classList.statusIcon, classList.complete, className)}><DoneIcon /></div>;
  case STATUS.ERROR:
    selectedIcon = <div className={clsx(classList.statusIcon, classList.error, className)}><ClearIcon /></div>;
  case STATUS.PENDING:
    selectedIcon = <div className={clsx(classList.statusIcon, classList.pending, className)}><AutorenewIcon /></div>;
  default:
    selectedIcon = <div />;
  }
  return (
    <div className={clsx(classList.status, className)} style={style} {...events}>
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