import * as React from 'react';

function useContainerLabelStepper(label: string, step: number) {
  return () => (
    <div className="demeter-container-label-stepper" slot="label">
      <div className="step-number">
        <span>{step}</span>
      </div>
      {label}
    </div>
  );
}

export default useContainerLabelStepper;
