import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  text: {},
}));

const TableCellText = ({
  cellValue,
  className,
  events,
  style,
}) => {
  const classList = useStyles();
  return (
    <Typography
      className={clsx(classList.text, className)}
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
