import * as _ from 'lodash';
import * as React from 'react';
import { Dropdown, DropdownItemBaseProps } from '../../shared/Dropdown';
import { BrandsSVC } from 'olympus-anesidora';

interface Country {
  id: string;
  name: string;
}

const useSelectCountry = ({ brandList }: { brandList: BrandsSVC.Brand[] }) => {
  const [selectedCountry, setSelectCountry] = React.useState('');

  function extractCountries() {
    return _.chain(brandList)
      .groupBy('country')
      .keys()
      .map((country: string) => ({
        datum: country,
        id: country,
        name: country,
      }))
      .value();
  }

  function handlerCountryChange(
    newSelectedCountry: DropdownItemBaseProps<Country>
  ) {
    setSelectCountry(newSelectedCountry.id);
  }

  function getCountryList() {
    return _.map(extractCountries(), country => ({
      datum: country,
      id: country.id,
      label: country.name,
    }));
  }

  return {
    selectedCountry,
    setSelectCountry,
    SelectCountry: ({
      errorMessage,
      disabled,
    }: {
      errorMessage?: string;
      disabled?: boolean;
    }) => (
      <Dropdown<Country>
        identifier="country"
        label="Country"
        error={errorMessage}
        noValueMessage=""
        itemList={getCountryList()}
        value={selectedCountry}
        disabled={disabled}
        onChange={handlerCountryChange}
        helper="Country must be selected to access brand selection"
      />
    ),
  };
};

export default useSelectCountry;
