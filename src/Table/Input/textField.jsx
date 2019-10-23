import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import useTableInputValidation from '../../Hooks/inputValidation.js';
import { setCurrentCell } from '../../Hooks/nav.js';

const useTextFieldStyles = makeStyles(theme => ({
  textField: {
    margin: '0 !important',
    paddingTop: theme.spacing(0.3),
  },
  input: {
    ...theme.typography.body1,
  },
}));

const TableInputTextField = ({
  cellValue,
  className,
  events,
  inputAction,
  label,
  placeholder,
  rowData,
  style,
  uniqueID,
  validators,
}) => {
  const classList = useTextFieldStyles();
  const [
    { formattedVal, rawVal, isError },
    onValueChange,
    setError,
  ] = useTableInputValidation(cellValue, validators);

  const [displayValue, setDisplayValue] = useState(formattedVal);
  const handleChange = (e) => {
    // Re-run error detection with every change
    onValueChange(e.target.value);
    // Set display value
    setDisplayValue(e.target.value);
  };

  const [isFocused, setIsFocused] = useState(false);
  const [valOnFocus, setValOnFocus] = useState(rawVal);
  const handleBlur = () => {
    setDisplayValue(formattedVal);
    setError(false);
    setIsFocused(false);
    // Since input action can sometimes be very non-performant, only call it if the value
    // actually changed
    if (valOnFocus !== rawVal) {
      inputAction(rawVal, rowData);
    }
  };
  const handleFocus = () => {
    setCurrentCell(uniqueID);
    setIsFocused(true);
    setValOnFocus(rawVal);
  };

  useEffect(() => {
    if (!isFocused) { setDisplayValue(formattedVal); }
  }, [formattedVal, isFocused]);

  const inputProps = {
    className: classList.input,
    inputtype: 'text',
    onClick: (e) => { e.stopPropagation(); },
  };
  return (
    <TextField
      className={clsx(classList.textField, className)}
      error={isError}
      fullWidth
      id={`${uniqueID}`}
      inputProps={inputProps}
      label={label}
      margin="dense"
      {...events}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      style={style}
      value={displayValue}
    />
  );
};

TableInputTextField.defaultProps = {
  cellValue: '',
  className: '',
  events: {},
  inputAction: () => {},
  isCurrency: false,
  isError: () => {},
  isNumber: false,
  label: '',
  placeholder: '',
  rowData: {},
  style: {},
  uniqueID: '',
  validators: undefined,
};

TableInputTextField.propTypes = {
  cellValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  events: PropTypes.objectOf(PropTypes.func),
  inputAction: PropTypes.func,
  isCurrency: PropTypes.bool,
  isError: PropTypes.func,
  isNumber: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  rowData: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  uniqueID: PropTypes.string,
  validators: PropTypes.arrayOf(PropTypes.func),
};

export default TableInputTextField;