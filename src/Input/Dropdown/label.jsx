import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';

const InputDropdownLabel = ({
  label,
  uniqueID,
  placeholder,
  selected,
  className,
}) => {
  if (label !== '') {
    const labelProps = {
      htmlFor: `${uniqueID}`,
      classes: { formControl: className },
    };
    if (placeholder !== '') {
      labelProps.shrink = true;
    } else {
      labelProps.shrink = selected.length !== 0;
    }
    return <InputLabel {...labelProps}>{label}</InputLabel>;
  }
  return '';
};
InputDropdownLabel.defaultProps = {
  label: '',
  placeholderValue: '',
  className: '',
};
InputDropdownLabel.propTypes = {
  label: PropTypes.string,
  uniqueID: PropTypes.string.isRequired,
  placeholderValue: PropTypes.string,
  className: PropTypes.string,
};

export default InputDropdownLabel;
