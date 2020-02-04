import * as React from 'react';
import LoadedComponent from '../shared/LoadedComponent';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';
import Content from '../shared/Areas/Content';
import Title from '../shared/Areas/Title';

const SupplyReportsView = () => (
  <AthenaDocumentTitle pageName="Supply Reports">
    <>
      <Content
        contentClass="supply-reports"
        contentChildren={() => <Title>Supply Reports</Title>}
      />
    </>
  </AthenaDocumentTitle>
);

class SupplyReports extends LoadedComponent<{}, {}> {
  static defaultProps = {
    renderProps: () => <SupplyReportsView />,
  };
}

export default SupplyReports;
