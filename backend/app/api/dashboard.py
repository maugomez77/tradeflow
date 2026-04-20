"""Dashboard API endpoints."""

from fastapi import APIRouter

from app import store
from app.models import (
    ComplianceDeadline,
    DashboardMetrics,
    EquipmentAlert,
    JobsByStatus,
    TopCustomer,
)

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardMetrics)
async def get_dashboard():
    jobs = store.list_jobs()
    equipment = store.list_equipment()
    compliance_items = store.list_compliance_items()
    customers = store.list_customers()
    revenue_data = store.list_revenue_data()

    # Total revenue (from completed + invoiced jobs)
    total_revenue = sum(
        j.actual_cost or j.estimated_cost
        for j in jobs
        if j.status in ("completed", "invoiced")
    )

    # Active jobs
    active_jobs = sum(1 for j in jobs if j.status in ("scheduled", "in_progress"))

    # Equipment health average
    equipment_health_avg = (
        sum(e.health_score for e in equipment) / len(equipment)
        if equipment
        else 0
    )

    # Compliance score
    valid_count = sum(1 for c in compliance_items if c.status == "valid")
    compliance_score = (
        (valid_count / len(compliance_items)) * 100 if compliance_items else 0
    )

    # Jobs by status
    jobs_by_status = JobsByStatus(
        scheduled=sum(1 for j in jobs if j.status == "scheduled"),
        in_progress=sum(1 for j in jobs if j.status == "in_progress"),
        completed=sum(1 for j in jobs if j.status == "completed"),
        invoiced=sum(1 for j in jobs if j.status == "invoiced"),
    )

    # Recent jobs (last 5 by scheduled_date)
    recent_jobs = sorted(jobs, key=lambda j: j.scheduled_date, reverse=True)[:5]

    # Top customers by total_spent
    top_customers = [
        TopCustomer(
            id=c.id,
            name=c.name,
            total_spent=c.total_spent,
            job_count=c.job_count,
        )
        for c in sorted(customers, key=lambda c: c.total_spent, reverse=True)[:5]
    ]

    # Equipment alerts (health < 80 or needs_service/out_of_service)
    equipment_alerts = [
        EquipmentAlert(
            id=e.id,
            name=e.name,
            health_score=e.health_score,
            next_service=e.next_service,
            status=e.status.value,
        )
        for e in equipment
        if e.health_score < 80 or e.status != "operational"
    ]

    # Compliance deadlines (expiring or expired)
    compliance_deadlines = [
        ComplianceDeadline(
            id=c.id,
            name=c.name,
            category=c.category,
            expiry_date=c.expiry_date,
            status=c.status.value,
        )
        for c in compliance_items
        if c.status in ("expiring", "expired")
    ]

    return DashboardMetrics(
        total_revenue=total_revenue,
        active_jobs=active_jobs,
        equipment_health_avg=round(equipment_health_avg, 1),
        compliance_score=round(compliance_score, 1),
        revenue_by_month=revenue_data,
        jobs_by_status=jobs_by_status,
        recent_jobs=recent_jobs,
        top_customers=top_customers,
        equipment_alerts=equipment_alerts,
        compliance_deadlines=compliance_deadlines,
    )
