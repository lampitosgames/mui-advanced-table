import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const inputComponent = ({ inputRef, ...props }) => <div ref={inputRef} {...props} />;

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]).isRequired,
};

const Control = ({
  children,
  innerProps,
  innerRef,
  selectProps: { classes, TextFieldProps: { handleKeyDown, ...otherTextFieldProps } },
}) => (
  <TextField
    fullWidth
    onKeyDown={handleKeyDown}
    InputProps={{
      inputComponent,
      inputProps: {
        className: classes.input,
        ref: innerRef,
        children,
        ...innerProps,
      },
    }}
    {...otherTextFieldProps}
  />
);

Control.defaultProps = {
  innerProps: {},
};

Control.propTypes = {
  children: PropTypes.node.isRequired,
  innerProps: PropTypes.objectOf(PropTypes.any),
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]).isRequired,
  selectProps: PropTypes.shape({
    classes: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

export default Control;
