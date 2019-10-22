import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputDropdown from 'Input/Dropdown';
import Typography from '@material-ui/core/Typography';
import InputDatePicker from 'Input/DatePicker';
import clsx from 'clsx';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  inputText: {
    paddingTop: theme.spacing(0.5),
    fontSize: theme.spacing(theme.typography.label.fontSize),
    color: theme.palette.text.secondary,
  },
  margin: {
    marginLeft: theme.spacing(1.6),
  },
}));

const InputDatePickerWithin = ({
  withinRange,
  date,
  action,
  uniqueID,
  className,
}) => {
  const classes = useStyles();
  const choices = [
    '1 Day',
    '3 Days',
    '1 Week',
    '2 Weeks',
    '1 Month',
    '2 Months',
    '6 Months',
    '1 Year',
  ];
  const [inDate, setInDate] = useState(date);
  useEffect(() => setInDate(date), [date]);
  const [inRange, setInRange] = useState(withinRange);
  useEffect(() => setInRange(withinRange), [withinRange]);

  const isValidRange = r => choices.indexOf(r) !== -1;
  const isValidDate = (d) => {
    if (!d) { return false; }
    return moment(d).isValid();
  };

  const onRangeUpdate = (val) => {
    setInRange(val[0]);
    if (isValidRange(val[0])) {
      if (isValidDate(inDate)) {
        action({
          range: val[0],
          value: inDate,
        });
      } else {
        action({
          range: val[0],
          value: undefined,
        });
      }
    }
  };
  const onDateUpdate = (val) => {
    setInDate(val);
    if (isValidDate(val)) {
      if (isValidRange(inRange)) {
        action({
          range: inRange,
          value: val,
        });
      } else {
        action({
          range: undefined,
          value: val,
        });
      }
    }
  };
  return (
    <div className={clsx(classes.wrapper, className)}>
      <Typography variant="body1" component="div" className={classes.inputText}>Within </Typography>
      <InputDropdown
        data={withinRange}
        action={onRangeUpdate}
        uniqueID={uniqueID}
        choices={choices}
        className={clsx(classes.margin, classes.input)}
      />
      <Typography variant="body1" component="div" className={clsx(classes.margin, classes.inputText)}> of </Typography>
      <InputDatePicker
        initialDate={date}
        action={onDateUpdate}
        className={clsx(classes.margin, classes.input)}
      />
    </div>
  );
};

InputDatePickerWithin.defaultProps = {
  withinRange: '1 Week',
  date: undefined,
  action: () => { },
  className: '',
};

InputDatePickerWithin.propTypes = {
  uniqueID: PropTypes.string.isRequired,
  withinRange: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.any]),
  action: PropTypes.func,
  className: PropTypes.string,
};

export default InputDatePickerWithin;
