"""Equipment API endpoints."""

from datetime import date

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app import store
from app.models import Equipment, MaintenanceRecord

router = APIRouter(prefix="/api", tags=["equipment"])


class MaintenanceRequest(BaseModel):
    description: str
    cost: float
    technician: str


@router.get("/equipment", response_model=list[Equipment])
async def list_equipment():
    return sorted(store.list_equipment(), key=lambda e: e.health_score)


@router.get("/equipment/{equipment_id}", response_model=Equipment)
async def get_equipment(equipment_id: str):
    for e in store.list_equipment():
        if e.id == equipment_id:
            return e
    raise HTTPException(status_code=404, detail="Equipment not found")


@router.post("/equipment/{equipment_id}/maintenance", response_model=Equipment)
async def log_maintenance(equipment_id: str, req: MaintenanceRequest):
    record = MaintenanceRecord(
        date=date.today(),
        description=req.description,
        cost=req.cost,
        technician=req.technician,
    )

    def _apply(eq_dict: dict) -> dict:
        eq_dict.setdefault("maintenance_history", []).append(record.model_dump(mode="json"))
        eq_dict["last_service"] = date.today().isoformat()
        # Boost health score after maintenance
        eq_dict["health_score"] = min(100.0, eq_dict.get("health_score", 0) + 15.0)
        if eq_dict["health_score"] >= 70:
            eq_dict["status"] = "operational"
        # Re-validate
        return Equipment(**eq_dict).model_dump(mode="json")

    if not store.update_equipment(equipment_id, _apply):
        raise HTTPException(status_code=404, detail="Equipment not found")

    for e in store.list_equipment():
        if e.id == equipment_id:
            return e
    raise HTTPException(status_code=404, detail="Equipment not found")
