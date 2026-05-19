const COUNTRY_KEY = "selected_country";

export const setSelectedCountry = (country: any) => {
  localStorage.setItem(COUNTRY_KEY, JSON.stringify(country));
};

export const getSelectedCountry = () => {
  const data = localStorage.getItem(COUNTRY_KEY);
  return data ? JSON.parse(data) : null;
};

export const removeSelectedCountry = () => {
  localStorage.removeItem(COUNTRY_KEY);
};