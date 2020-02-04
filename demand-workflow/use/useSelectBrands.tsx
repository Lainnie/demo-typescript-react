import * as _ from 'lodash';
import * as React from 'react';
import { BrandsSVC } from 'olympus-anesidora';
import { Dropdown, DropdownItemBaseProps } from '../../shared/Dropdown';
import { useEvent } from '../../shared/use';

const useSelectBrands = ({
  brandList,
  campaignActions,
  refEl,
  selectedCountry,
}: {
  brandList: BrandsSVC.Brand[];
  campaignActions: { clear: Function; update: Function };
  refEl: React.RefObject<HTMLElement>;
  selectedCountry: string;
}) => {
  const [selectedBrands, setSelectedBrands] = React.useState(
    [] as DropdownItemBaseProps<BrandsSVC.Brand>[]
  );
  const [cartridgeBrands, setCartridgeBrands] = React.useState([] as string[]);

  useEvent({
    eventType: 'demeter-cartridge-group-child-list-mutation',
    onHandler: handlerCartridgeChange,
    refEl,
  });

  React.useEffect(() => {
    const filteredBrands = _.filter(selectedBrands, selectedBrand =>
      _.includes(cartridgeBrands, selectedBrand.id)
    );

    setSelectedBrands(filteredBrands);
  }, [cartridgeBrands]);

  React.useEffect(() => {
    setSelectedBrands([]);
    campaignActions.update({
      country: selectedCountry,
    });
  }, [selectedCountry]);

  React.useEffect(() => {
    campaignActions.update({
      brands: _.map(selectedBrands, brand => brand.id),
    });
  }, [selectedBrands]);

  function handlerCartridgeChange(event: CustomEvent) {
    const newCartridgeBrands: string[] = event.detail.data;

    setCartridgeBrands(newCartridgeBrands);
  }

  function getBrandList() {
    const selectedBrandIds = _.map(
      selectedBrands,
      selectedBrand => selectedBrand.id
    );

    return _.chain(brandList)
      .filter(brand => !_.includes(selectedBrandIds, brand.meta_id))
      .filter(brand => brand.country === selectedCountry)
      .map(brand => ({
        datum: brand,
        id: brand.meta_id,
        label: brand.name,
      }))
      .value();
  }

  function handlerBrandsChange(
    selectedBrand: DropdownItemBaseProps<BrandsSVC.Brand>
  ) {
    setSelectedBrands([...selectedBrands, selectedBrand]);
  }

  function createHandlerBrandRemove(id: string) {
    return function handlerBrandRemove() {
      setSelectedBrands(state => {
        const filteredBrands = _.filter(state, brand => brand.id !== id);

        return filteredBrands;
      });
    };
  }

  function getCartridgeBrands() {
    return _.map(selectedBrands, selectedBrand => (
      <div className="cartridge-item" key={`brand-item-${selectedBrand.id}`}>
        <>
          <demeter-cartridge-item
            key={selectedBrand.id}
            id={selectedBrand.id}
            label={selectedBrand.label}
            value={selectedBrand.id}
          />
          <button
            className="hack-on-click"
            onClick={createHandlerBrandRemove(selectedBrand.id)}
          />
        </>
      </div>
    ));
  }

  return {
    getCartridgeBrands,
    selectedBrands,
    setSelectedBrands,
    SelectBrands: ({
      errorMessage,
      disabled,
    }: {
      errorMessage?: string;
      disabled?: boolean;
    }) => (
      <Dropdown<BrandsSVC.Brand>
        identifier="brand"
        label="Brand"
        error={errorMessage}
        noValueMessage=""
        disabled={!selectedCountry || disabled}
        itemList={getBrandList()}
        onChange={handlerBrandsChange}
        helper=" "
      />
    ),
  };
};

export default useSelectBrands;
