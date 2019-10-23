import PropTypes from 'prop-types';
import React from 'react';
import TableInputTextField from './textField.jsx';
import { validateNumber } from './Validation';

const TableInputNumberField = ({
  validators,
  ...other
}) => (<TableInputTextField validators={[...validators, validateNumber]} {...other} />);

TableInputNumberField.defaultProps = {
  validators: [],
};

TableInputNumberField.propTypes = {
  validators: PropTypes.arrayOf(PropTypes.func),
};

export default TableInputNumberField;