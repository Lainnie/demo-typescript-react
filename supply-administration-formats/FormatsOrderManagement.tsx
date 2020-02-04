import * as React from 'react';
import { RiseSVC } from 'olympus-anesidora';
import Switch from './Switch';

const FormatsOrderManagement = ({ formats }: { formats: RiseSVC.ZoneFormat[] }) => {
  const [showOrderManagement, setShowOrderManagement] = React.useState(false);
  return (
    <div className="order-management">
      <Switch
        label="Display order management"
        active={showOrderManagement}
        handleClick={() => setShowOrderManagement(!showOrderManagement)}
      />
      {showOrderManagement && (
        <div className="order-management_formats">
          <p>You can change format priority order here. Drag and drop formats to re-order.</p>
          <div>
            <demeter-cartridge-group mode="dragndrop">
              {formats
                .sort((a, b) => a.display_weight - b.display_weight)
                .map(format =>
                  <demeter-cartridge-item
                    key={format.id}
                    id={format.id}
                    label={format.format_id}
                    value={format.display_weight}
                  />
                )}
            </demeter-cartridge-group>
          </div>
        </div>
      )}
    </div>
  )
};

export default FormatsOrderManagement;