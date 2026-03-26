import api from "./client";

export interface MaintenanceRecord {
  date: string;
  description: string;
  cost: number;
  technician: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  health_score: number;
  status: string;
  last_service: string;
  next_service: string;
  purchase_date: string;
  value: number;
  assigned_to: string;
  maintenance_history: MaintenanceRecord[];
  notes: string;
}

export async function fetchEquipment(): Promise<Equipment[]> {
  const { data } = await api.get("/equipment");
  return data;
}

export async function fetchEquipmentDetail(id: string): Promise<Equipment> {
  const { data } = await api.get(`/equipment/${id}`);
  return data;
}

export async function logMaintenance(
  id: string,
  record: { description: string; cost: number; technician: string }
): Promise<Equipment> {
  const { data } = await api.post(`/equipment/${id}/maintenance`, record);
  return data;
}
