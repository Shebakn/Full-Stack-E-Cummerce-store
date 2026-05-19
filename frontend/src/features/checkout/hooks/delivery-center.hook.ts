// src/common/hooks/useDeliveryCenters.ts

import { useQuery } from "@tanstack/react-query";
import { getDeliveryCenters } from "../services/delivery-center.service";

export const DELIVERY_CENTERS_KEY = ["delivery-centers"];

export const useDeliveryCenters = (params?: {
  regionId?: string;
  lat?: number;
  lng?: number;
}) => {
  const query = useQuery({
    queryKey: [...DELIVERY_CENTERS_KEY, params],
    queryFn: () => getDeliveryCenters(params),
    enabled: !!params?.regionId || (!!params?.lat && !!params?.lng),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    select: (data) => data ?? [],
  });

  return {
    ...query,
    centers: query.data ?? [],
  };
};