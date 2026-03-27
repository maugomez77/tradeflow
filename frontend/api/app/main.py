"""TradeFlow Intelligence - FastAPI Backend."""

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import compliance, customers, dashboard, equipment, jobs, pricing

load_dotenv()

app = FastAPI(
    title="TradeFlow Intelligence API",
    description="AI-powered business intelligence for skilled trades",
    version="1.0.0",
)

# CORS
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://tradeflow-pro.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(dashboard.router)
app.include_router(jobs.router)
app.include_router(equipment.router)
app.include_router(customers.router)
app.include_router(pricing.router)
app.include_router(compliance.router)


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "tradeflow-api", "version": "1.0.0"}


@app.on_event("startup")
async def startup():
    # Demo data is loaded at import time via demo_data module
    from app import demo_data  # noqa: F401

    print("TradeFlow Intelligence API started - demo data loaded")
