import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, Checkbox } from '@material-ui/core';

const InputCheckbox = ({
  data,
  isDisabled,
  uniqueID,
  action,
  className,
  label,
  labelPlacement,
}) => {
  // const classes = useStyles();
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    setIsChecked(data);
  }, [data]);
  const handleChange = (e) => {
    setIsChecked(e.target.checked);
    action(e.target.checked);
  };
  const checkDisabled = () => isDisabled();
  return (
    <FormControlLabel
      control={(
        <Checkbox
          checked={isChecked}
          onChange={handleChange}
          id={`${uniqueID}`}
          inputProps={{ inputtype: 'checkbox' }}
          disabled={checkDisabled()}
          color="primary"
          className={className}
        />
  )
}
label = { label }
labelPlacement = { labelPlacement }
/>
);
};

InputCheckbox.defaultProps = {
  data: false,
  isDisabled: () => false,
  className: '',
  uniqueID: undefined,
  label: '',
  labelPlacement: 'end',
};

InputCheckbox.propTypes = {
  data: PropTypes.bool,
  isDisabled: PropTypes.func,
  action: PropTypes.func.isRequired,
  uniqueID: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  labelPlacement: PropTypes.string,
};

export default InputCheckbox;