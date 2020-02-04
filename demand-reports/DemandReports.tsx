import * as React from 'react';
import LoadedComponent from '../shared/LoadedComponent';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';
import Content from '../shared/Areas/Content';
import Title from '../shared/Areas/Title';


const DemandReportsView = () =>
  <AthenaDocumentTitle pageName="Demand Reports">
    <>
      <Content
        contentClass="demand-reports"
        contentChildren={() =>
          <Title>Demand Reports</Title>
        }
      />
    </>
  </AthenaDocumentTitle>

class DemandReports extends LoadedComponent<{}, {}> {
  static defaultProps = {
    renderProps: () => <DemandReportsView />
  };
}

export default DemandReports;
