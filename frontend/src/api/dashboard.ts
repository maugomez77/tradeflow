import api from "./client";

export interface RevenueData {
  month: string;
  revenue: number;
  jobs_completed: number;
}

export interface JobsByStatus {
  scheduled: number;
  in_progress: number;
  completed: number;
  invoiced: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  total_spent: number;
  job_count: number;
}

export interface EquipmentAlert {
  id: string;
  name: string;
  health_score: number;
  next_service: string;
  status: string;
}

export interface ComplianceDeadline {
  id: string;
  name: string;
  category: string;
  expiry_date: string;
  status: string;
}

export interface Job {
  id: string;
  title: string;
  customer_id: string;
  customer_name: string;
  type: string;
  status: string;
  technician_id: string;
  technician_name: string;
  address: string;
  description: string;
  scheduled_date: string;
  completed_date: string | null;
  estimated_cost: number;
  actual_cost: number | null;
  notes: string;
}

export interface DashboardMetrics {
  total_revenue: number;
  active_jobs: number;
  equipment_health_avg: number;
  compliance_score: number;
  revenue_by_month: RevenueData[];
  jobs_by_status: JobsByStatus;
  recent_jobs: Job[];
  top_customers: TopCustomer[];
  equipment_alerts: EquipmentAlert[];
  compliance_deadlines: ComplianceDeadline[];
}

export async function fetchDashboard(): Promise<DashboardMetrics> {
  const { data } = await api.get("/dashboard");
  return data;
}
