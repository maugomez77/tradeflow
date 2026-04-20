"""Pricing API endpoints."""

from fastapi import APIRouter, Query

from app import store
from app.models import PriceCalculation, PricingRule

router = APIRouter(prefix="/api", tags=["pricing"])


@router.get("/pricing", response_model=list[PricingRule])
async def list_pricing():
    return store.list_pricing_rules()


@router.get("/pricing/calculate", response_model=PriceCalculation)
async def calculate_price(
    job_type: str = Query(..., description="plumbing, hvac, electrical, general"),
    hours: float = Query(1.0, ge=0.5),
    is_emergency: bool = Query(False),
    is_weekend: bool = Query(False),
    is_peak: bool = Query(False),
):
    rules = store.list_pricing_rules()

    # Find matching rule
    rule = None
    for r in rules:
        if r.job_type == job_type:
            rule = r
            break

    if rule is None:
        # Fallback to general (last rule)
        rule = rules[-1] if rules else None

    if rule is None:
        # No pricing rules configured; return a minimal zero calc
        return PriceCalculation(
            job_type=job_type,
            base_rate=0.0,
            hours=hours,
            multiplier=1.0,
            multiplier_reasons=["No pricing rules configured"],
            subtotal=0.0,
            tax=0.0,
            total=0.0,
        )

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
