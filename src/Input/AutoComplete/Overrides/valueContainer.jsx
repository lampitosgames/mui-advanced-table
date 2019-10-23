import React from 'react';
import PropTypes from 'prop-types';

const ValueContainer = ({ selectProps, children }) => (
  <div className={selectProps.classes.valueContainer}>
    {children}
  </div>
);

ValueContainer.propTypes = {
  children: PropTypes.node.isRequired,
  selectProps: PropTypes.shape({
    classes: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

export default ValueContainer;
