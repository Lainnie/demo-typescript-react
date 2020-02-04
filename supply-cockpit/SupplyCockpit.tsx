import * as React from 'react';
import { reducers } from './core';
import LoadedComponent from '../shared/LoadedComponent';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';
import Content from '../shared/Areas/Content';
import Title from '../shared/Areas/Title';
import supplyRetailerCockpitMockup from './mockups/supplyRetailer';
import supplySalesHouseCockpitMockup from './mockups/supplySalesHouse';
import { useCurrentUser, useBusinessEntity } from '../authent/core';
import { useRetailerHeader } from '../supply/core';

const getCockpitMockup = (businessEntity?: string) => {
  switch (businessEntity) {
    case 'retailer':
      return supplyRetailerCockpitMockup;
    case 'sales_house':
      return supplySalesHouseCockpitMockup;
    default:
      return supplyRetailerCockpitMockup;
  }
};

const SupplyCockpitVew = ({
  user = useCurrentUser(),
  businessEntity = useBusinessEntity(),
}) => {
  const { Header } = useRetailerHeader(true);
  return (
    <AthenaDocumentTitle pageName="Supply Cockpit">
      <>
        <Content
          contentClass="supply-cockpit"
          headerChildren={() => <Header rightMenu={false} />}
          contentChildren={() => (
            <>
              <Title>
                Welcome {user.firstname} {user.lastname}
              </Title>
              <img
                src={getCockpitMockup(businessEntity)}
                alt={`cockpit ${businessEntity}`}
              />
            </>
          )}
        />
      </>
    </AthenaDocumentTitle>
  );
};

interface PropsView {}

interface Props {}

const registerReducers = () => {
  document.dispatchEvent(
    new CustomEvent('register-reducers', {
      detail: { value: reducers, identifier: 'demandCockpit' },
    })
  );
};

class SupplyCockpit extends LoadedComponent<Props, {}> {
  static defaultProps = {
    registerReducers,
    renderProps: (props: PropsView) => <SupplyCockpitVew {...props} />,
  };
}

export default SupplyCockpit;
