import api from "./client";

export interface ComplianceItem {
  id: string;
  name: string;
  category: string;
  issued_date: string;
  expiry_date: string;
  status: string;
  issuing_authority: string;
  reference_number: string;
  notes: string;
}

export async function fetchCompliance(): Promise<ComplianceItem[]> {
  const { data } = await api.get("/compliance");
  return data;
}
