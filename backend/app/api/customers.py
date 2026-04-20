"""Customers API endpoints."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app import store
from app.models import Customer, Job

router = APIRouter(prefix="/api", tags=["customers"])


class CustomerDetail(BaseModel):
    customer: Customer
    jobs: list[Job]


@router.get("/customers", response_model=list[Customer])
async def list_customers():
    return sorted(store.list_customers(), key=lambda c: c.total_spent, reverse=True)


@router.get("/customers/{customer_id}", response_model=CustomerDetail)
async def get_customer(customer_id: str):
    for c in store.list_customers():
        if c.id == customer_id:
            customer_jobs = [j for j in store.list_jobs() if j.customer_id == customer_id]
            return CustomerDetail(
                customer=c,
                jobs=sorted(customer_jobs, key=lambda j: j.scheduled_date, reverse=True),
            )
    raise HTTPException(status_code=404, detail="Customer not found")
