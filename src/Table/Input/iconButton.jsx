import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { setCurrentCell } from 'Hooks/UseTable/nav';
import { makeStyles } from '@material-ui/core/styles';

const useInputButtonStyles = makeStyles(() => ({
  iconButton: {
    position: 'relative',
  },
  noPadding: {
    padding: '0 !important',
  },
}));
const TableInputIconButton = ({
  buttonColor,
  className,
  events,
  icon,
  inputAction,
  rowData,
  style,
  tooltipLabel,
  uniqueID,
}) => {
  const classList = useInputButtonStyles();

  const handleClick = (e) => {
    e.stopPropagation();
    inputAction(rowData);
  };

  let iconButton = (
    <IconButton
      className={classList.iconButton}
      id={uniqueID}
      inputtype="button"
      onClick={handleClick}
      onFocus={() => setCurrentCell(uniqueID)}
      style={{ color: buttonColor || 'inherit' }}
    >
      { icon }
    </IconButton>
  );

  if (tooltipLabel !== '') {
    iconButton = (
      <Tooltip title={tooltipLabel} placement="top">
        {iconButton}
      </Tooltip>
    );
  }
  return (
    <div
      className={clsx(className, classList.noPadding)}
      style={style}
      {...events}
    >
      {iconButton}
    </div>
  );
};
TableInputIconButton.defaultProps = {
  buttonColor: '',
  className: '',
  events: {},
  icon: undefined,
  inputAction: () => {},
  rowData: {},
  style: {},
  tooltipLabel: '',
  uniqueID: undefined,
};

TableInputIconButton.propTypes = {
  buttonColor: PropTypes.string,
  className: PropTypes.string,
  events: PropTypes.objectOf(PropTypes.func),
  icon: PropTypes.element,
  inputAction: PropTypes.func,
  rowData: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  tooltipLabel: PropTypes.string,
  uniqueID: PropTypes.string,
};

export default TableInputIconButton;
