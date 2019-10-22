import { useState, useEffect, useCallback } from 'react';

const useTableInputValidation = (initialData, validators) => {
  const [validationState, setValidationState] = useState({
    formattedVal: initialData,
    isError: false,
    rawVal: initialData,
  });

  const setIsError = newVal => setValidationState(prev => ({ ...prev, isError: newVal }));
  const onValueChange = useCallback((newVal) => {
    const newState = { formattedVal: newVal, rawVal: newVal, isError: false };
    if (validators) {
      validators.forEach((v) => {
        if (newState.isError) { return; } // Skip additional validators if an error is found
        const [vToStore, vToDisp, vErr] = v(newState.rawVal);
        newState.isError = newState.isError || vErr;
        newState.formattedVal = vToDisp;
        newState.rawVal = vToStore;
      });
    }
    if (newState.isError) {
      setValidationState(prev => ({ ...prev, isError: true }));
    } else {
      setValidationState(newState);
    }
  }, [validators]);

  useEffect(() => {
    if (validators) {
      onValueChange(initialData);
    } else {
      setValidationState({ formattedVal: initialData, rawVal: initialData, isError: false });
    }
  }, [initialData, validators, onValueChange]);

  return [validationState, onValueChange, setIsError];
};

export default useTableInputValidation;
