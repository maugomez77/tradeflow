"""Pricing API endpoints."""

from datetime import datetime

from fastapi import APIRouter, Query

from app.demo_data import PRICING_RULES
from app.models import PriceCalculation, PricingRule

router = APIRouter(prefix="/api", tags=["pricing"])


@router.get("/pricing", response_model=list[PricingRule])
async def list_pricing():
    return PRICING_RULES


@router.get("/pricing/calculate", response_model=PriceCalculation)
async def calculate_price(
    job_type: str = Query(..., description="plumbing, hvac, electrical, general"),
    hours: float = Query(1.0, ge=0.5),
    is_emergency: bool = Query(False),
    is_weekend: bool = Query(False),
    is_peak: bool = Query(False),
):
    # Find matching rule
    rule = None
    for r in PRICING_RULES:
        if r.job_type == job_type:
            rule = r
            break

    if rule is None:
        # Fallback to general
        rule = PRICING_RULES[-1]

    # Calculate multiplier
    multiplier = 1.0
    reasons: list[str] = []

    if is_emergency:
        multiplier *= rule.emergency_multiplier
        reasons.append(f"Emergency rate ({rule.emergency_multiplier}x)")

    if is_weekend:
        multiplier *= rule.weekend_multiplier
        reasons.append(f"Weekend rate ({rule.weekend_multiplier}x)")

    if is_peak and not is_emergency:
        multiplier *= rule.peak_multiplier
        reasons.append(f"Peak hours ({rule.peak_multiplier}x)")

    if rule.seasonal_adjustment != 1.0:
        multiplier *= rule.seasonal_adjustment
        reasons.append(f"Seasonal adjustment ({rule.seasonal_adjustment}x)")

    if not reasons:
        reasons.append("Standard rate")

    subtotal = rule.base_rate * hours * multiplier
    tax = subtotal * 0.0875  # Bay Area sales tax
    total = subtotal + tax

    return PriceCalculation(
        job_type=job_type,
        base_rate=rule.base_rate,
        hours=hours,
        multiplier=round(multiplier, 3),
        multiplier_reasons=reasons,
        subtotal=round(subtotal, 2),
        tax=round(tax, 2),
        total=round(total, 2),
    )
