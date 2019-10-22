import PropTypes from 'prop-types';
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  skeleton: {
    borderRadius: 0,
    height: theme.spacing(2.4),
    width: '100%',
  },
}));

const TableCellSkeleton = ({ style, className, events }) => {
  const classList = useStyles();
  return (
    <div className={className} style={style} {...events}>
      <Skeleton className={classList.skeleton} />
    </div>
  );
};

TableCellSkeleton.defaultProps = {
  className: '',
  events: {},
  style: {},
};

TableCellSkeleton.propTypes = {
  className: PropTypes.string,
  events: PropTypes.objectOf(PropTypes.func),
  style: PropTypes.objectOf(PropTypes.any),
};

export default TableCellSkeleton;
