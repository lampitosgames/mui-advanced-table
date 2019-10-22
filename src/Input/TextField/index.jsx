import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';

const ENTER_KEY_CODE = 13;

const useStyles = makeStyles(() => ({
  textField: {},
}));

const InputTextField = ({
  data,
  label,
  placeholder,
  onlyUpdateOnBlur,
  fullWidth,
  uniqueID,
  action,
  isError,
  className,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(data);
  const [error, setError] = useState(false);
  useEffect(() => { setValue(data); }, [data]);

  const handleUpdate = (e) => {
    if (!error) {
      action(e.target.value);
    }
  };

  const handleChange = (e) => {
    if (isError) {
      setError(isError(e.target.value));
    }
    setValue(e.target.value);
    if (!onlyUpdateOnBlur) { handleUpdate(e); }
  };

  const handleSubmit = (e) => {
    if (e.keyCode === ENTER_KEY_CODE) { handleUpdate(e); }
  };

  return (
    <TextField
      id={`${uniqueID}-textfield`}
      label={label}
      error={error}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyUp={handleSubmit}
      className={clsx(classes.textField, className)}
      fullWidth={fullWidth}
      onBlur={handleUpdate}
    />
  );
};

InputTextField.defaultProps = {
  className: '',
  fullWidth: false,
  data: '',
  isError: () => false,
  label: '',
  onlyUpdateOnBlur: false,
  placeholder: '',
};

InputTextField.propTypes = {
  action: PropTypes.func.isRequired,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  isError: PropTypes.func,
  label: PropTypes.string,
  onlyUpdateOnBlur: PropTypes.bool,
  placeholder: PropTypes.string,
  uniqueID: PropTypes.string.isRequired,
};

export default InputTextField;
