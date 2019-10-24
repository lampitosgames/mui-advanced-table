import { useState, useCallback, useRef } from 'react';

const useTableRefsAndSize = () => {
  // # Outer and inner bounds of the table - used for scroll and size calculations
  const [outerBounds, setOuterBounds] = useState({ width: 1, height: 1 });
  const [innerBounds, setInnerBounds] = useState({ width: 1, height: 1 });
  const [scrollbarActive, setScrollbarActive] = useState(true);
  // # Grab refs to all needed DOM elements
  const tableRef = useRef(null);
  const bodyRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const scrollContainerRef = useCallback((r) => {
    const newRef = r;
    if (newRef) {
      newRef.onscroll = () => {
        // Whenever the user scrolls the main table, update header/footer
        if (headerRef.current) { headerRef.current.setScrollLeft(newRef.scrollLeft); }
        if (footerRef.current) { footerRef.current.setScrollLeft(newRef.scrollLeft); }
      };
      setInnerBounds({ width: newRef.scrollWidth, height: newRef.scrollHeight });
      bodyRef.current = newRef;
      setScrollbarActive(newRef.clientHeight < newRef.scrollHeight);
    }
  }, []);

  // Forces the table to clear the sizing cache
  const resetCellSizeCache = () => {
    if (tableRef.current) { tableRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0 }); }
  };
  // When the table gets resized, recompute the state that relies on width/height
  const handleResize = useCallback((newBounds) => {
    setOuterBounds(newBounds);
    resetCellSizeCache();
    if (bodyRef.current) {
      setScrollbarActive(bodyRef.current.clientHeight < bodyRef.current.scrollHeight);
      setInnerBounds({ width: bodyRef.current.scrollWidth, height: bodyRef.current.scrollHeight });
    }
  }, [bodyRef]);

  return [{
      tableRef,
      bodyRef,
      headerRef,
      footerRef,
      scrollContainerRef,
    },
    outerBounds,
    innerBounds,
    scrollbarActive,
    handleResize,
    resetCellSizeCache,
  ];
};

export default useTableRefsAndSize;