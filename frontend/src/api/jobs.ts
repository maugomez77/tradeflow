import api from "./client";
import type { Job } from "./dashboard";

export type { Job };

export async function fetchJobs(params?: {
  status?: string;
  technician?: string;
  type?: string;
}): Promise<Job[]> {
  const { data } = await api.get("/jobs", { params });
  return data;
}

export async function fetchJob(id: string): Promise<Job> {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
}

export async function createJob(job: {
  title: string;
  customer_id: string;
  type: string;
  technician_id: string;
  address: string;
  description: string;
  scheduled_date: string;
  estimated_cost: number;
}): Promise<Job> {
  const { data } = await api.post("/jobs", job);
  return data;
}

export async function updateJob(
  id: string,
  updates: { status?: string; actual_cost?: number; notes?: string }
): Promise<Job> {
  const { data } = await api.patch(`/jobs/${id}`, updates);
  return data;
}
