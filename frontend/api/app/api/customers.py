"""Customers API endpoints."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.demo_data import CUSTOMERS, JOBS
from app.models import Customer, Job

router = APIRouter(prefix="/api", tags=["customers"])


class CustomerDetail(BaseModel):
    customer: Customer
    jobs: list[Job]


@router.get("/customers", response_model=list[Customer])
async def list_customers():
    return sorted(CUSTOMERS, key=lambda c: c.total_spent, reverse=True)


@router.get("/customers/{customer_id}", response_model=CustomerDetail)
async def get_customer(customer_id: str):
    for c in CUSTOMERS:
        if c.id == customer_id:
            customer_jobs = [j for j in JOBS if j.customer_id == customer_id]
            return CustomerDetail(
                customer=c,
                jobs=sorted(customer_jobs, key=lambda j: j.scheduled_date, reverse=True),
            )
    raise HTTPException(status_code=404, detail="Customer not found")
