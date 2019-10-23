import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const NoOptionsMessage = ({ selectProps, innerProps, children }) => (
  <Typography
    color="textSecondary"
    className={selectProps.classes.noOptionsMessage}
    {...innerProps}
  >
    {children}
  </Typography>
);

NoOptionsMessage.defaultProps = {
  innerProps: {},
};

NoOptionsMessage.propTypes = {
  children: PropTypes.node.isRequired,
  innerProps: PropTypes.objectOf(PropTypes.any),
  selectProps: PropTypes.shape({
    classes: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

export default NoOptionsMessage;
