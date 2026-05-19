// src/common/services/delivery-center.service.ts

import api from "@/api/client";

export interface DeliveryCenter {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  deliveryFee: number;
  etaMinutes?: number;
  regionId: string;
}

interface GetCentersParams {
  page?: number;
  limit?: number;
  regionId?: string;
  isActive?: boolean;
  lat?: number;
  lng?: number;
}

export const getDeliveryCenters = async (params?: GetCentersParams) => {
  const { data } = await api.get("/delivery-center", {
    params,
  });

  return data.data;
};