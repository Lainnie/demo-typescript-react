import * as React from 'react';
import LoadedComponent from '../shared/LoadedComponent';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';
import Content from '../shared/Areas/Content';
import Title from '../shared/Areas/Title';

const SupplyBillingView = () => (
  <AthenaDocumentTitle pageName="Supply Billing">
    <>
      <Content
        contentClass="supply-billing"
        contentChildren={() => <Title>Supply Billing</Title>}
      />
    </>
  </AthenaDocumentTitle>
);

class SupplyBilling extends LoadedComponent<{}, {}> {
  static defaultProps = {
    renderProps: () => <SupplyBillingView />,
  };
}

export default SupplyBilling;
