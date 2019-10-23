import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  tableTitle: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(1.6),
    paddingLeft: theme.spacing(1.6),
    paddingTop: theme.spacing(1.6),
    position: 'relative',
    width: '100%',
  },
  smallVertPadding: {
    paddingBottom: theme.spacing(0),
    paddingTop: theme.spacing(0),
  },
  mediumVertPadding: {
    paddingBottom: theme.spacing(1.6),
    paddingTop: theme.spacing(1.6),
  },
  largeVertPadding: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
}));

const getTypVarFromSize = (size) => {
  if (size === 'small') {
    return 'h6';
  }
  if (size === 'large') {
    return 'h3';
  }
  return 'h4';
};

const TableTitle = ({ title, size, className }) => {
  const classList = useStyles();
  return title ? (
    <Typography
      variant={getTypVarFromSize(size)}
      className={clsx(classList.tableTitle, classList[`${size}VertPadding`], className)}
    >
      {title}
    </Typography>
  ) : '';
};

TableTitle.defaultProps = {
  className: '',
  title: '',
  size: 'medium',
};

TableTitle.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.string,
};

export default TableTitle;
