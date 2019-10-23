import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import InputDropdownLabel from './label.jsx';
import InputDropdownSelected from './selected.jsx';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: theme.spacing(6.4),
    width: '100%',
  },
  selectMenu: {
    height: '1.1875em',
  },
}));

const getInitialDropdownValue = (data) => {
  if (data instanceof Array) { return data; }
  if (data === '') { return []; }
  return [data];
};

const InputDropdown = ({
  data,
  action,
  allowMultiple,
  uniqueID,
  label,
  choices,
  placeholder,
  className,
  muiOverrides,
}) => {
  const classes = useStyles();
  const [selectedState, setSelectedState] = useState(getInitialDropdownValue(data));

  const makeDisplayChoices = useCallback(() => {
    let dc = {};
    if (choices instanceof Array) {
      choices.forEach((c) => { dc[c] = c; });
    } else {
      dc = choices;
    }
    return dc;
  }, [choices]);

  const [displayChoices, setDisplayChoices] = useState(makeDisplayChoices());

  const handleChange = (e) => {
    const newVal = getInitialDropdownValue(e.target.value === selectedState ? [] : e.target.value);
    setSelectedState(newVal);
    action(newVal);
  };

  useEffect(() => {
    setDisplayChoices(makeDisplayChoices());
    setSelectedState(getInitialDropdownValue(data));
  }, [data, choices, makeDisplayChoices]);

  return (
    <FormControl className={clsx(classes.formControl, className)}>
      <InputDropdownLabel
        label={label}
        uniqueID={uniqueID}
        placeholder={placeholder}
        selected={selectedState}
      />
      <Select
        value={selectedState}
        multiple={allowMultiple}
        placeholder={placeholder}
        onChange={handleChange}
        onClick={e => e.stopPropagation()}
        displayEmpty={placeholder !== ''}
        classes={{ selectMenu: clsx(classes.selectMenu, muiOverrides.selectMenu) }}
        renderValue={() => (
          <InputDropdownSelected
            selected={selectedState}
            choices={displayChoices}
            placeholder={placeholder}
            mult={allowMultiple}
          />
        )}
        input={<Input name={label} id={`${uniqueID}-input`} />}
      >
        {placeholder && !allowMultiple ? <MenuItem value=""><em>{placeholder}</em></MenuItem> : ''}
        {Object.entries(displayChoices).map(([choiceName, choiceValue]) => (
          <MenuItem key={choiceName} value={choiceValue} classes={{ root: muiOverrides.menuItem }}>
            {allowMultiple ? (
              <React.Fragment>
                <Checkbox color="primary" checked={selectedState.indexOf(choiceValue) > -1} />
                <ListItemText primary={choiceName} />
              </React.Fragment>
            ) : choiceName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

InputDropdown.defaultProps = {
  data: [],
  action: () => {},
  allowMultiple: false,
  label: '',
  placeholder: '',
  className: '',
  muiOverrides: {},
};

InputDropdown.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  action: PropTypes.func,
  allowMultiple: PropTypes.bool,
  uniqueID: PropTypes.string.isRequired,
  label: PropTypes.string,
  choices: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.objectOf(PropTypes.string),
  ]).isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  muiOverrides: PropTypes.objectOf(PropTypes.string),
};

export default InputDropdown;