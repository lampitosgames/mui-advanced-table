import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { setCurrentCell } from 'Hooks/UseTable/nav';
import { makeStyles } from '@material-ui/core/styles';

const useCheckboxStyles = makeStyles(theme => ({
  checkbox: {
    transform: `translateX(${theme.spacing(-0.8)})`,
  },
}));

const TableInputCheckbox = ({
  cellValue,
  className,
  events,
  inputAction,
  isDisabled,
  rowData,
  style,
  uniqueID,
}) => {
  const classList = useCheckboxStyles();
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    setIsChecked(cellValue);
  }, [cellValue, setIsChecked]);
  const handleChange = (e) => {
    setIsChecked(e.target.checked);
    inputAction(e.target.checked, rowData);
  };
  const checkDisabled = () => isDisabled(rowData);
  const inputProps = {
    inputtype: 'checkbox',
  };
  return (
    <div className={className} style={style} {...events}>
      <Checkbox
        checked={isChecked}
        className={classList.checkbox}
        color="primary"
        component="div"
        disabled={checkDisabled()}
        id={`${uniqueID}`}
        inputProps={inputProps}
        onChange={handleChange}
        onClick={e => e.stopPropagation()}
        onFocus={() => setCurrentCell(uniqueID)}
      />
    </div>
  );
};

TableInputCheckbox.defaultProps = {
  cellValue: false,
  className: '',
  events: {},
  inputAction: () => {},
  isDisabled: () => false,
  rowData: {},
  style: {},
  uniqueID: undefined,
};

TableInputCheckbox.propTypes = {
  cellValue: PropTypes.bool,
  className: PropTypes.string,
  events: PropTypes.objectOf(PropTypes.func),
  inputAction: PropTypes.func,
  isDisabled: PropTypes.func,
  rowData: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  uniqueID: PropTypes.string,
};

export default TableInputCheckbox;
