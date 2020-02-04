import { RiseSVC, CrownSVC, MeccaSVC } from 'olympus-anesidora';
import { RawZoneType, rawZoneTypes } from '../utils';
import { ZoneCheckboxState } from '../line-item-zones/utils';

export interface TemplateCheckboxState {
  /** Template id */
  id: string;
  /** Template name */
  name: string;
  /** Formats from current template */
  formats: FormatWithZoneType[];
  creative: CrownSVC.Creative | null;
  checked: boolean;
}

export interface GetFormatsSectionStateInput {
  currentState?: TemplateCheckboxState[];
  creatives?: CrownSVC.Creative[];
  zonesSectionState: ZoneCheckboxState[];
  // templateList: RiseSVC.Template[],
  formatList: RiseSVC.Format[];
}

interface FormatWithZoneType extends RiseSVC.Format {
  zone_type: MeccaSVC.Zone;
}

/**
 * Calculates the initial state of the Formats section
 * @param input - Dependencies
 */
export const getTemplatesState = (
  input: GetFormatsSectionStateInput
): TemplateCheckboxState[] => {
  // If:
  //   FormatList empty (meaning no selected retailer)
  //    OR
  //   ZonesTypes selection empty

  // Return:  Empty list
  if (
    !input.formatList.length ||
    !input.zonesSectionState.some(
      zoneCheckboxState => zoneCheckboxState.checked
    )
  ) {
    return [];
  }

  // Otherwise:
  const allFormatsWithZoneType: FormatWithZoneType[] = input.zonesSectionState
    .filter(formatWithZoneType => formatWithZoneType.checked)
    .reduce<{ zoneType: MeccaSVC.Zone; id: string }[]>(
      (res, zoneCheckboxState) => {
        let tmpRes = [...res];

        for (const formatId of zoneCheckboxState.formats) {
          if (!tmpRes.find(item => item.id === formatId)) {
            tmpRes = [
              ...tmpRes,
              { id: formatId, zoneType: zoneCheckboxState.id },
            ];
          }
        }

        return tmpRes;
      },
      []
    )
    .map(item => {
      const format = input.formatList.find(format => format.id === item.id);
      if (!format) {
        throw new Error(`Format with id="${item.id}" not found! in formatList`);
      }
      return {
        ...format,
        zone_type: item.zoneType,
      };
    });

  const allFormatsTemplates = allFormatsWithZoneType.reduce<RiseSVC.Template[]>(
    (res, format) => {
      let tmpRes = [...res];
      if (!tmpRes.find(template => template!.id === format!.template!.id)) {
        tmpRes = [...tmpRes, { ...format!.template! }];
      }
      return tmpRes;
    },
    []
  );

  const state: TemplateCheckboxState[] = allFormatsTemplates.map(
    (template): TemplateCheckboxState => {
      const templatePreviousState = input.currentState
        ? input.currentState.find(
            templateCheckboxState => templateCheckboxState.id === template.id
          )
        : null;

      const templateFormats = allFormatsWithZoneType.filter(
        formatWithZoneType => formatWithZoneType.template!.id === template.id
      );

      // If previously checked and newly listed, give it back its previous checked state
      let isTemplateChecked = templatePreviousState
        ? templatePreviousState.checked
        : false;

      let creative = templatePreviousState
        ? templatePreviousState.creative
        : null;

      // If an existing Crea is asscociated to current template:
      // - Check it
      // - Asssign creative
      if (
        input.creatives &&
        input.creatives.find(crea => crea.template_id === template.id)
      ) {
        isTemplateChecked = true;
        creative = input.creatives.find(
          crea => crea.template_id === template.id
        )!;
      }

      return {
        id: template.id!,
        name: template.name,
        formats: templateFormats,
        checked: isTemplateChecked,
        creative,
      };
    }
  );

  return state;
};
