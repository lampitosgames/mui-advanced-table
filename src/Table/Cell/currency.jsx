import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import currency from 'currency.js';

const TableCellCurrency = ({
  cellValue,
  className,
  events,
  style,
}) => {
  const getValue = () => {
    if (cellValue === '') { return cellValue; }
    return currency(cellValue, { formatWithSymbol: true }).format();
  };
  return (
    <Typography
      className={className}
      component="div"
      style={style}
      variant="body1"
      {...events}
    >
      {getValue()}
    </Typography>
  );
};

TableCellCurrency.defaultProps = {
  cellValue: '',
  className: '',
  events: {},
  style: {},
};

TableCellCurrency.propTypes = {
  cellValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  events: PropTypes.objectOf(PropTypes.func),
  style: PropTypes.objectOf(PropTypes.any),
};

export default TableCellCurrency;