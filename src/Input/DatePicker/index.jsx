import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { KeyboardDatePicker } from '@material-ui/pickers';
import useDatePickerValidatedState from '../../Hooks/useDatePickerValidatedState.js';

const InputDatePicker = ({
  initialDate,
  minDate,
  maxDate,
  label,
  action,
  className,
}) => {
  const [
    date,
    error,
    handleChange,
    optionalProps,
  ] = useDatePickerValidatedState(initialDate, minDate, maxDate, action);
  return (
    <KeyboardDatePicker
      className={className}
      value={date}
      label={label}
      emptyLabel=""
      placeholder={moment(Date.now()).format('MM/DD/YYYY')}
      format="MM/DD/YYYY"
      mask="__/__/____"
      autoOk
      refuse={/[^\d]+/gi}
      error={error}
      onChange={handleChange}
      {...optionalProps}
    />
  );
};

InputDatePicker.defaultProps = {
  initialDate: null,
  minDate: null,
  maxDate: null,
  label: '',
  className: '',
  action: () => {},
};

InputDatePicker.propTypes = {
  initialDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
  ]),
  minDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
  ]),
  maxDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
  ]),
  label: PropTypes.string,
  action: PropTypes.func,
  className: PropTypes.string,
};

export default InputDatePicker;