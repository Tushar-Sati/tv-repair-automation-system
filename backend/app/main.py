import time
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import threading

from app.services.sheets_service import sheet_service
from app.services.job_parser import get_pending_jobs
from app.core.config import settings

app = FastAPI(title="RepairFlow AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tv-repair-automation-system.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple Authentication
ADMIN_TOKEN = "admin_session_token_xyz123"

async def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    if authorization != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=401, detail="Invalid token")
    return True

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
def login(req: LoginRequest):
    print(f"Login attempt: {req.username}")
    # Supporting both 'password' and 'admin123' for migration/testing
    if req.username == "admin" and req.password in ["password", "admin123"]:
        return {
            "success": True,
            "token": ADMIN_TOKEN,
            "user": {"name": "Admin"}
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

# -----------------------------------------------------------------------------
# JOBS & CUSTOMERS
# -----------------------------------------------------------------------------

def parse_job_row(row: list, index: int) -> dict:
    def get_col(idx, default=""):
        return str(row[idx]).strip() if len(row) > idx else default

    date_received = get_col(0)
    days_pending = 0
    try:
        if date_received:
            date_str = date_received.replace("/", "-")
            date_obj = datetime.strptime(date_str, "%d-%m-%Y")
            days_pending = (datetime.now() - date_obj).days
    except: pass

    return {
        "id": get_col(2),
        "row_number": index + 1,
        "date_received": date_received,
        "customer_name": get_col(1),
        "job_number": get_col(2),
        "phone_number": get_col(3),
        "brand": get_col(4),
        "model_no": get_col(5),
        "serial_no": get_col(6),
        "symptoms": get_col(7),
        "part_replacement": get_col(8),
        "status": get_col(9).upper(),
        "deliver": get_col(10).upper(),
        "message_status": get_col(11).upper(),
        "payment": get_col(12),
        "days_pending": max(0, days_pending)
    }

_cache = {"rows": None, "last_fetched": 0}
CACHE_TTL = 30
_cache_lock = threading.Lock()

def get_cached_rows():
    current_time = time.time()
    with _cache_lock:
        if _cache["rows"] is None or (current_time - _cache["last_fetched"]) > CACHE_TTL:
            try:
                _cache["rows"] = sheet_service.get_rows()
                _cache["last_fetched"] = current_time
            except Exception as e:
                print(f"Sheet error: {e}")
                if _cache["rows"] is None: return []
    return _cache["rows"]

def invalidate_cache():
    with _cache_lock:
        _cache["rows"] = None
        _cache["last_fetched"] = 0

@app.get("/api/customers", dependencies=[Depends(verify_token)])
@app.get("/api/jobs", dependencies=[Depends(verify_token)])
def get_jobs():
    rows = get_cached_rows()
    if not rows: return []
    return [parse_job_row(row, i) for i, row in enumerate(rows) if i > 0 and len(row) > 3]

@app.get("/api/jobs/{job_id}", dependencies=[Depends(verify_token)])
def get_job(job_id: str):
    jobs = get_jobs()
    for job in jobs:
        if job["id"] == job_id or job["job_number"] == job_id:
            return job
    raise HTTPException(status_code=404, detail="Job not found")

@app.get("/api/pending-messages", dependencies=[Depends(verify_token)])
def get_pending_messages():
    rows = get_cached_rows()
    if not rows: return []
    return get_pending_jobs(rows, debug=False)

class SendMessageRequest(BaseModel):
    row_number: int

class UpdateJobRequest(BaseModel):
    status: Optional[str] = None
    deliver: Optional[str] = None
    payment: Optional[str] = None

@app.post("/api/send-message", dependencies=[Depends(verify_token)])
def send_message(req: SendMessageRequest):
    try:
        sheet_service.mark_message_sent(req.row_number)
        invalidate_cache()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/jobs/{job_id}", dependencies=[Depends(verify_token)])
def update_job(job_id: str, req: UpdateJobRequest):
    """
    Update STATUS, DELIVER, or PAYMENT columns for a given job.
    Maps job_id to the correct sheet row by scanning all rows.
    Only writes columns that are explicitly provided in the request.
    Never touches columns not in the request.
    """
    rows = get_cached_rows()
    target_row = None

    for i, row in enumerate(rows):
        if i == 0:
            continue
        job_number = str(row[2]).strip() if len(row) > 2 else ""
        if job_number == job_id:
            target_row = i + 1
            break

    if not target_row:
        raise HTTPException(status_code=404, detail="Job not found")

    try:
        if req.status is not None:
            sheet_service.update_cell(target_row, "J", req.status)
        if req.deliver is not None:
            sheet_service.update_cell(target_row, "K", req.deliver)
        if req.payment is not None:
            sheet_service.update_cell(target_row, "M", req.payment)
        invalidate_cache()
        return {"status": "updated", "row": target_row}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/message-history", dependencies=[Depends(verify_token)])
def get_message_history():
    jobs = get_jobs()
    return [j for j in jobs if j["message_status"] == "SENT"]

# -----------------------------------------------------------------------------
# ANALYTICS
# -----------------------------------------------------------------------------

@app.get("/api/dashboard-stats", dependencies=[Depends(verify_token)])
@app.get("/api/analytics/revenue", dependencies=[Depends(verify_token)])
def get_dashboard_stats():
    rows = get_cached_rows()
    if not rows:
        return {
            "total_customers": 0, "pending_messages": 0, "sent_messages": 0,
            "delivered_jobs": 0, "success_rate": 0, "brand_distribution": []
        }

    jobs = [parse_job_row(row, i) for i, row in enumerate(rows) if i > 0 and len(row) > 3]
    pending = len(get_pending_jobs(rows, debug=False))
    sent = sum(1 for j in jobs if j["message_status"] == "SENT")

    brands = {}
    for j in jobs:
        b = j["brand"].upper() or "UNKNOWN"
        brands[b] = brands.get(b, 0) + 1

    return {
        "total_customers": len(jobs),
        "pending_messages": pending,
        "sent_messages": sent,
        "delivered_jobs": sum(1 for j in jobs if j["deliver"] == "YES"),
        "success_rate": (sent / (sent + pending) * 100) if (sent + pending) > 0 else 0,
        "brand_distribution": [{"name": k, "value": v} for k, v in brands.items()]
    }

@app.get("/api/debug")
def debug_info():
    return {
        "sheets_configured": settings.GOOGLE_SHEET_ID is not None,
        "sheet_id": settings.GOOGLE_SHEET_ID[:5] + "..." if settings.GOOGLE_SHEET_ID else None,
        "cache_status": "ready" if _cache["rows"] else "empty"
    }

@app.get("/")
def health_check():
    return {
        "status": "alive",
        "version": "1.0.2",
        "endpoints": [route.path for route in app.routes if hasattr(route, 'path')],
        "deployment_status": "SUCCESSFUL - If you see this, the new code is live."
    }
