import { useState } from "react";
import {
  getSelectedRegion,
  setSelectedRegion,
} from "@/common/utils/region.storage";

export const useSelectedRegion = () => {
  const [region, setRegionState] = useState(getSelectedRegion());

  const setRegion = (data: any) => {
    setRegionState(data);
    setSelectedRegion(data);
  };

  const clearRegion = () => {
    setRegionState(null);
    localStorage.removeItem("selected_region");
  };

  return {
    region,
    setRegion,
    clearRegion,
  };
};