"""Jobs API endpoints."""

from datetime import date, datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.demo_data import JOBS, CUSTOMERS, TECHNICIANS
from app.models import Job, JobStatus, JobType

router = APIRouter(prefix="/api", tags=["jobs"])


class CreateJobRequest(BaseModel):
    title: str
    customer_id: str
    type: JobType
    technician_id: str
    address: str
    description: str
    scheduled_date: date
    estimated_cost: float
    notes: str = ""


class UpdateJobRequest(BaseModel):
    status: Optional[JobStatus] = None
    actual_cost: Optional[float] = None
    completed_date: Optional[date] = None
    notes: Optional[str] = None
    technician_id: Optional[str] = None


@router.get("/jobs", response_model=list[Job])
async def list_jobs(
    status: Optional[str] = None,
    technician: Optional[str] = None,
    type: Optional[str] = None,
):
    result = JOBS[:]
    if status:
        result = [j for j in result if j.status == status]
    if technician:
        result = [j for j in result if j.technician_id == technician]
    if type:
        result = [j for j in result if j.type == type]
    return sorted(result, key=lambda j: j.scheduled_date, reverse=True)


@router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    for j in JOBS:
        if j.id == job_id:
            return j
    raise HTTPException(status_code=404, detail="Job not found")


@router.post("/jobs", response_model=Job, status_code=201)
async def create_job(req: CreateJobRequest):
    # Look up customer and technician names
    customer_name = ""
    for c in CUSTOMERS:
        if c.id == req.customer_id:
            customer_name = c.name
            break

    technician_name = ""
    for t in TECHNICIANS:
        if t.id == req.technician_id:
            technician_name = t.name
            break

    new_id = f"job-{len(JOBS) + 1:03d}"
    job = Job(
        id=new_id,
        title=req.title,
        customer_id=req.customer_id,
        customer_name=customer_name,
        type=req.type,
        status=JobStatus.scheduled,
        technician_id=req.technician_id,
        technician_name=technician_name,
        address=req.address,
        description=req.description,
        scheduled_date=req.scheduled_date,
        estimated_cost=req.estimated_cost,
        notes=req.notes,
        created_at=datetime.now(),
    )
    JOBS.append(job)
    return job


@router.patch("/jobs/{job_id}", response_model=Job)
async def update_job(job_id: str, req: UpdateJobRequest):
    for i, j in enumerate(JOBS):
        if j.id == job_id:
            data = j.model_dump()
            updates = req.model_dump(exclude_none=True)
            data.update(updates)
            if req.technician_id:
                for t in TECHNICIANS:
                    if t.id == req.technician_id:
                        data["technician_name"] = t.name
                        break
            JOBS[i] = Job(**data)
            return JOBS[i]
    raise HTTPException(status_code=404, detail="Job not found")
