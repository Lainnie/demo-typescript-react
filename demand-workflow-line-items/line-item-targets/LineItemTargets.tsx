import * as _ from 'lodash';
import * as React from 'react';

import {
  Dropdown,
  DropdownAttrMode,
  DropdownItemBaseProps,
} from '../../shared/Dropdown';
import { useContainerLabelStepper } from '../../shared/use';

import './LineItemTargets.css';
import { LineItemSectionProps } from '../../demand-workflow-line-items/CommonDemandWorkflowLineItem';

interface Target {
  id: string;
  name: string;
}

interface LineItemTargetsProps extends LineItemSectionProps {
  targetList?: Target[];
}

const defaultTargetList = [
  {
    id: '1551976475946',
    name: 'Segments',
  },
  { id: '15519764759423', name: 'Add to basket' },
];

function LineItemTargets({ targetList = defaultTargetList, updateFieldState }: LineItemTargetsProps) {
  const ref = React.useRef(null);
  const [targetSelectedList, setTargetSelectedList] = React.useState(
    [] as DropdownItemBaseProps<Target>[]
  );
  const ContainerStepper = useContainerLabelStepper('Targeting', 6);

  React.useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      ref.current.addEventListener(
        'demeter-cartridge-item-deleted-group-inform',
        onDeleteTarget
      );
    }

    return () => {
      // @ts-ignore
      ref.current.removeEventListener(
        'demeter-cartridge-item-deleted-group-inform',
        onDeleteTarget
      );
    };
  }, []);

  function onDeleteTarget(deletedTarget: CustomEvent) {
    setTargetSelectedList(state => {
      return _.filter(state, target => {
        return +target.id !== +deletedTarget.detail.value;
      });
    });
  }

  function onTargetSelected(newTarget: DropdownItemBaseProps<Target>) {
    setTargetSelectedList(state => {
      return [...state, newTarget];
    });
  }

  function getTargetList() {
    return _.chain(targetList)
      .filter(target => {
        return !_.find(
          targetSelectedList,
          selected => selected.id === target.id
        );
      })
      .map(target => ({
        datum: target,
        id: target.id,
        label: target.name,
      }))
      .value();
  }

  function displayTargets() {
    return _.map(targetSelectedList, target => (
      <div className="cartridge-item" key={`target-item-${target.id}`}>
        <demeter-cartridge-item
          key={target.id}
          id={target.id}
          label={target.label}
          value={target.id}
        >
          <demeter-input-text identifier="" />
        </demeter-cartridge-item>
      </div>
    ));
  }

  return (
    <demeter-container class="line-item-targets" label="Targeting" ref={ref}>
      <div className="inputs">
        <Dropdown
          identifier="currentTarget"
          mode={DropdownAttrMode.FORM}
          label="Targets list"
          disabled={false}
          noValueMessage="Select a target"
          itemList={getTargetList()}
          loading={!targetList || targetList.length < 1}
          loadingMessage="Loading targets"
          helper={'Select targeting and setup parameters.'}
          onChange={onTargetSelected}
        />
      </div>

      <div className="targets">{displayTargets()}</div>

      <ContainerStepper />
      <p className="description" slot="description">
        Select the targeting to apply on this line item.
      </p>
    </demeter-container>
  );
}

export default LineItemTargets;
