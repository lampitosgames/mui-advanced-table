import { CELL_TYPES } from './constants.jsx';
const deepmerge = require('deepmerge');

const classesShape = {
  root: '', // Root of the table
  title: '', // Title component
  filter: '', // Root div of the filter element
  filterMenu: '', // Background of filter dialog window
  filterButton: '', // Open/close filter button
  filterChip: '', // Filter chips
  header: '', // Root div of the header
  headerCell: '', // Individual header cells
  headerCellText: '', // Text in the header cell
  cell: '', // Applied to every cell
  cellInColumn: {}, // Map of dataKeys to className. Applies styles to all cells in a column
  cellInRow: {}, // Map of row index to className. Applies styles to all cells in a row
  rowHover: '', // Applied to all cells in a row when that row is hovered over
  footer: '', // Root div of the footer
  footerLabel: '', // Label for the footer row
  footerCell: '', // Cells in the footer
};
export const ensureSafeClassesObject = classes => (
  deepmerge(classesShape, classes || {}, { arrayMerge: (dest, src) => src })
);

export const ensureSafeColumnObject = (column, index) => {
  // Default values that will result in the most basic rendering possible
  const columnDefaults = {
    dataKey: index,
    draggable: false,
    flex: !column.width && !column.flexGrow && !column.flexShrink ? 1 : undefined,
    inputAction: () => {},
    label: '',
    order: index,
    size: 'medium',
    sortable: false,
    totalable: false,
    type: CELL_TYPES.TEXT,
    width: 0,
  };
  const validatedCol = deepmerge(columnDefaults, column || {}, { arrayMerge: (dest, src) => src });
  if (validatedCol.flexBasis) {
    validatedCol.width = validatedCol.flexBasis;
    delete validatedCol.flexBasis;
  }
  if (validatedCol.flex) {
    validatedCol.flexGrow = validatedCol.flex;
    validatedCol.flexShrink = validatedCol.flex;
    delete validatedCol.flex;
  }
  return validatedCol;
};

export const sortColumnsByOrder = (a, b) => {
  if (a.order > b.order) { return 1; }
  if (a.order < b.order) { return -1; }
  return 0;
};

// Inspired by this source:
// - https://github.com/bvaughn/react-window/blob/master/src/areEqual.js
// - https://github.com/bvaughn/react-window/blob/master/src/shallowDiffers.js
export const shallowDiffers = (prev, next) => {
  if (prev instanceof Array && next instanceof Array) {
    if (prev.every(val => next.indexOf(val) !== -1)) { return true; }
    if (next.every((val, i) => prev[i] !== val)) { return true; }
  } else if (prev instanceof Array || next instanceof Array) {
    return true; // Only one is an array. Definitely need updates
  } else if (typeof prev === 'object' && typeof next === 'object') {
    if (Object.keys(prev).every(key => !(key in next))) { return true; }
    if (Object.keys(next).every(key => prev[key] !== next[key])) { return true; }
  } else {
    return prev !== next;
  }
  return false;
};

export const makeCustomAreEqualForSpecificProps = propsToCompare => (
  origPrevProps,
  origNextProps,
) => {
  // Shallow clone both props so we don't break the render
  const { ...prevProps } = origPrevProps;
  const { ...nextProps } = origNextProps;
  const allAreEqual = propsToCompare.every((pc) => {
    const {
      [pc]: prevVal,
    } = prevProps;
    const {
      [pc]: nextVal,
    } = nextProps;
    delete prevProps[pc];
    delete nextProps[pc];
    return !shallowDiffers(prevVal, nextVal);
  });

  return (!allAreEqual && !shallowDiffers(prevProps, nextProps));
};