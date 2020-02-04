import {
  getZonesDuck,
  getFormatsDuck,
  getTemplatesDuck,
  lineItemBundleDuck,
} from '../shared/ducks';

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── FORMATS ────────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

const formatsFeatureName = 'demandWorklowLineItemFormats';
const {
  actionCreators: formatsActionCreators,
  epics: formatsEpics,
  reducers: formatsReducers,
  useIsFormatsDuckStoreRegistered,
  useGetAllFormats,
  useFormats,
  useResetStore: useResetFormatsDuckStore,
} = getFormatsDuck(formatsFeatureName);

export const formats = {
  featureName: formatsFeatureName,
  actionCreators: formatsActionCreators,
  epics: formatsEpics,
  reducers: formatsReducers,
  useIsFormatsDuckStoreRegistered,
  useGetAllFormats,
  useFormats,
  useResetFormatsDuckStore,
};

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── ZONES ──────────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

const zonesFeatureName = 'demandWorklowLineItemZones';
const {
  actionCreators: zonesActionCreators,
  epics: zonesEpics,
  reducers: zonesReducers,
  useIsZonesDuckStoreRegistered,
  useGetAllZones,
  useZones,
  useResetStore: useResetZonesDuckStore,
} = getZonesDuck(zonesFeatureName);

export const zones = {
  featureName: zonesFeatureName,
  actionCreators: zonesActionCreators,
  epics: zonesEpics,
  reducers: zonesReducers,
  useIsZonesDuckStoreRegistered,
  useGetAllZones,
  useZones,
  useResetZonesDuckStore,
};

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── TEMPLATES ──────────────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

const templatesFeatureName = 'demandWorklowLineItemTemplates';
const {
  actionCreators: templatesActionCreators,
  epics: templatesEpics,
  reducers: templatesReducers,
  useIsTemplatesDuckStoreRegistered,
  useGetAllTemplates,
  useTemplates,
  useResetStore: useResetTemplatesDuckStore,
} = getTemplatesDuck(templatesFeatureName);

export const templates = {
  featureName: templatesFeatureName,
  actionCreators: templatesActionCreators,
  epics: templatesEpics,
  reducers: templatesReducers,
  useIsTemplatesDuckStoreRegistered,
  useGetAllTemplates,
  useTemplates,
  useResetTemplatesDuckStore,
};

// ────────────────────────────────────────────────────────────────────────────────
//
// ─── LINE ITEM BUNDLE ───────────────────────────────────────────────────────────
//
// ────────────────────────────────────────────────────────────────────────────────

const lineItemBundleFeatureName = 'demandWorkflowLineItemBundle';

const {
  actionCreators: lineItemBundleActionCreators,
  epics: lineItemBundleEpics,
  reducers: lineItemBundleReducers,
  useIsLineItemBundleDuckStoreRegistered,
  useGetLineItemBundle,
  useUpdateLineItemBundle,
  useLineItemBundle,
  useResetStore: useResetLineItemBundleDuckStore,
} = lineItemBundleDuck(lineItemBundleFeatureName);

export const lineItemBundle = {
  featureName: lineItemBundleFeatureName,
  actionCreators: lineItemBundleActionCreators,
  epics: lineItemBundleEpics,
  reducers: lineItemBundleReducers,
  useIsLineItemBundleDuckStoreRegistered,
  useGetLineItemBundle,
  useUpdateLineItemBundle,
  useLineItemBundle,
  useResetLineItemBundleDuckStore,
};
