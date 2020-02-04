import * as React from 'react';
import * as _ from 'lodash';
import Switch from './Switch';
import {
  Dropdown,
  DropdownAttrMode,
  DropdownItemBaseProps,
} from '../shared/Dropdown';
import { ZoneFormatWithFormat } from './core';
import { RiseSVC } from 'olympus-anesidora';

// formats pure functions

const findFormatById = (formatId: string, formats: ZoneFormatWithFormat[]) => {
  return formats.find(format => format.id === formatId);
};

const getFormatNameById = (
  formatId: string,
  formats: ZoneFormatWithFormat[]
) => {
  const format = findFormatById(formatId, formats);
  return _.get(format, 'format.template.name', null);
};

// Exclusions pure functions

const addExclusionToExclusions = (
  exclusionToAdd: Partial<RiseSVC.ZoneFormat>,
  exclusions: Partial<RiseSVC.ZoneFormat>[] = []
) => {
  const isAlreadyExcluded = exclusions.filter(
    exclusion => exclusionToAdd.id === exclusion.id
  );
  if (isAlreadyExcluded && isAlreadyExcluded.length > 0) {
    return [...exclusions];
  }
  return [...exclusions, exclusionToAdd];
};

const removeExclusionFromExclusions = (
  exclusionToRemove: Partial<RiseSVC.ZoneFormat>,
  exclusions: Partial<RiseSVC.ZoneFormat>[] = []
) => {
  return exclusions.filter(exclusion => exclusion.id !== exclusionToRemove.id);
};

// FormatsExclusions view

const FormatsExclusions = ({
  formats,
  handleOnDataChange,
}: {
  formats?: ZoneFormatWithFormat[];
  handleOnDataChange: Function;
}) => {
  if (formats && formats.length > 0) {
    const [showExclusionsPanel, setShowExclusionsPanel] = React.useState(false);
    const [format1, setFormat1] = React.useState({ id: '' });
    const [format2, setFormat2] = React.useState({ id: '' });

    const addExclusion = (
      formatId: string,
      excludedFormatId: string,
      formats: ZoneFormatWithFormat[]
    ) => {
      const format = formats.find(format => format.id === formatId);
      if (format) {
        handleOnDataChange({
          ...format,
          excluded: addExclusionToExclusions(
            { id: excludedFormatId },
            format.excluded
          ),
        });
      }
    };

    const removeExclusion = (
      formatId: string,
      exclusionId: string,
      formats: ZoneFormatWithFormat[]
    ) => {
      const format = formats.find(format => format.id === formatId);
      if (format) {
        const formatUpdated = {
          ...format,
          excluded: removeExclusionFromExclusions(
            { id: exclusionId },
            format.excluded
          ),
        };
        handleOnDataChange(formatUpdated);
      }
    };

    return (
      <div className="exclusions">
        <Switch
          label="Exclusions between formats"
          active={showExclusionsPanel}
          handleClick={isActive => setShowExclusionsPanel(isActive)}
        />
        {showExclusionsPanel && (
          <div className="exclusions__panel">
            <div className="exclusion-selector">
              <FormatSelector
                selectedFormat={format1}
                formats={formats}
                label="Format A excludes..."
                noValueMessage="Select the format A"
                onChange={(item: any) => setFormat1({ id: item.id })}
              />
              <FormatSelector
                selectedFormat={format2}
                formats={formats}
                label="...Format B and vice versa."
                noValueMessage="Select the format B"
                onChange={(item: any) => setFormat2({ id: item.id })}
              />
              <demeter-button
                identifier="button1"
                mode="secondary"
                size="L"
                onClick={() => addExclusion(format1.id, format2.id, formats)}
              >
                Add exclusion
              </demeter-button>
            </div>
            <div>
              <demeter-cartridge-group mode="deletable">
                {formats.map(
                  format =>
                    format.excluded &&
                    format.excluded.map(
                      (exclusion: Partial<RiseSVC.ZoneFormat>) => (
                        <demeter-cartridge-item
                          key={`${format.id}${exclusion.id}`}
                          id={exclusion.id}
                          value={exclusion.id}
                          label={`${_.get(
                            format,
                            'format.template.name',
                            null
                          )} can't diffuse with ${getFormatNameById(
                            exclusion.id!,
                            formats
                          )} and vice versa`}
                          onClick={() => {
                            removeExclusion(format.id!, exclusion.id!, formats);
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      )
                    )
                )}
              </demeter-cartridge-group>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default FormatsExclusions;

// react component

const FormatSelector = ({
  formats,
  label,
  selectedFormat,
  onChange,
  noValueMessage,
}: {
  formats: ZoneFormatWithFormat[];
  label: string;
  selectedFormat: Partial<RiseSVC.ZoneFormat>;
  onChange: Function;
  noValueMessage: string;
}) => {
  const getListItemFromFormat = (
    format: ZoneFormatWithFormat
  ): DropdownItemBaseProps<any> => {
    return {
      id: format.id!,
      label: _.get(format, 'format.template.name', null),
      datum: format,
    };
  };
  return (
    <div className="format-selector">
      <label>{label}</label>
      <Dropdown
        value={selectedFormat.id}
        identifier="formatsDropdown"
        mode={DropdownAttrMode.FORM}
        disabled={false}
        noValueMessage={noValueMessage}
        itemList={formats.map(format => getListItemFromFormat(format))}
        loading={!formats || formats.length < 1}
        loadingMessage="Loading formats"
        onChange={(item: any) => onChange(item)}
      />
    </div>
  );
};
