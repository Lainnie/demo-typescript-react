import * as React from 'react';

import { BrandsSVC } from 'olympus-anesidora';

import {
  CampaignFormError,
  FieldsForm,
} from '../../demand/form/useCampaignForm';

import { useSelectCountry, useSelectBrands } from './';

import '../CampaignEdit.css';

interface Props {
  campaignForm: FieldsForm;
  campaignErrors: Partial<CampaignFormError>;
  getCartridgeBrands: () => React.ReactNode;
  mode: 'create' | 'update';
  SelectCountry: ({
    errorMessage,
    disabled,
  }: {
    errorMessage?: string;
    disabled: boolean;
  }) => JSX.Element;
  SelectBrands: ({
    errorMessage,
    disabled,
  }: {
    errorMessage?: string;
    disabled: boolean;
  }) => JSX.Element;
}

interface UseProps {
  brandList: BrandsSVC.Brand[];
  campaignActions: { clear: Function; update: Function };
  campaignErrors: Partial<CampaignFormError>;
  campaignForm: FieldsForm;
  mode: 'create' | 'update';
  refEl: React.RefObject<HTMLElement>;
}

function CampaignEdit({
  campaignErrors,
  campaignForm,
  mode,
  getCartridgeBrands,
  SelectBrands,
  SelectCountry,
}: Props) {
  return (
    <demeter-container class="campaign-form" label="General">
      <p className="description" slot="description">
        Define campaign informations to enable line items creation.
      </p>
      <div className="inputs">
        <SelectCountry
          errorMessage={campaignErrors.country}
          disabled={mode === 'update'}
        />
        <SelectBrands
          errorMessage={campaignErrors.brands}
          disabled={mode === 'update'}
        />
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

function useCampaignEdit({
  brandList,
  campaignActions,
  campaignErrors,
  campaignForm,
  mode = 'create',
  refEl,
}: UseProps) {
  const { selectedCountry, ...countryProps } = useSelectCountry({ brandList });

  const props = {
    mode,
    campaignForm,
    campaignErrors,
    selectedCountry,
    ...countryProps,
    ...useSelectBrands({
      brandList,
      campaignActions,
      refEl,
      selectedCountry,
    }),
  };

  return {
    renderCampaignEdit: () => <CampaignEdit {...props} />,
    ...props,
  };
}

export default useCampaignEdit;
