import PropTypes from 'prop-types';
import React from 'react';
import TableInputTextField from './textField.jsx';
import { validateCurrency } from './Validation';

const TableInputCurrencyField = ({
  validators,
  ...other
}) => (<TableInputTextField validators={[...validators, validateCurrency]} {...other} />);

TableInputCurrencyField.defaultProps = {
  validators: [],
};

TableInputCurrencyField.propTypes = {
  validators: PropTypes.arrayOf(PropTypes.func),
};

export default TableInputCurrencyField;