import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const Placeholder = (props) => {
  const { selectProps: { classes }, innerProps = {}, children } = props;

  return (
    <Typography
      color="textSecondary"
      className={classes.placeholder}
      {...innerProps}
    >
      {children}
    </Typography>
  );
};

Placeholder.defaultProps = {
  innerProps: {},
};

Placeholder.propTypes = {
  children: PropTypes.node.isRequired,
  innerProps: PropTypes.objectOf(PropTypes.any),
  selectProps: PropTypes.shape({
    classes: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

export default Placeholder;
