"""TradeFlow Intelligence - FastAPI Backend."""

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import compliance, customers, dashboard, equipment, jobs, pricing
from app.database import init_db, is_db_enabled
from app.store import seed_if_empty

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema (Postgres only) and seed demo data on first start.
    init_db()
    seed_if_empty()
    backend = "postgres" if is_db_enabled() else "json file"
    print(f"TradeFlow Intelligence API started - store backend: {backend}")
    yield


app = FastAPI(
    title="TradeFlow Intelligence API",
    description="AI-powered business intelligence for skilled trades",
    version="1.0.0",
    lifespan=lifespan,
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
