import { useMemo } from 'react';

const useTableWrappedInputActions = (columns, forceUpdate, header, footer) => {
  const wrappedActionColumns = useMemo(() => columns.map((c) => {
    const {
      dataKey,
      inputAction,
      totalable,
    } = c;
    let inputActionOverride = inputAction;
    if (inputAction) {
      inputActionOverride = (...args) => {
        // Fire input action immediately, but async so the UI doesn't lag
        setTimeout(() => {
          inputAction(...args);
          if (!!footer && totalable) { footer.current.recalculateColumnTotal(dataKey); }
          forceUpdate({});
        }, 0);
      };
    }
    return { ...c, inputAction: inputActionOverride, rawInputAction: inputAction };
  }), [columns, footer, forceUpdate]);

  return wrappedActionColumns;
};

export default useTableWrappedInputActions;
