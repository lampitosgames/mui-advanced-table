import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const DropdownIndicator = ({ innerProps }) => (
  <IconButton {...innerProps}>
    <ArrowDropDownIcon />
  </IconButton>
);

DropdownIndicator.defaultProps = {
  innerProps: {},
};

DropdownIndicator.propTypes = {
  innerProps: PropTypes.objectOf(PropTypes.any),
};

export default DropdownIndicator;
