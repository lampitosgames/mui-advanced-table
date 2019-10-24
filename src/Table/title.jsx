import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { normSp } from './helpers.js';

const useStyles = makeStyles(theme => ({
  tableTitle: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: normSp(theme, 1.6),
    paddingLeft: normSp(theme, 1.6),
    paddingTop: normSp(theme, 1.6),
    position: 'relative',
    width: '100%',
  },
  smallVertPadding: {
    paddingBottom: normSp(theme, 0),
    paddingTop: normSp(theme, 0),
  },
  mediumVertPadding: {
    paddingBottom: normSp(theme, 1.6),
    paddingTop: normSp(theme, 1.6),
  },
  largeVertPadding: {
    paddingBottom: normSp(theme, 2),
    paddingTop: normSp(theme, 2),
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