import { RiseSVC } from "olympus-anesidora";

type GetCategoriesAndGroupsFromRetailersOutput = {
  categoryIds: string[],
  groupIds: string[],
};
export function getCategoryIdsAndGroupIdsFromRetailers(retailerList: RiseSVC.Retailer[]) {
  return retailerList.reduce((output: GetCategoriesAndGroupsFromRetailersOutput, retailer) => {
    let tmpOutput = { ...output };

    // Get all categories
    if (retailer.categories && retailer.categories.length) {
      for (const catId of retailer.categories) {
        if (!tmpOutput.categoryIds.includes(catId)) {
          tmpOutput = {
            ...tmpOutput,
            categoryIds: [
              ...tmpOutput.categoryIds,
              catId,
            ],
          };
        }
      }
    }

    // Add group_id if it present
    if (retailer.group_id && !tmpOutput.groupIds.includes(retailer.group_id!)) {
      tmpOutput = {
        ...tmpOutput,
        groupIds: [
          ...tmpOutput.groupIds,
          retailer.group_id,
        ],
      };
    }

    return tmpOutput;
  }, {
    categoryIds: [],
    groupIds: [],
  });
}