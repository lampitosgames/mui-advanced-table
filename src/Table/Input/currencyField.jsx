import PropTypes from 'prop-types';
import React from 'react';
import TableInputTextField from 'Table/Input/textField';
import { validateCurrency } from 'Table/Input/Validation';

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
