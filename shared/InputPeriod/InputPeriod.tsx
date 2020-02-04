import * as React from 'react';
import Calendar from 'react-calendar';

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── DEPENDENCIES ───────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

function formatDate(date?: Date) {
  if (!date) {
    return '';
  }

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function hasClickedOn($clicked: Node & ParentNode, $boundary: Node) {
  do {
    if ($clicked === $boundary) {
      return true;
    }

    // @ts-ignore
    $clicked = $clicked.parentNode;
  } while ($clicked);

  return false;
}


interface OnFocusProps {
  identifier: string;
  onFocus: () => void;
  onBlur: (event: Event) => void;
  ref: React.RefObject<HTMLDivElement>;
}

function useOnFocus({ identifier, onFocus, onBlur, ref }: OnFocusProps) {
  const inputRef = React.useRef(null);
  const callbackFocus = () => {
    onFocus();
  };
  const callbackBlur = (event: Event) => {
    const $target = event.target!;

    // @ts-ignore
    if (!hasClickedOn($target, ref.current)) {
      onBlur(event);
    }
  };

  React.useEffect(() => {
    // @ts-ignore
    inputRef.current = document
      .querySelector("demeter-input-text[identifier='" + identifier + "']")
      .querySelector('input');
  }, [ref.current]);

  React.useEffect(() => {
    if (inputRef.current) {
      // @ts-ignore
      inputRef.current.addEventListener('focus', callbackFocus);
    }
    document.addEventListener('click', callbackBlur);

    return () => {
      if (inputRef.current) {
        // @ts-ignore
        inputRef.current.removeEventListener('focus', callbackFocus);
      }
      document.removeEventListener('click', callbackBlur);
    };
  }, [inputRef.current]);
}

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── INPUT PERIOD COMPONENT ─────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

interface InputPeriodProps {
  startDate: Date,
  endDate: Date,
  onChange: (range: [Date, Date]) => void,
}

function InputPeriod(props: InputPeriodProps) {
  const ref = React.useRef(null);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const classFocus = isCalendarOpen ? 'input-period active' : 'input-period';

  useOnFocus({
    ref,
    identifier: 'startDate',
    onFocus: onFocus,
    onBlur: onBlur,
  });

  useOnFocus({
    ref,
    identifier: 'endDate',
    onFocus: onFocus,
    onBlur: onBlur,
  });

  function onFocus() {
    setIsCalendarOpen(true);
  }

  function onBlur() {
    setIsCalendarOpen(false);
  }

  function onChange(rangeDate: [Date, Date]) {

    props.onChange(rangeDate);

  }

  return (
    <div className={classFocus} ref={ref}>
      <div className="date">
        <demeter-input-text
          identifier="startDate"
          label="Period"
          value={formatDate(props.startDate)}
        />
      </div>
      <i className="fal fa-arrow-right" />
      <div className="date">
        <demeter-input-text
          identifier="endDate"
          value={formatDate(props.endDate)}
        />
      </div>
      <Calendar
        selectRange
        value={[props.startDate, props.endDate]}
        onChange={onChange}
      />
    </div>
  );
}

export { InputPeriod };
