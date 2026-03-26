"""Compliance API endpoints."""

from fastapi import APIRouter

from app.demo_data import COMPLIANCE_ITEMS
from app.models import ComplianceItem

router = APIRouter(prefix="/api", tags=["compliance"])


@router.get("/compliance", response_model=list[ComplianceItem])
async def list_compliance():
    # Sort: expired first, then expiring, then valid
    order = {"expired": 0, "expiring": 1, "valid": 2}
    return sorted(COMPLIANCE_ITEMS, key=lambda c: (order.get(c.status, 3), c.expiry_date))
