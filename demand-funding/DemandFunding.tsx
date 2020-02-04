import * as React from 'react';

import LoadedComponent from '../shared/LoadedComponent';

const DemandFundingView = () => <div>Demand Funding</div>;

class DemandFunding extends LoadedComponent<{}, {}> {
  static defaultProps = {
    renderProps: () => <DemandFundingView />,
  };
}

export default DemandFunding;
