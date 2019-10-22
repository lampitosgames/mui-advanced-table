import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputDropdownLabel from 'Input/Dropdown/label';
import InputDropdownSelected from 'Input/Dropdown/selected';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import Select from '@material-ui/core/Select';
import { setCurrentCell } from 'Hooks/UseTable/nav';
import { makeStyles } from '@material-ui/core/styles';

const useDropdownStyles = makeStyles(theme => ({
  dropdownFormControl: {
    marginTop: theme.spacing(-0.3),
    minWidth: theme.spacing(6.4),
    width: '100%',
  },
  dropdownSelectMenu: {
    height: '1.1875em',
  },
  dropdownFormControlLabel: {
    top: theme.spacing(-1.8),
  },
}));

const getInitialDropdownValue = (data) => {
  if (data instanceof Array) { return data; }
  if (data === '') { return []; }
  return [data];
};

const TableInputDropdown = ({
  allowMultiple,
  cellValue,
  choices,
  className,
  events,
  inputAction,
  label,
  placeholder,
  rowData,
  style,
  uniqueID,
}) => {
  const classList = useDropdownStyles();
  // selectedState is an array of actively selected values for the dropdown
  const [selectedState, setSelectedState] = useState(getInitialDropdownValue(cellValue));
  const inputRef = useRef(null);
  const [displayChoices] = useState(() => {
    let dc = {};
    if (choices instanceof Array) {
      choices.forEach((c) => { dc[c] = c; });
    } else {
      dc = choices;
    }
    return dc;
  });
  useEffect(() => { setSelectedState(getInitialDropdownValue(cellValue)); }, [cellValue]);

  const handleChange = (e) => {
    e.stopPropagation();
    const newVal = getInitialDropdownValue(e.target.value === selectedState ? [] : e.target.value);
    inputRef.current.focus();
    setSelectedState(newVal);
    inputAction(newVal, rowData);
  };

  return (
    <div className={className} style={style} {...events}>
      <FormControl className={classList.dropdownFormControl} onClick={e => e.stopPropagation()}>
        <InputDropdownLabel
          className={classList.dropdownFormControlLabel}
          label={label}
          placeholder={placeholder}
          selected={selectedState}
          uniqueID={uniqueID}
        />
        <Select
          classes={{ selectMenu: classList.dropdownSelectMenu }}
          displayEmpty={placeholder !== ''}
          input={(
            <Input
              id={`${uniqueID}`}
              inputProps={{ inputtype: 'dropdown' }}
              name={label}
              onFocus={() => setCurrentCell(uniqueID)}
            />
          )}
          multiple={allowMultiple}
          onChange={handleChange}
          placeholder={placeholder}
          ref={inputRef}
          renderValue={() => (
            <InputDropdownSelected
              choices={displayChoices}
              mult={allowMultiple}
              placeholder={placeholder}
              selected={selectedState}
            />
          )}
          value={selectedState}
        >
          {placeholder && !allowMultiple ? <MenuItem value=""><em>{placeholder}</em></MenuItem> : ''}
          {Object.entries(displayChoices).map(([choiceName, choiceValue]) => (
            <MenuItem key={choiceName} value={choiceValue}>
              {allowMultiple ? (
                <>
                  <Checkbox color="primary" checked={selectedState.indexOf(choiceValue) > -1} />
                  <ListItemText primary={choiceName} />
                </>
              ) : choiceName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

TableInputDropdown.defaultProps = {
  action: () => {},
  allowMultiple: false,
  cellValue: [],
  choices: [],
  className: '',
  events: {},
  inputAction: () => {},
  label: '',
  placeholder: '',
  rowData: {},
  style: {},
  uniqueID: '',
};

TableInputDropdown.propTypes = {
  action: PropTypes.func,
  allowMultiple: PropTypes.bool,
  cellValue: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.number,
    PropTypes.string,
  ]),
  choices: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.objectOf(PropTypes.number),
    PropTypes.objectOf(PropTypes.string),
  ]),
  className: PropTypes.string,
  events: PropTypes.objectOf(PropTypes.func),
  inputAction: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  rowData: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  uniqueID: PropTypes.string,
};

export default TableInputDropdown;
