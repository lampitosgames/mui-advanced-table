import React from 'react';
import TableCellCurrency from 'Table/Cell/currency';
import TableCellDate from 'Table/Cell/date';
import TableCellNumber from 'Table/Cell/number';
import TableCellStatus from 'Table/Cell/status';
import TableCellText from 'Table/Cell/text';
import TableInputCheckbox from 'Table/Input/checkbox';
import TableInputCurrencyField from 'Table/Input/currencyField';
import TableInputDate from 'Table/Input/date';
import TableInputDropdown from 'Table/Input/dropdown';
import TableInputIconButton from 'Table/Input/iconButton';
import TableInputNumberField from 'Table/Input/numberField';
import TableInputTextField from 'Table/Input/textField';

export const CELL_TYPES = {
  ACTION_BUTTON: 'table/ACTION_BUTTON',
  CHECKBOX: 'table/CHECKBOX',
  CURRENCY: 'table/CURRENCY',
  CURRENCY_INPUT: 'table/CURRENCY_INPUT',
  DATE: 'table/DATE',
  DATE_INPUT: 'table/DATE_INPUT',
  DROPDOWN: 'table/DROPDOWN',
  NUMBER: 'table/NUMBER',
  NUMBER_INPUT: 'table/NUMBER_INPUT',
  STATUS: 'table/STATUS',
  TEXT: 'table/TEXT',
  TEXT_INPUT: 'table/TEXT_INPUT',
};

export const cellTypeMap = {
  [CELL_TYPES.ACTION_BUTTON]: <TableInputIconButton />,
  [CELL_TYPES.CHECKBOX]: <TableInputCheckbox />,
  [CELL_TYPES.CURRENCY]: <TableCellCurrency />,
  [CELL_TYPES.CURRENCY_INPUT]: <TableInputCurrencyField />,
  [CELL_TYPES.DATE]: <TableCellDate />,
  [CELL_TYPES.DATE_INPUT]: <TableInputDate />,
  [CELL_TYPES.DROPDOWN]: <TableInputDropdown />,
  [CELL_TYPES.NUMBER]: <TableCellNumber />,
  [CELL_TYPES.NUMBER_INPUT]: <TableInputNumberField />,
  [CELL_TYPES.STATUS]: <TableCellStatus />,
  [CELL_TYPES.TEXT]: <TableCellText />,
  [CELL_TYPES.TEXT_INPUT]: <TableInputTextField />,
};

export const rightAlignedCellTypes = (type) => {
  if (
    type === CELL_TYPES.DATE
    || type === CELL_TYPES.CURRENCY
    || type === CELL_TYPES.NUMBER
  ) {
    return 'right';
  }
  return 'left';
};

export const getColumnWidth = (columns, index) => {
  const col = columns[index];
  if (col.type === CELL_TYPES.CHECKBOX) {
    return 56;
  }
  if (col.type === CELL_TYPES.ACTION_BUTTON) {
    return 52;
  }
  return col.width;
};

const tableID = {
  current: 0,
};
export const getTableID = () => tableID.current++;
