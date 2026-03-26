import api from "./client";

export interface PricingRule {
  id: string;
  name: string;
  job_type: string;
  base_rate: number;
  unit: string;
  peak_multiplier: number;
  emergency_multiplier: number;
  weekend_multiplier: number;
  seasonal_adjustment: number;
  notes: string;
}

export interface PriceCalculation {
  job_type: string;
  base_rate: number;
  hours: number;
  multiplier: number;
  multiplier_reasons: string[];
  subtotal: number;
  tax: number;
  total: number;
}

export async function fetchPricingRules(): Promise<PricingRule[]> {
  const { data } = await api.get("/pricing");
  return data;
}

export async function calculatePrice(params: {
  job_type: string;
  hours: number;
  is_emergency: boolean;
  is_weekend: boolean;
  is_peak: boolean;
}): Promise<PriceCalculation> {
  const { data } = await api.get("/pricing/calculate", { params });
  return data;
}
