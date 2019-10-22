import currency from 'currency.js';

/**
 * General text input validator function format
 * @param  {T} val               Raw value from state. Should be stored in the most basic
 *                               form possible. In a chain of validators, pass previous validator's
 *                               "raw" value
 * @return {[T, string, bool]}   Array of 3 values:
 *                                 raw     - Value to store
 *                                 display - Formatted value to display
 *                                 isError - Is the value valid
 */


export const validateNumber = (val) => {
  const storeVal = parseFloat(val);
  const displayVal = storeVal.toFixed(2);
  const isError = Number.isNaN(storeVal);
  return [storeVal, displayVal, isError];
};

export const validateCurrency = (val) => {
  const currencyVal = currency(val, { formatWithSymbol: true });
  const displayVal = currencyVal.format();
  const storeVal = parseFloat(currencyVal.value);
  const isError = Number.isNaN(storeVal);
  return [storeVal, displayVal, isError];
};
