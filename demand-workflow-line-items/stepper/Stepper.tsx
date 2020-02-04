import * as React from 'react';

import './Stepper.css';

interface Props {
  label: string;
  last?: boolean;
  stepNumber: number;
}

function Step({ label, last, stepNumber }: Props) {
  const classSeparator = last ? 'step-separator-last' : 'step-separator';

  return (
    <div className="step-wrapper">
      <div className="step">
        <div className="step-button">
          <div className={classSeparator} />
          <div className="step-number">
            <span>{stepNumber}</span>
          </div>
        </div>
        <p>{label}</p>
      </div>
    </div>
  );
}

function Stepper() {
  return (
    <div className="stepper-wrapper">
      <demeter-container>
        <div className="stepper">
          <Step stepNumber={1} label="Name, budget & period" />
          <Step stepNumber={2} label="Retailers" />
          <Step stepNumber={3} label="Products" />
          <Step stepNumber={4} label="Zones" />
          <Step stepNumber={5} label="Formats" />
          <Step stepNumber={6} label="Targeting" last />
        </div>
      </demeter-container>
    </div>
  );
}

export default Stepper;
