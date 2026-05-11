import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.services.sheets_service import sheet_service
from app.core.config import settings

app = FastAPI(title="RepairFlow AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.head("/")
@app.get("/")
def health_check():
    """Simple health check for UptimeRobot"""
    return {"status": "alive"}

@app.head("/api/debug")
@app.get("/api/debug")
def debug_info():
    """Debug endpoint - check sheet connection and raw data"""
    try:
        rows = sheet_service.get_rows()
        return {
            "status": "ok",
            "sheet_id": settings.GOOGLE_SHEET_ID,
            "sheet_name": settings.GOOGLE_SHEET_NAME,
            "total_rows": len(rows),
            "header_row": rows[0] if rows else [],
            "first_data_row": rows[1] if len(rows) > 1 else [],
            "second_data_row": rows[2] if len(rows) > 2 else [],
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}



def parse_job_row(row: list, index: int) -> dict:
    # Confirmed column mapping from debug endpoint:
    # A(0): DATE, B(1): CUSTOMER_NAME, C(2): JOB_NUMBER, D(3): PHONE_NUMBER
    # E(4): BRAND, F(5): MODEL_NO, G(6): SERIAL_NO, H(7): SYMPTOMS
    # I(8): PART_REPLACE, J(9): STATUS, K(10): DELIVER, L(11): MESSAGE_STATUS, M(12): PAYMENT
    
    def get_col(idx, default=""):
        return str(row[idx]).strip() if len(row) > idx else default

    date_received = get_col(0)
    
    # Calculate days pending
    days_pending = 0
    try:
        if date_received:
            date_str = date_received.replace("/", "-")
            date_obj = datetime.strptime(date_str, "%d-%m-%Y")
            days_pending = (datetime.now() - date_obj).days
    except Exception:
        pass

    deliver_raw = get_col(10).upper()
    # Treat both YES and SENT as delivered
    is_delivered = deliver_raw in ("YES", "SENT")

    return {
        "id": get_col(2),  # Job Number as ID
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
        "deliver": "YES" if is_delivered else deliver_raw,  # Normalize to YES/NO
        "message_status": get_col(11).upper(),
        "payment": get_col(12),
        "days_pending": max(0, days_pending)
    }

import time
import threading

# Cache for Google Sheets data to avoid rate limits and speed up responses
_cache = {
    "rows": None,
    "last_fetched": 0
}
CACHE_TTL = 15 # seconds
_cache_lock = threading.Lock()

def get_cached_rows():
    current_time = time.time()
    with _cache_lock:
        if _cache["rows"] is None or (current_time - _cache["last_fetched"]) > CACHE_TTL:
            _cache["rows"] = sheet_service.get_rows()
            _cache["last_fetched"] = current_time
    return _cache["rows"]

def invalidate_cache():
    with _cache_lock:
        _cache["rows"] = None
        _cache["last_fetched"] = 0

@app.get("/api/jobs")
def get_all_jobs():
    rows = get_cached_rows()
    if not rows:
        return []
    
    jobs = []
    for i, row in enumerate(rows):
        if i == 0 or len(row) < 3: # Skip header and empty rows
            continue
        jobs.append(parse_job_row(row, i))
    return jobs

@app.get("/api/jobs/{job_id}")
def get_job(job_id: str):
    rows = get_cached_rows()
    for i, row in enumerate(rows):
        if i == 0 or len(row) < 3:
            continue
        job = parse_job_row(row, i)
        if job["id"] == job_id:
            return job
    raise HTTPException(status_code=404, detail="Job not found")

class JobUpdate(BaseModel):
    status: Optional[str] = None
    deliver: Optional[str] = None
    payment: Optional[str] = None

@app.put("/api/jobs/{job_id}")
def update_job(job_id: str, update: JobUpdate):
    rows = get_cached_rows()
    row_idx = -1
    for i, row in enumerate(rows):
        if len(row) > 2 and str(row[2]).strip() == job_id:
            row_idx = i + 1
            break
            
    if row_idx == -1:
        raise HTTPException(status_code=404, detail="Job not found")

    service = sheet_service._get_service()
    
    if update.status is not None:
        service.spreadsheets().values().update(
            spreadsheetId=settings.GOOGLE_SHEET_ID,
            range=f"{settings.GOOGLE_SHEET_NAME}!J{row_idx}",
            valueInputOption="RAW",
            body={"values": [[update.status]]}
        ).execute()
        
    if update.deliver is not None:
        service.spreadsheets().values().update(
            spreadsheetId=settings.GOOGLE_SHEET_ID,
            range=f"{settings.GOOGLE_SHEET_NAME}!K{row_idx}",
            valueInputOption="RAW",
            body={"values": [[update.deliver]]}
        ).execute()
        
    if update.payment is not None:
        service.spreadsheets().values().update(
            spreadsheetId=settings.GOOGLE_SHEET_ID,
            range=f"{settings.GOOGLE_SHEET_NAME}!M{row_idx}",
            valueInputOption="RAW",
            body={"values": [[update.payment]]}
        ).execute()

    # Invalidate cache after an update so the next fetch gets fresh data
    invalidate_cache()
    return {"message": "Updated successfully"}

@app.get("/api/analytics/revenue")
def get_revenue_analytics():
    rows = get_cached_rows()
    jobs = []
    for i, row in enumerate(rows):
        if i == 0 or len(row) < 3:
            continue
        jobs.append(parse_job_row(row, i))

    total_revenue = 0
    pending_revenue = 0
    completed_jobs = 0
    brands = {}
    
    for job in jobs:
        payment = 0
        try:
            if job["payment"]:
                payment = float(job["payment"].replace(",", ""))
        except:
            pass

        if job["deliver"] == "YES":
            total_revenue += payment
            completed_jobs += 1
            
            b = job["brand"].upper() or "UNKNOWN"
            brands[b] = brands.get(b, 0) + payment
        elif job["status"] in ["OK", "DIAGNOSING", "WIP"]:
            pending_revenue += payment

    avg_ticket = total_revenue / completed_jobs if completed_jobs > 0 else 0

    return {
        "total_revenue": total_revenue,
        "pending_revenue": pending_revenue,
        "completed_jobs": completed_jobs,
        "average_ticket": avg_ticket,
        "brand_revenue": [{"name": k, "value": v} for k, v in brands.items() if v > 0]
    }
