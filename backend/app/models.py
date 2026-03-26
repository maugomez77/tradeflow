"""Pydantic models for TradeFlow Intelligence."""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class JobStatus(str, Enum):
    scheduled = "scheduled"
    in_progress = "in_progress"
    completed = "completed"
    invoiced = "invoiced"


class JobType(str, Enum):
    plumbing = "plumbing"
    hvac = "hvac"
    electrical = "electrical"
    general = "general"


class CustomerType(str, Enum):
    residential = "residential"
    commercial = "commercial"


class ComplianceStatus(str, Enum):
    valid = "valid"
    expiring = "expiring"
    expired = "expired"


class EquipmentStatus(str, Enum):
    operational = "operational"
    needs_service = "needs_service"
    out_of_service = "out_of_service"


# ---- Core Models ----


class Technician(BaseModel):
    id: str
    name: str
    skills: list[str]
    hourly_rate: float
    availability: str = "available"  # available, on_job, off_duty
    phone: str = ""
    jobs_completed: int = 0


class Customer(BaseModel):
    id: str
    name: str
    type: CustomerType
    address: str
    phone: str
    email: str
    total_spent: float = 0.0
    job_count: int = 0
    last_service: Optional[date] = None
    notes: str = ""


class Job(BaseModel):
    id: str
    title: str
    customer_id: str
    customer_name: str = ""
    type: JobType
    status: JobStatus
    technician_id: str
    technician_name: str = ""
    address: str
    description: str
    scheduled_date: date
    completed_date: Optional[date] = None
    estimated_cost: float
    actual_cost: Optional[float] = None
    notes: str = ""
    created_at: datetime = Field(default_factory=datetime.now)


class MaintenanceRecord(BaseModel):
    date: date
    description: str
    cost: float
    technician: str


class Equipment(BaseModel):
    id: str
    name: str
    type: str  # vehicle, tool, heavy_equipment
    health_score: float  # 0-100
    status: EquipmentStatus
    last_service: date
    next_service: date
    purchase_date: date
    value: float
    assigned_to: str = ""
    maintenance_history: list[MaintenanceRecord] = []
    notes: str = ""


class ComplianceItem(BaseModel):
    id: str
    name: str
    category: str  # license, permit, insurance, certification
    issued_date: date
    expiry_date: date
    status: ComplianceStatus
    issuing_authority: str
    reference_number: str
    notes: str = ""


class PricingRule(BaseModel):
    id: str
    name: str
    job_type: JobType
    base_rate: float
    unit: str = "per_hour"
    peak_multiplier: float = 1.0
    emergency_multiplier: float = 1.5
    weekend_multiplier: float = 1.25
    seasonal_adjustment: float = 1.0
    notes: str = ""


class PriceCalculation(BaseModel):
    job_type: str
    base_rate: float
    hours: float
    multiplier: float
    multiplier_reasons: list[str]
    subtotal: float
    tax: float
    total: float


# ---- Dashboard / Response Models ----


class RevenueData(BaseModel):
    month: str
    revenue: float
    jobs_completed: int


class JobsByStatus(BaseModel):
    scheduled: int
    in_progress: int
    completed: int
    invoiced: int


class TopCustomer(BaseModel):
    id: str
    name: str
    total_spent: float
    job_count: int


class EquipmentAlert(BaseModel):
    id: str
    name: str
    health_score: float
    next_service: date
    status: str


class ComplianceDeadline(BaseModel):
    id: str
    name: str
    category: str
    expiry_date: date
    status: str


class DashboardMetrics(BaseModel):
    total_revenue: float
    active_jobs: int
    equipment_health_avg: float
    compliance_score: float
    revenue_by_month: list[RevenueData]
    jobs_by_status: JobsByStatus
    recent_jobs: list[Job]
    top_customers: list[TopCustomer]
    equipment_alerts: list[EquipmentAlert]
    compliance_deadlines: list[ComplianceDeadline]
