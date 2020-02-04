import { RouteComponentEnhancer } from "./enhanceRouteComponent";

type Mode = 'create'|'edit';

export interface WithFormModeProps {
  formMode: Mode
}

export const withFormMode = (mode: Mode): RouteComponentEnhancer => (routeComponentProps): WithFormModeProps => ({
  formMode: mode,
});