import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const InputDropdownSelected = ({
  selected,
  choices,
  placeholder,
  mult,
}) => {
  let typographyContent = '';
  if (selected.length === 0) {
    if (placeholder) {
      typographyContent = <em>{placeholder}</em>;
    } else {
      typographyContent = '';
    }
  } else {
    typographyContent = selected.map(s => Object.keys(choices).find(c => choices[c] === s));
    if (mult) { typographyContent = typographyContent.join(', '); }
  }
  return (
    <Typography variant="subtitle1" component="span">{typographyContent}</Typography>
  );
};

InputDropdownSelected.defaultProps = {
  placeholder: undefined,
  mult: false,
};

InputDropdownSelected.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  choices: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  placeholder: PropTypes.string,
  mult: PropTypes.bool,
};

export default InputDropdownSelected;
