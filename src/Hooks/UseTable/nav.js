import { useEffect } from 'react';

const activeTables = {};
const currentCell = {
  colDataKey: undefined,
  ele: undefined,
  id: undefined,
  rowIndex: undefined,
  tableID: undefined,
};

// Specific types of input elements have different focus behavior - i.e. dropdowns
// This is a helper function to fetch the right DOM ref
const getElementRef = (id) => {
  let ref = document.getElementById(id);
  if (!ref) { return undefined; }
  if (ref.attributes.inputtype) {
    const refType = ref.attributes.inputtype.nodeValue;
    if (refType === 'dropdown') {
      ref = ref.previousElementSibling;
    }
  }
  return ref;
};

const cursorStartOrEnd = (e, step) => {
  // Ensure props exist
  if (typeof e.selectionStart === 'number' && typeof e.selectionEnd === 'number') {
    // Ensure selection has a length of 0
    if (e.selectionStart === e.selectionEnd) {
      // If moving left and selection is at the start
      if (step < 0 && e.selectionStart === 0) {
        return true;
      }
      // If moving right and selection is at the end
      if (step > 0 && e.selectionEnd === e.value.length) {
        return true;
      }
    }
    return false;
  }
  return true;
};
const setCursorPosition = (e, step) => {
  if (typeof e.selectionStart === 'number' && typeof e.selectionEnd === 'number') {
    const newPos = step > 0 ? 0 : e.value.length;
    e.selectionStart = newPos;
    e.selectionEnd = newPos;
  }
};

const onKeyDown = (e) => {
  const moveVert = (step) => {
    const nextIndex = Number(currentCell.rowIndex) + step;
    const nextEle = getElementRef(`${currentCell.tableID}~${currentCell.colDataKey}~${nextIndex}`);
    if (nextEle) {
      nextEle.focus();
    }
  };
  const moveHor = (step) => {
    // Only switch cells if the cursor is at the beginning or ending of the input field
    if (!cursorStartOrEnd(currentCell.ele, step)) { return; }
    // Get current table columns
    const cols = activeTables[currentCell.tableID];
    if (cols) {
      let nextCol;
      let nextEle;
      // Loop until another editable cell is found, or there is nothing else on the row
      nextCol = cols.findIndex(c => c.dataKey === currentCell.colDataKey) + step;
      while (nextCol >= 0 && nextCol < cols.length && !nextEle) {
        nextEle = getElementRef(`${currentCell.tableID}~${cols[nextCol].dataKey}~${currentCell.rowIndex}`);
        nextCol += step;
      }
      // Focus next element and set the cursor to the beginning/end depending on direction
      if (nextEle) {
        nextEle.focus();
        setCursorPosition(nextEle, step);
      }
    }
  };

  switch (e.which) {
    // left - event.key = 'ArrowLeft', event.which = 37
    case 37: {
      moveHor(-1);
      break;
    }
    // right - event.key = 'ArrowRight', event.which = 39
    case 39: {
      moveHor(1);
      break;
    }
    // up - event.key = 'ArrowUp', event.which = 38
    case 38: {
      moveVert(-1);
      break;
    }
    // down - event.key = 'ArrowDown', event.which = 40
    case 40: {
      moveVert(1);
      break;
    }
    // enter - event.key = 'Enter', event.which = 13
    case 13: {
      moveVert(1);
      break;
    }
    default: {
      break;
    }
  }
};

export const setCurrentCell = (id) => {
  // If there is a previously active element, remove the event listener
  if (currentCell.ele) {
    currentCell.ele.removeEventListener('keydown', onKeyDown);
  }
  // Get cell data from the passed ID
  currentCell.id = id;
  currentCell.ele = getElementRef(id);
  [currentCell.tableID, currentCell.colDataKey, currentCell.rowIndex] = id.split('~');
  // If the cell element exists, add a keydown event listener
  if (currentCell.ele) {
    currentCell.ele.addEventListener('keydown', onKeyDown);
  }
};

// Helper hook that stores the column data for all rendered tables on a page
export const useTableNav = (tableID, columns) => {
  useEffect(() => {
    activeTables[tableID] = columns;
    return () => {
      delete activeTables[tableID];
    };
  }, [tableID, columns]);
};
