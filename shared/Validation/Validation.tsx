import * as React from 'react';
import './Validation.css';

const Validation = () => 
    <div className="inner-validation">
        <demeter-button
            class="annulation"
            size="M"
            mode="secondary"
            identifier="annulation"
        >
            Annulation
        </demeter-button>
        <demeter-button
            class="save"
            size="M"
            mode="primary"
            identifier="save"
        >
            Save Changes
        </demeter-button>
    </div>

export default Validation;