import * as React from 'react';
import * as _ from 'lodash';

import { useEvent, useValidationPanel } from '../use';
import { useMappedState } from 'redux-react-hook';
import { setValidationPanelOpen } from './useValidationPanel';

type OnRequestSuccessItem1<ReqSucc> = (data: ReqSucc | undefined) => void;
type OnRequestSuccessItem2<ReqSucc> = ReqSucc;

export type OnRequestSuccessProp<ReqSucc> = [
  OnRequestSuccessItem1<ReqSucc>,
  OnRequestSuccessItem2<ReqSucc>
];

type OnCancelPropItem1<Cancel> = (data: Cancel | undefined) => void;
type OnCancelPropItem2<Cancel> = Cancel;

export type OnCancelProp<Cancel> = [
  OnCancelPropItem1<Cancel>,
  OnCancelPropItem2<Cancel>
];

export interface ValidationProps<ReqSucc, Cancel> {
  requestReady: boolean;
  handlerAction: () => void;
  requestInProgress: boolean;
  request: string;
  texts: {
    fire: string;
    succeeded: string;
    failed: string;
  };
  messages?: {
    succeeded?: string;
    failed?: string;
  };
  onCancel?: OnCancelProp<Cancel>;
  onRequestSuccess?: OnRequestSuccessProp<ReqSucc>;
}

export function useValidation<ReqSucc = any, Cancel = any>({
  handlerAction,
  requestReady,
  requestInProgress,
  request,
  texts,
  messages,
  onCancel,
  onRequestSuccess,
}: ValidationProps<ReqSucc, Cancel>) {
  const refEl = React.useRef(null);
  const [validationComponent, setValidationComponent] = React.useState(() =>
    validationChildren({ button: <button />, message: null })
  );
  const { setValidationPanel, validation } = useValidationPanel();

  const validationAction = validationChildren({
    button: (
      <demeter-button
        identifier="action-fire"
        mode="primary"
        size="M"
        spinner={requestInProgress}
      >
        {texts.fire}
      </demeter-button>
    ),
    message: requestInProgress && <p>Request in progress</p>,
  });

  const validationActionSucceed = validationChildren({
    button: (
      <demeter-button
        identifier="action-succeeded"
        mode="primary"
        size="M"
        disabled
      >
        {texts.succeeded}
      </demeter-button>
    ),
    message: _.get(messages, 'succeeded', null),
  });

  const validationActionFailed = validationChildren({
    button: (
      <demeter-button identifier="action-failed" mode="primary" size="M">
        {texts.failed}
      </demeter-button>
    ),
    message: _.get(messages, 'failed', null),
  });

  const cancelButton = onCancel ? (
    <demeter-button
      size="M"
      mode="secondary"
      identifier="validation-cancel"
      onClick={React.useCallback(() => {
        onCancel[0](onCancel[1]);
      }, [onCancel[1]])}
    >
      Cancel
    </demeter-button>
  ) : null;

  useEvent({
    onHandler: handlerAction,
    refEl,
    selector: '.inner-validation demeter-button[identifier*="action"]',
    rebind: [validation, validationComponent],
  });

  React.useEffect(() => {
    if (request === 'succeed') {
      setValidationComponent(() => validationActionSucceed);
      if (onRequestSuccess && onRequestSuccess.length) {
        onRequestSuccess[0](onRequestSuccess[1]);
      }
    } else if (request === 'failed') {
      setValidationComponent(() => validationActionFailed);
    } else {
      setValidationComponent(() => validationAction);
    }
  }, [requestInProgress, request]);

  React.useEffect(() => {
    setValidationPanel(requestReady);
  }, [requestReady]);

  function validationChildren({
    button,
    message = null,
  }: {
    button: React.ReactNode;
    message: React.ReactNode;
  }) {
    return function() {
      return (
        <div className="inner-validation" ref={refEl}>
          {cancelButton}
          <div style={{ paddingRight: '14px' }}>{message}</div>
          {button}
        </div>
      );
    };
  }

  return validationComponent;
}

type GetRequestOutput = 'fire' | 'succeed' | 'failed';

const requestNormalizer: { [request in GetRequestOutput]: string } = {
  fire: 'fire',
  succeed: 'succeeded',
  failed: 'failed',
};

// Same as useValidation but as a FunctionalComponent
export class Validation<ReqSucc, Cancel> extends React.PureComponent<
  ValidationProps<ReqSucc, Cancel>
> {
  componentDidUpdate(prevProps: ValidationProps<ReqSucc, Cancel>) {
    if (prevProps.requestReady !== this.props.requestReady) {
      setValidationPanelOpen(this.props.requestReady);
    }
    if (
      this.props.onRequestSuccess &&
      prevProps.request !== this.props.request &&
      this.props.request === 'succeed'
    ) {
      this.props.onRequestSuccess[0](this.props.onRequestSuccess[1]);
    }
  }

  handleOnCancelClick = () => {
    this.props.onCancel![0](this.props.onCancel![1]);
  };

  renderCancelButton() {
    if (this.props.onCancel) {
      return (
        <demeter-button
          size="M"
          mode="secondary"
          identifier="validation-cancel"
          onClick={this.handleOnCancelClick}
        >
          Cancel
        </demeter-button>
      );
    }
    return null;
  }

  renderMessage() {
    return (
      <div style={{ paddingRight: '14px' }}>
        {this.props.requestInProgress
          ? 'Request in progress'
          : _.get(this.props.messages, [requestNormalizer[this.getRequest()]])
        }
      </div>
    );
  }

  getRequest(): GetRequestOutput {
    return (this.props.request as GetRequestOutput) || 'fire';
  }

  handleOnMainActionButtonClick = () => {
    if (this.getRequest() !== 'succeed') {
      this.props.handlerAction();
    }
  };

  getMainActionButtonProps() {
    return {
      mode: 'primary',
      size: 'M',
      identifier: `action-${this.getRequest()}`,
      disabled: this.props.request === 'succeed',
      spinner: this.props.requestInProgress,
      onClick: this.handleOnMainActionButtonClick,
    };
  }

  getMainActionButtonText() {
    // @ts-ignore
    return this.props.texts[requestNormalizer[this.getRequest()]];
  }

  renderMainActionButton() {
    return (
      <demeter-button {...this.getMainActionButtonProps()}>
        {this.getMainActionButtonText()}
      </demeter-button>
    );
  }

  render() {
    return (
      <div className="inner-validation">
        {this.renderCancelButton()}
        {this.renderMessage()}
        {this.renderMainActionButton()}
      </div>
    );
  }
}
