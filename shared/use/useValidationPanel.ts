import * as React from 'react';

export const setValidationPanelOpen = (open: unknown) => {
  if (typeof open === 'boolean') {
    document.dispatchEvent(new CustomEvent(`${open ? '' : 'de'}activate-validation`, {}));
  }
}

export function useValidationPanel() {
  const [validation, setValidation] = React.useState(null as unknown);

  React.useEffect(() => {
    setValidationPanelOpen(validation)
  }, [validation]);

  function setValidationPanel(state: boolean) {
    setValidation(state);
  }

  function openValidationPanel() {
    setValidation(true);
  }

  function closeValidationPanel() {
    setValidation(false);
  }

  function toggleValidationPanel() {
    setValidation((validationState: boolean) => !validationState);
  }

  return {
    validation,
    closeValidationPanel,
    openValidationPanel,
    setValidationPanel,
    toggleValidationPanel,
  };
}
