import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import InputDatePickerWithin from '../../Input/DatePicker/within.jsx';
import InputDropdown from '../../Input/Dropdown/index.jsx';
import InputTextAutoComplete from '../../Input/AutoComplete/index.jsx';
import InputTextField from '../../Input/TextField/index.jsx';
import FILTER_TYPES from './constants.js';
import useStyles from './styles.js';

const FilterInput = ({ filter, setValue }) => {
  const classes = useStyles();
  let inputElement;
  switch (filter.type) {
  case (FILTER_TYPES.DATE):
    inputElement = (
      <InputDatePickerWithin
          action={setValue}
          className={classes.filterInputField}
          date={filter.value.date}
          uniqueID={filter.key}
          withinRange={filter.value.range}
        />
    );
    break;
  case (FILTER_TYPES.DROPDOWN):
    inputElement = (
      <InputDropdown
          action={setValue}
          allowMultiple
          choices={filter.choices}
          className={classes.filterInputField}
          data={filter.value}
          uniqueID={filter.displayName}
        />
    );
    break;
  case (FILTER_TYPES.TEXT_AUTOCOMPLETE):
    inputElement = (
      <InputTextAutoComplete
          action={(d) => { setValue(d.value); }}
          className={classes.filterInputField}
          initialValue={{ value: filter.value, label: filter.value }}
          label=""
          options={filter.autocompleteOptions}
          placeholder=""
        />
    );
    break;
  case (FILTER_TYPES.TEXT):
  default:
    inputElement = (
      <InputTextField
          action={setValue}
          className={classes.filterInputField}
          initialValue={filter.value}
          onlyUpdateOnBlur
          uniqueID={filter.displayName}
        />
    );
    break;
  }
  return (
    <div className={classes.filterInput}>
      <Typography variant="body1" component="div" className={classes.filterInputText}>{filter.displayName}</Typography>
      {inputElement}
    </div>
  );
};

FilterInput.defaultProps = {};

FilterInput.propTypes = {
  filter: PropTypes.objectOf(PropTypes.any).isRequired,
  setValue: PropTypes.func.isRequired,
};

export default FilterInput;