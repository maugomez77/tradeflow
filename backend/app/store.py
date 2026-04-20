"""Persistence layer for TradeFlow.

Hybrid: Postgres JSONB blob when DATABASE_URL is set (Render), JSON file fallback
for local dev / CLI. Render free tier has ephemeral disk — JSON would be wiped on
every cold start, so production must use Postgres.

All entities are persisted as JSON-serialized Pydantic model dicts (mode="json"
so date/datetime/enums serialize cleanly).
"""

from __future__ import annotations

import json
from pathlib import Path

from app.database import KVStore, SessionLocal, is_db_enabled

STORE_PATH = Path.home() / ".tradeflow" / "store.json"

_EMPTY: dict = {
    "technicians": [],
    "customers": [],
    "jobs": [],
    "equipment": [],
    "compliance_items": [],
    "pricing_rules": [],
    "revenue_data": [],
}


_KV_KEY = "main"


def _ensure_dir() -> None:
    STORE_PATH.parent.mkdir(parents=True, exist_ok=True)


def load() -> dict:
    if is_db_enabled():
        with SessionLocal() as s:
            row = s.get(KVStore, _KV_KEY)
            if row and row.value:
                return {**_EMPTY, **row.value}
            return {**_EMPTY}
    _ensure_dir()
    if STORE_PATH.exists():
        return {**_EMPTY, **json.loads(STORE_PATH.read_text())}
    return {**_EMPTY}


def save(data: dict) -> None:
    if is_db_enabled():
        with SessionLocal() as s:
            row = s.get(KVStore, _KV_KEY)
            if row:
                row.value = data
            else:
                s.add(KVStore(key=_KV_KEY, value=data))
            s.commit()
        return
    _ensure_dir()
    STORE_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False, default=str))


def is_empty(data: dict) -> bool:
    """True when no seed data has been loaded yet."""
    return not any(data.get(k) for k in _EMPTY.keys())


def seed_if_empty() -> None:
    """Seed the store with demo data on first startup (or after wipe)."""
    data = load()
    if not is_empty(data):
        return
    # Local import to avoid circular references at module load time
    from app.demo_data import (
        COMPLIANCE_ITEMS,
        CUSTOMERS,
        EQUIPMENT,
        JOBS,
        PRICING_RULES,
        REVENUE_DATA,
        TECHNICIANS,
    )

    data["technicians"] = [t.model_dump(mode="json") for t in TECHNICIANS]
    data["customers"] = [c.model_dump(mode="json") for c in CUSTOMERS]
    data["jobs"] = [j.model_dump(mode="json") for j in JOBS]
    data["equipment"] = [e.model_dump(mode="json") for e in EQUIPMENT]
    data["compliance_items"] = [ci.model_dump(mode="json") for ci in COMPLIANCE_ITEMS]
    data["pricing_rules"] = [pr.model_dump(mode="json") for pr in PRICING_RULES]
    data["revenue_data"] = [rd.model_dump(mode="json") for rd in REVENUE_DATA]
    save(data)


# --- Typed accessors (read-only helpers returning Pydantic instances) ---


def list_technicians():
    from app.models import Technician

    data = load()
    return [Technician(**t) for t in data.get("technicians", [])]


def list_customers():
    from app.models import Customer

    data = load()
    return [Customer(**c) for c in data.get("customers", [])]


def list_jobs():
    from app.models import Job

    data = load()
    return [Job(**j) for j in data.get("jobs", [])]


def list_equipment():
    from app.models import Equipment

    data = load()
    return [Equipment(**e) for e in data.get("equipment", [])]


def list_compliance_items():
    from app.models import ComplianceItem

    data = load()
    return [ComplianceItem(**c) for c in data.get("compliance_items", [])]


def list_pricing_rules():
    from app.models import PricingRule

    data = load()
    return [PricingRule(**p) for p in data.get("pricing_rules", [])]


def list_revenue_data():
    from app.models import RevenueData

    data = load()
    return [RevenueData(**r) for r in data.get("revenue_data", [])]


# --- Mutations ---


def append_job(job) -> None:
    data = load()
    data.setdefault("jobs", []).append(job.model_dump(mode="json"))
    save(data)


def update_job(job_id: str, updater) -> bool:
    """Apply `updater(job_dict) -> job_dict` to the matching job. Returns True if found."""
    data = load()
    jobs = data.get("jobs", [])
    for i, j in enumerate(jobs):
        if j.get("id") == job_id:
            jobs[i] = updater(j)
            data["jobs"] = jobs
            save(data)
            return True
    return False


def update_equipment(equipment_id: str, updater) -> bool:
    data = load()
    items = data.get("equipment", [])
    for i, e in enumerate(items):
        if e.get("id") == equipment_id:
            items[i] = updater(e)
            data["equipment"] = items
            save(data)
            return True
    return False
