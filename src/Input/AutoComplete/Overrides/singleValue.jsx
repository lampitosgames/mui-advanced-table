import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const SingleValue = ({ selectProps, innerProps, children }) => (
  <Typography
    className={selectProps.classes.singleValue}
    {...innerProps}
  >
    {children}
  </Typography>
);

SingleValue.defaultProps = {
  innerProps: {},
};

SingleValue.propTypes = {
  children: PropTypes.node.isRequired,
  innerProps: PropTypes.objectOf(PropTypes.any),
  selectProps: PropTypes.shape({
    classes: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

export default SingleValue;
