"""Equipment API endpoints."""

from datetime import date

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.demo_data import EQUIPMENT
from app.models import Equipment, MaintenanceRecord

router = APIRouter(prefix="/api", tags=["equipment"])


class MaintenanceRequest(BaseModel):
    description: str
    cost: float
    technician: str


@router.get("/equipment", response_model=list[Equipment])
async def list_equipment():
    return sorted(EQUIPMENT, key=lambda e: e.health_score)


@router.get("/equipment/{equipment_id}", response_model=Equipment)
async def get_equipment(equipment_id: str):
    for e in EQUIPMENT:
        if e.id == equipment_id:
            return e
    raise HTTPException(status_code=404, detail="Equipment not found")


@router.post("/equipment/{equipment_id}/maintenance", response_model=Equipment)
async def log_maintenance(equipment_id: str, req: MaintenanceRequest):
    for i, e in enumerate(EQUIPMENT):
        if e.id == equipment_id:
            record = MaintenanceRecord(
                date=date.today(),
                description=req.description,
                cost=req.cost,
                technician=req.technician,
            )
            data = e.model_dump()
            data["maintenance_history"].append(record.model_dump())
            data["last_service"] = date.today()
            # Boost health score after maintenance
            data["health_score"] = min(100.0, data["health_score"] + 15.0)
            if data["health_score"] >= 70:
                data["status"] = "operational"
            EQUIPMENT[i] = Equipment(**data)
            return EQUIPMENT[i]
    raise HTTPException(status_code=404, detail="Equipment not found")
