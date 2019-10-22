import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  checkbox: {
    transform: `translateX(${theme.spacing(-0.8)})`,
  },
}));

const TableHeaderCheckbox = ({
  className,
  columnData,
  forceUpdate,
  rows,
  style,
}) => {
  const classList = useStyles();
  const [isChecked, setIsChecked] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  useEffect(() => {
    const allSelected = rows.every(r => r[columnData.dataKey]);
    const noneSelected = rows.every(r => !r[columnData.dataKey]);
    const someSelected = rows.some(r => r[columnData.dataKey]);
    // Checked if some are selected
    setIsChecked(someSelected);
    // Indeterminate if only some are checked.
    // Not indeterminate if all or none are checked
    setIsIndeterminate(someSelected && !allSelected && !noneSelected);
  }, [rows, columnData.dataKey]);

  const handleClick = () => {
    rows.forEach((r) => {
      columnData.rawInputAction(!isChecked, r);
    });
    setIsChecked(prev => !prev);
    forceUpdate({});
  };
  return (
    <div className={className} style={style}>
      <Checkbox
        checked={isChecked}
        className={classList.checkbox}
        color="primary"
        indeterminate={isIndeterminate}
        onClick={handleClick}
      />
    </div>
  );
};

TableHeaderCheckbox.defaultProps = {
  className: '',
  style: {},
};

TableHeaderCheckbox.propTypes = {
  className: PropTypes.string,
  columnData: PropTypes.objectOf(PropTypes.any).isRequired,
  forceUpdate: PropTypes.func.isRequired,
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};

export default TableHeaderCheckbox;
