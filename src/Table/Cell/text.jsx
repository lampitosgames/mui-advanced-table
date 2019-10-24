import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const TableCellText = ({
  cellValue,
  className,
  events,
  style,
}) => {
  return (
    <Typography
      className={className}
      component="div"
      style={style}
      variant="body1"
      {...events}
    >
      {cellValue}
    </Typography>
  );
};

TableCellText.defaultProps = {
  cellValue: '',
  className: '',
  events: {},
  style: {},
};

TableCellText.propTypes = {
  cellValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  events: PropTypes.objectOf(PropTypes.func),
  style: PropTypes.objectOf(PropTypes.any),
};

export default TableCellText;