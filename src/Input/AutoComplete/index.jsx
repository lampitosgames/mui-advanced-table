import { makeStyles, useTheme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { normSp } from '../../Table/helpers.js';
import {
  Control,
  Option,
  NoOptionsMessage,
  DropdownIndicator,
  IndicatorSeparator,
  Placeholder,
  SingleValue,
  ValueContainer,
} from './Overrides/index.js';

const useStyles = makeStyles(theme => ({
  textField: {},
  noOptionsMessage: {
    padding: normSp(theme, 1),
  },
  input: {
    display: 'flex',
    padding: 0,
    height: normSp(theme, 3.47),
  },
  singleValue: {},
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
}));

/*
  List of components that override react-select defaults.
  Add additional customizations below.

  Heavily inspired by MUI example at:
  https://material-ui.com/components/autocomplete/#react-select
*/

const components = {
  Control,
  Option,
  NoOptionsMessage,
  DropdownIndicator,
  IndicatorSeparator,
  Placeholder,
  SingleValue,
  ValueContainer,
};

const InputTextAutoComplete = ({
  options,
  className,
  initialValue,
  action,
  placeholder,
  label,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(initialValue);
  const theme = useTheme();
  const DELETE_KEY_CODE = 8;

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  const handleChange = (val) => {
    setValue(val);
    action(val);
  };

  const handleKeyDown = (e) => {
    // remove current selection when delete key is pressed
    if (e.keyCode === DELETE_KEY_CODE) {
      setValue('');
    }
  };

  return (
    <Select
      className={className}
      value={value}
      onChange={handleChange}
      classes={classes}
      options={options}
      styles={selectStyles}
      inputId="employee-select-dropdown"
      TextFieldProps={{
        label,
        handleKeyDown,
        InputLabelProps: {
          htmlFor: 'employee-select-dropdown',
          shrink: true,
        },
      }}
      components={components}
      placeholder={placeholder}
    />
  );
};

InputTextAutoComplete.defaultProps = {
  placeholder: 'Select or type...',
  label: '',
  initialValue: {},
  className: '',
  options: [],
};

InputTextAutoComplete.propTypes = {
  placeholder: PropTypes.string,
  initialValue: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  label: PropTypes.string,
  action: PropTypes.func.isRequired,
};

export default InputTextAutoComplete;