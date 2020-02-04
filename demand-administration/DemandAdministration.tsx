import * as React from 'react';
import { BrandsSVC } from 'olympus-anesidora';
import { useBrands, useGetAllBrands } from '../demand/core';
import {
  useRegisterForStore,
  useFirstItemHandlingOnListChange,
} from '../shared/use';
import { useGetBrandProductsByShelves, useBrandProductsByShelves } from './use';
import { epics, reducers } from './core';
import AthenaDocumentTitle from '../shared/components/AthenaDocumentTitle';

import './DemandAdministration.css';
import DemandAdministrationView from './DemandAdministrationView';

const DemandAdministration = () => {
  const getAllBrands = useGetAllBrands();
  const brandList = useBrands();
  const [
    currentBrand,
    setCurrentBrand,
  ] = React.useState<BrandsSVC.Brand | null>(null);

  const getBrandProductsByShelves = useGetBrandProductsByShelves();
  const brandProductsByShelves = useBrandProductsByShelves();

  React.useEffect(() => {
    useRegisterForStore({
      epics,
      identifier: 'demandAdministration',
      reducers,
    });
    getAllBrands();
    return () => {};
  }, []);

  useFirstItemHandlingOnListChange<BrandsSVC.Brand>(brandList, brand => {
    setCurrentBrand(brand);
    getBrandProductsByShelves(brand.meta_id);
  });

  return (
    <AthenaDocumentTitle pageName="Demand Administration">
      <DemandAdministrationView
        brands={brandList}
        brand={currentBrand}
        setBrand={setCurrentBrand}
        brandProductsGroupedByShelves={brandProductsByShelves}
        getBrandProductsByShelves={getBrandProductsByShelves}
      />
    </AthenaDocumentTitle>
  );
};

export default DemandAdministration;
