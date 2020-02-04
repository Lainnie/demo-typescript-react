import * as React from 'react';

import { BrandsSVC } from 'olympus-anesidora';

import { CampaignFormError, FieldsForm } from '../demand/form/useCampaignForm';

import { useSelectCountry, useSelectBrands } from './use';

import './CampaignEdit.css';

interface Props {
  brandList: BrandsSVC.Brand[];
  campaignActions: { clear: Function; update: Function };
  campaignForm: FieldsForm;
  campaignErrors: Partial<CampaignFormError>;
  refEl: React.RefObject<HTMLElement>;
}

function CampaignEdit({
  brandList,
  campaignActions,
  campaignErrors,
  campaignForm,
  refEl,
}: Props) {
  const { selectedCountry, SelectCountry } = useSelectCountry({ brandList });
  const { getCartridgeBrands, SelectBrands } = useSelectBrands({
    brandList,
    campaignActions,
    refEl,
    selectedCountry,
  });

  return (
    <demeter-container class="campaign-form" label="General">
      <p className="description" slot="description">
        Define campaign informations to enable line items creation.
      </p>
      <div className="inputs">
        <SelectCountry errorMessage={campaignErrors.country} />
        <SelectBrands errorMessage={campaignErrors.brands} />
        <demeter-input-text
          value={campaignForm.global_budget}
          identifier="global_budget"
          label="Global Budget"
          error={campaignErrors.global_budget}
        />
        <demeter-input-text
          value={campaignForm.name}
          identifier="name"
          error={campaignErrors.name}
          label="Name"
        />
        <div className="demeter-cartridge-group">{getCartridgeBrands()}</div>
      </div>
    </demeter-container>
  );
}

export default CampaignEdit;
