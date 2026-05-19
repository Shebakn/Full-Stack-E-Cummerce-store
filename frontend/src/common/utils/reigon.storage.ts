const REGION_KEY = "selected_region";

export const setSelectedRegion = (region: any) => {
  localStorage.setItem(REGION_KEY, JSON.stringify(region));
};

export const getSelectedRegion = () => {
  const data = localStorage.getItem(REGION_KEY);
  return data ? JSON.parse(data) : null;
};

export const removeSelectedRegion = () => {
  localStorage.removeItem(REGION_KEY);
};