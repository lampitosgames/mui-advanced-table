import { useMemo, useEffect, useCallback } from 'react';
import useScrollbarWidth from './useScrollbarWidth.js';

const safeClamp = (val, min, max) => {
  let clampedVal = val;
  clampedVal = Math.max(clampedVal, min || 0);
  if (max) { clampedVal = Math.min(clampedVal, max); }
  return clampedVal;
};

const useTableDynamicColSizes = (columns, width, scrollbarActive = false, callback = () => {}) => {
  const [scrollbarWidth] = useScrollbarWidth();
  // Slightly modified flexbox algorithm as detailed in the official spec:
  // https://www.w3.org/TR/css-flexbox-1/#target-main-size
  const flexWidthColumns = useMemo(() => {
    const containerWidth = scrollbarActive ? width - scrollbarWidth : width;
    // Estimate remining space
    let estimatedFreeSpace = 0;
    // Loop through all columns and get flex data
    const colFlexData = columns.map((c) => {
      const colData = {
        flexBasis: c.width,
        flexGrow: c.flexGrow || 0,
        flexShrink: c.flexShrink || 0,
        frozen: false,
        maxWidth: c.maxWidth,
        minWidth: c.minWidth,
        targetMainSize: safeClamp(c.width, c.minWidth, c.maxWidth),
        violation: 0,
      };
      estimatedFreeSpace += colData.targetMainSize;
      return colData;
    });

    // Based on width estimate, determine flex factor to use
    const flexType = (containerWidth - estimatedFreeSpace) > 0 ? 'flexGrow' : 'flexShrink';
    // Freeze inflexible items and calculate actual remaining space
    let initialFreeSpace = containerWidth;
    colFlexData.forEach((c, i) => {
      if (c.flexGrow === 0 && c.flexShrink === 0) {
        // Flex factor is 0, item has fixed size
        colFlexData[i].frozen = true;
      } else if (flexType === 'flexGrow' && c.flexBasis > c.targetMainSize) {
        // Basis is bigger than clamped size. Freeze
        colFlexData[i].frozen = true;
      } else if (flexType === 'flexShrink' && c.flexBasis < c.targetMainSize) {
        // Basis smaller than clamped size. Freeze
        colFlexData[i].frozen = true;
      }
      // Subtract item size from remaining space
      initialFreeSpace -= c.frozen ? c.targetMainSize : c.flexBasis;
    });

    // While there are unfrozen flex items...
    while (!colFlexData.every(fd => fd.frozen) && containerWidth > 0) {
      let remainingSpace = containerWidth;
      let flexFactorTotal = 0;
      let scaledFactorTotal = 0;
      colFlexData.forEach((c) => {
        const nonZeroFlexBasis = c.flexBasis === 0 ? 1 : c.flexBasis;
        remainingSpace -= c.frozen ? c.targetMainSize : nonZeroFlexBasis;
        flexFactorTotal += c.frozen ? 0 : c[flexType];
        scaledFactorTotal += c.frozen ? 0 : c[flexType] * nonZeroFlexBasis;
      });
      // Detect special case where flex factors add up to below 1. In this case, use a fractional
      // amount of the available space
      if (flexFactorTotal < 1) {
        const newFreeSpace = initialFreeSpace * flexFactorTotal;
        if (newFreeSpace < remainingSpace) { remainingSpace = newFreeSpace; }
      }
      // If items need to flex to fill available space
      if (Math.abs(remainingSpace) > 0) {
        if (flexType === 'flexGrow') {
          // Use flex grow factor to scale all unfrozen items
          colFlexData.forEach((c, i) => {
            if (c.frozen) { return; }
            colFlexData[i].targetMainSize = c.flexBasis +
              (c.flexGrow / flexFactorTotal) * remainingSpace;
          });
        } else {
          // Use scaled flex shrink factor to scalle all unfrozen items
          colFlexData.forEach((c, i) => {
            if (c.frozen) { return; }
            const scaledFlexShrink = c.flexShrink * c.flexBasis;
            colFlexData[i].targetMainSize = c.flexBasis -
              (scaledFlexShrink / scaledFactorTotal) * Math.abs(remainingSpace);
          });
        }
      }
      // Fix min/max violations
      let totalViolation = 0;
      colFlexData.forEach((c, i) => {
        const clampedTarget = safeClamp(c.targetMainSize, c.minWidth, c.maxWidth);
        const sizeDiff = clampedTarget - c.targetMainSize;
        if (clampedTarget < c.targetMainSize) { colFlexData[i].violation = 1; } // max violation
        if (clampedTarget > c.targetMainSize) { colFlexData[i].violation = -1; } // min violation
        colFlexData[i].targetMainSize = clampedTarget;
        totalViolation += sizeDiff;
      });
      // Freeze over-flexed items
      if (totalViolation === 0) {
        colFlexData.forEach((c, i) => { colFlexData[i].frozen = true; });
      } else if (totalViolation > 0) {
        colFlexData.forEach((c, i) => {
          if (c.violation === -1) { colFlexData[i].frozen = true; }
        });
      } else if (totalViolation < 0) {
        colFlexData.forEach((c, i) => {
          if (c.violation === 1) { colFlexData[i].frozen = true; }
        });
      }
    }
    return columns.map((c, i) => ({ ...c, calculatedWidth: colFlexData[i].targetMainSize }));
  }, [columns, width, scrollbarWidth, scrollbarActive]);
  const getColumnWidth = useCallback(i => flexWidthColumns[i].calculatedWidth, [flexWidthColumns]);

  useEffect(() => {
    callback();
  }, [callback, flexWidthColumns]);

  return [flexWidthColumns, getColumnWidth];
};

export default useTableDynamicColSizes;