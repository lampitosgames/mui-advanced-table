import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { setCurrentCell } from '../../Hooks/nav.js';
import useDatePickerValidatedState from '../../Hooks/useDatePickerValidatedState.js';

const useDateStyles = makeStyles(theme => ({
  datePicker: {
    marginTop: 0,
    '& > div': {
      width: '100%',
    },
  },
  input: {
    ...theme.typography.body1,
  },
}));

const TableInputDate = ({
  cellValue,
  className,
  events,
  inputAction,
  maxDate,
  minDate,
  rowData,
  style,
  uniqueID,
}) => {
  const classList = useDateStyles();
  const modifiedAction = (newDate) => { inputAction(newDate, rowData); };
  const [
    date,
    error,
    handleChange,
    optionalProps,
  ] = useDatePickerValidatedState(cellValue, minDate, maxDate, modifiedAction);
  const inputProps = {
    className: classList.input,
    id: `${uniqueID}`,
    inputtype: 'date',
    onClick: (e) => { e.stopPropagation(); },
    onFocus: () => setCurrentCell(uniqueID),
    style: { width: '100%' },
  };

  return (
    <KeyboardDatePicker
      autoOk
      classes={{ root: clsx(classList.datePicker, className) }}
      emptyLabel=""
      error={error}
      format="MM/DD/YYYY"
      inputProps={inputProps}
      invalidDateMessage=""
      mask="__/__/____"
      {...events}
      onChange={handleChange}
      onClick={e => e.stopPropagation()}
      placeholder={moment(Date.now()).format('MM/DD/YYYY')}
      refuse={/[^\d]+/gi}
      style={style}
      value={date}
      {...optionalProps}
    />
  );
};

TableInputDate.defaultProps = {
  action: () => {},
  cellValue: null,
  className: '',
  events: {},
  inputAction: () => {},
  label: '',
  maxDate: null,
  minDate: null,
  rowData: {},
  style: {},
  uniqueID: undefined,
};

TableInputDate.propTypes = {
  action: PropTypes.func,
  className: PropTypes.string,
  cellValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
    PropTypes.string,
  ]),
  events: PropTypes.objectOf(PropTypes.func),
  inputAction: PropTypes.func,
  label: PropTypes.string,
  maxDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
    PropTypes.string,
  ]),
  minDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
    PropTypes.string,
  ]),
  rowData: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  uniqueID: PropTypes.string,
};

export default TableInputDate;