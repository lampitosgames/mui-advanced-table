import moment from 'moment';
import { useState, useEffect } from 'react';

export const dateFormatter = (date) => {
  if (date === '' || date === null) {
    return null;
  }
  const dateObj = moment(date);
  if (!dateObj.isValid()) {
    return null;
  }
  return dateObj;
};

const useDatePickerValidatedState = (initial, min, max, action) => {
  const [selectedDate, setSelectedDate] = useState(dateFormatter(initial));
  useEffect(() => { setSelectedDate(dateFormatter(initial)); }, [initial]);
  const [error, setError] = useState(false);

  const minMaxProps = {};
  const formattedMin = dateFormatter(min);
  const formattedMax = dateFormatter(max);
  if (formattedMin) {
    minMaxProps.minDate = formattedMin;
    minMaxProps.minDateMessage = `Date cannot be before ${formattedMin.format('MM/DD/YYYY')}`;
  }
  if (formattedMax) {
    minMaxProps.maxDate = formattedMax;
    minMaxProps.maxDateMessage = `Date cannot be after ${formattedMax.format('MM/DD/YYYY')}`;
  }

  const handleChange = (date) => {
    setSelectedDate(date);
    let tempErrorState = (date !== null && !date.isValid());
    if (date) {
      tempErrorState = date.isBefore(formattedMin) || date.isAfter(formattedMax) || tempErrorState;
    }
    if (!tempErrorState) {
      if (date === null) {
        action('');
      } else {
        action(date.toISOString());
      }
    }
    setError(tempErrorState);
  };

  return [selectedDate, error, handleChange, minMaxProps];
};

export default useDatePickerValidatedState;
