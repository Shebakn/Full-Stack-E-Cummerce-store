// src/common/hooks/useNearestCenters.ts

import { useQuery } from "@tanstack/react-query";
import { getDeliveryCenters } from "../services/delivery-center.service";

export const useNearestCenters = (lat?: number, lng?: number) => {
  return useQuery({
    queryKey: ["nearest-centers", lat, lng],
    queryFn: () =>
      getDeliveryCenters({
        lat,
        lng,
      }),

    enabled: !!lat && !!lng,

    staleTime: 1000 * 60 * 5,
  });
};