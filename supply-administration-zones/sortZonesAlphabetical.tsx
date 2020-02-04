export const sortZonesByAlphabetical = (a: any, b: any) => {
  return a.zone_type > b.zone_type ? 1 : -1;
};
