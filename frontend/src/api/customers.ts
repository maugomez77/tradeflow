import api from "./client";
import type { Job } from "./dashboard";

export interface Customer {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  total_spent: number;
  job_count: number;
  last_service: string | null;
  notes: string;
}

export interface CustomerDetail {
  customer: Customer;
  jobs: Job[];
}

export async function fetchCustomers(): Promise<Customer[]> {
  const { data } = await api.get("/customers");
  return data;
}

export async function fetchCustomerDetail(id: string): Promise<CustomerDetail> {
  const { data } = await api.get(`/customers/${id}`);
  return data;
}
