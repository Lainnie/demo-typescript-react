type Reducer = any;
type Epic = any;

interface RegisterProps {
  epics?: Epic;
  reducers?: Reducer;
  identifier: string;
}

const useRegisterForStore = ({
  epics,
  identifier,
  reducers,
}: RegisterProps) => {
  const registerReducers = (newReducers: Reducer, newIdentifier: string) => {
    document.dispatchEvent(
      new CustomEvent('register-reducers', {
        detail: { value: newReducers, identifier: newIdentifier },
      })
    );
  };

  const registerEpics = (newEpics: Epic, newIdentifier: string) => {
    document.dispatchEvent(
      new CustomEvent('register-epics', {
        detail: { value: newEpics, identifier: newIdentifier },
      })
    );
  };

  if (reducers) {
    registerReducers(reducers, identifier);
  }

  if (epics) {
    registerEpics(epics, identifier);
  }
};

export default useRegisterForStore;
