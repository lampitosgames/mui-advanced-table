import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  number: {},
}));

const TableCellNumber = ({
  cellValue,
  className,
  events,
  style,
}) => {
  const classList = useStyles();
  return (
    <Typography
      className={clsx(classList.number, className)}
      component="div"
      style={style}
      variant="body1"
      {...events}
    >
      {Number(cellValue).toFixed(2)}
    </Typography>
  );
};

TableCellNumber.defaultProps = {
  cellValue: '',
  className: '',
  events: {},
  style: {},
};

TableCellNumber.propTypes = {
  cellValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  events: PropTypes.objectOf(PropTypes.func),
  style: PropTypes.objectOf(PropTypes.any),
};

export default TableCellNumber;
