import { useState, useEffect } from 'react';

const useScrollbarWidth = () => {
  const [scrollWidth, setScrollWidth] = useState(0);
  useEffect(() => {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width: 100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(scrollDiv);
    setScrollWidth(scrollDiv.offsetWidth - scrollDiv.clientWidth);
    document.body.removeChild(scrollDiv);
  }, [setScrollWidth]);
  return [scrollWidth];
};

export default useScrollbarWidth;
