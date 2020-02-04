import * as _ from 'lodash';
import * as React from 'react';
import { DataTable } from '../gridata/DataTable';
import { ContentAlign } from '../gridata';
import { ZoneFormatWithFormat } from './core';
import { useEvent } from '../shared/use';

const onGridReady = () => 'none';

const FormatsTable = ({
  formats,
  handleOnDataChange,
}: {
  formats?: ZoneFormatWithFormat[];
  handleOnDataChange: Function;
}) => {
  const refEl = React.useRef(null);

  if (formats && formats.length > 0) {
    // on switch change
    useEvent({
      eventType: 'demeter-switch-change',
      onHandler: (e: CustomEvent) => {
        // send updated format to parent component
        const format = formats.find(
          format => format.id === e.detail.identifier
        );
        handleOnDataChange({ ...format, enabled: e.detail.isActive });
      },
      refEl,
    });

    return (
      <div ref={refEl}>
        <DataTable
          gridOptions={{
            columnDefs: [
              {
                field: 'name',
                headerName: 'Formats',
              },
              { field: 'activation', headerName: 'Activation' },
              {
                field: 'max_display',
                headerName: 'Max display',
                contentAlign: ContentAlign.RIGHT,
              },
            ],
            onGridReady,
            rawData: _.orderBy(formats, ['id'], ['asc']).map(format => ({
              name: _.get(format, 'format.template.name', ''),
              activation: (
                <div>
                  <demeter-switch
                    key={`${format.id}-activation`}
                    identifier={format.id}
                    active={format.enabled}
                    labeloff="Off"
                    labelon="On"
                  />
                </div>
              ),
              max_display: (
                <FormatsTableCellMaxDisplay
                  key={`${format.id}-max_display`}
                  format={format}
                  handleOnDataChange={handleOnDataChange}
                />
              ),
            })),
          }}
        />
      </div>
    );
  } else {
    return (
      <p>
        <em>No format available for this zone.</em>
      </p>
    );
  }
};

export default FormatsTable;

const FormatsTableCellMaxDisplay = ({
  format,
  handleOnDataChange,
}: {
  format: ZoneFormatWithFormat;
  handleOnDataChange: Function;
}) => {
  const refEl = React.useRef(null);
  const refInputText = React.useRef(null);
  const [maxDisplayInputValue, setMaxDisplayInputValue] = React.useState(
    format.max_display
  );

  React.useEffect(() => {
    setMaxDisplayInputValue(format.max_display);
  }, [format]);

  const handleOnInputChange = (e: CustomEvent) => {
    const inputValue = e.detail.value;
    setMaxDisplayInputValue(inputValue);
    if (inputValue && !isNaN(Number(inputValue))) {
      // send updated format to parent component
      handleOnDataChange({ ...format, max_display: Number(inputValue) });
    }
  };

  // on input change
  useEvent({
    eventType: 'demeter-input-change',
    onHandler: handleOnInputChange,
    refEl,
    rebind: [format],
  });

  return (
    <div
      ref={refEl}
      style={{ display: 'flex', width: '100%', alignItems: 'center' }}
    >
      <div style={{ flex: '1', textAlign: 'left' }}>Max display:</div>
      <div style={{ flex: '1', textAlign: 'right' }}>
        <demeter-input-text
          ref={refInputText}
          identifier={`${format.id}`}
          value={maxDisplayInputValue}
          style={{ textAlign: 'right' }}
        />
      </div>
    </div>
  );
};
