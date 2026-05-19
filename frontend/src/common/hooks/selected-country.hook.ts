import { useState, useEffect } from "react";
import {
  setSelectedCountry,
  getSelectedCountry,
  removeSelectedCountry,
} from "../utils/country-storage";

export const useSelectedCountry = () => {
  const [country, setCountryState] = useState<any>(null);

  useEffect(() => {
    const saved = getSelectedCountry();
    if (saved) setCountryState(saved);
  }, []);

  const selectCountry = (data: any) => {
    setCountryState(data);
    setSelectedCountry(data);
  };

  const clearCountry = () => {
    setCountryState(null);
    removeSelectedCountry();
  };

  return {
    country,
    selectCountry,
    clearCountry,
  };
};