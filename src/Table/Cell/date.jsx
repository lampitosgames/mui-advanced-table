import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment';

const TableCellDate = ({
  cellValue,
  className,
  events,
  style,
}) => {
  const date = moment(cellValue);
  return (
    <Typography
      className={className}
      component="div"
      style={style}
      variant="body1"
      {...events}
    >
      {date.format('MM/DD/YYYY')}
    </Typography>
  );
};

TableCellDate.defaultProps = {
  cellValue: '01/01/01',
  className: '',
  events: {},
  style: {},
};

TableCellDate.propTypes = {
  cellValue: PropTypes.string,
  className: PropTypes.string,
  events: PropTypes.objectOf(PropTypes.func),
  style: PropTypes.objectOf(PropTypes.any),
};

export default TableCellDate;