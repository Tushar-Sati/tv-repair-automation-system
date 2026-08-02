import contextlib
import io
import sys
import time
from pathlib import Path
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
import threading

from app.services.sheets_service import (
    DELIVERY_COL,
    DELIVERY_DATE_COL,
    DUE_COL,
    FIELD_COLUMN_INDEXES,
    PAYMENT_COL,
    RESPONSE_COL,
    STATUS_COL,
    sheet_service,
)
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

class RepairJobResponse(BaseModel):
    id: str
    row_number: int
    date: str
    date_received: str
    customer_name: str
    job_number: str
    contact: str
    phone_number: str
    brand: str
    model_no: str
    serial_no: str
    symptoms: str
    part_replacement: str
    status: str
    delivery: str
    deliver: str
    message_status: str
    payment: str
    response: str
    due: str
    delivery_date: Optional[str] = ""
    days_pending: int

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

EXPECTED_COLUMNS = FIELD_COLUMN_INDEXES

HEADER_ALIASES = {
    "date": {"date", "date_received", "date received"},
    "customer_name": {"customer_name", "customer name", "customer"},
    "job_number": {"job_number", "job number", "job no", "job no.", "job"},
    "contact": {"contact", "phone", "phone_number", "phone number", "mobile"},
    "brand": {"brand"},
    "model_no": {"model_no", "model no", "model no.", "model"},
    "serial_no": {"serial_no", "serial no", "serial no.", "serial"},
    "symptoms": {"symptoms", "symptom", "complaint"},
    "part_replacement": {"part_replacement", "part replacement", "parts"},
    "status": {"status"},
    "delivery": {"delivery", "deliver"},
    "message_status": {"message_status", "message status", "msg status"},
    "payment": {"payment"},
    "response": {"response", "responce"},
    "due": {"due"},
    "delivery_date": {"delivery_date", "delivery date", "delivered on"},
}

def _normalize_header(value: str) -> str:
    return " ".join(str(value).strip().lower().replace("_", " ").split())

def build_column_map(header_row: list) -> dict:
    normalized_headers = {
        _normalize_header(header): idx
        for idx, header in enumerate(header_row)
        if str(header).strip()
    }

    column_map = EXPECTED_COLUMNS.copy()
    for field, aliases in HEADER_ALIASES.items():
        for alias in aliases:
            normalized_alias = _normalize_header(alias)
            if normalized_alias in normalized_headers:
                column_map[field] = normalized_headers[normalized_alias]
                break

    return column_map

def parse_amount(value: Any) -> float:
    cleaned = str(value).strip().replace(",", "").replace("₹", "")
    if not cleaned:
        return 0.0
    try:
        return float(cleaned)
    except ValueError:
        return 0.0

def today_sheet_date() -> str:
    return datetime.now().strftime("%d/%m/%Y")

def parse_job_row(row: list, index: int, column_map: Optional[dict] = None) -> dict:
    column_map = column_map or EXPECTED_COLUMNS

    def get_field(field: str, default=""):
        idx = column_map.get(field, EXPECTED_COLUMNS[field])
        return str(row[idx]).strip() if len(row) > idx else default

    date_received = get_field("date")
    days_pending = 0
    try:
        if date_received:
            date_str = date_received.replace("/", "-")
            date_obj = datetime.strptime(date_str, "%d-%m-%Y")
            days_pending = (datetime.now() - date_obj).days
    except: pass

    return {
        "id": get_field("job_number"),
        "row_number": index + 1,
        "date": date_received,
        "date_received": date_received,
        "customer_name": get_field("customer_name"),
        "job_number": get_field("job_number"),
        "contact": get_field("contact"),
        "phone_number": get_field("contact"),
        "brand": get_field("brand"),
        "model_no": get_field("model_no"),
        "serial_no": get_field("serial_no"),
        "symptoms": get_field("symptoms"),
        "part_replacement": get_field("part_replacement"),
        "status": get_field("status").upper(),
        "delivery": get_field("delivery").upper(),
        "deliver": get_field("delivery").upper(),
        "message_status": get_field("message_status").upper(),
        "payment": get_field("payment"),
        "response": get_field("response"),
        "due": get_field("due"),
        "delivery_date": get_field("delivery_date"),
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
@app.get("/api/jobs", response_model=List[RepairJobResponse], dependencies=[Depends(verify_token)])
def get_jobs() -> List[RepairJobResponse]:
    rows = get_cached_rows()
    if not rows: return []
    column_map = build_column_map(rows[0])
    return [parse_job_row(row, i, column_map) for i, row in enumerate(rows) if i > 0 and len(row) > 3]

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
    delivery: Optional[str] = None
    deliver: Optional[str] = None
    payment: Optional[str] = None
    response: Optional[str] = None
    due: Optional[str] = None
    delivery_date: Optional[str] = None

@app.post("/api/send-message", dependencies=[Depends(verify_token)])
def send_message(req: SendMessageRequest):
    try:
        sheet_service.mark_message_sent(req.row_number)
        invalidate_cache()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/send-whatsapp", dependencies=[Depends(verify_token)])
def send_whatsapp_updates():
    """
    Run the existing WhatsApp automation from send_whatsapp.py.
    The script remains the source of truth for message selection, sending, and
    sheet updates; this endpoint only wraps it for authenticated web access.
    """
    project_root = Path(__file__).resolve().parents[2]
    backend_root = project_root / "backend"

    for path in (project_root, backend_root):
        path_str = str(path)
        if path_str not in sys.path:
            sys.path.insert(0, path_str)

    log_buffer = io.StringIO()
    started_at = time.time()

    try:
        from send_whatsapp import main as run_whatsapp_sender

        with contextlib.redirect_stdout(log_buffer):
            result = run_whatsapp_sender()

        if not isinstance(result, dict):
            result = {
                "success": True,
                "sent": 0,
                "failed": 0,
                "duration": f"{time.time() - started_at:.0f} sec",
            }

        result.setdefault("success", True)
        result.setdefault("sent", 0)
        result.setdefault("failed", 0)
        result.setdefault("duration", f"{time.time() - started_at:.0f} sec")
        result["logs"] = [line for line in log_buffer.getvalue().splitlines() if line.strip()]

        invalidate_cache()
        return result

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "duration": f"{time.time() - started_at:.0f} sec",
                "logs": [line for line in log_buffer.getvalue().splitlines() if line.strip()],
            },
        )

@app.patch("/api/jobs/{job_id}", dependencies=[Depends(verify_token)])
@app.put("/api/jobs/{job_id}", dependencies=[Depends(verify_token)])
def update_job(job_id: str, req: UpdateJobRequest):
    """
    Update STATUS, DELIVER, PAYMENT, RESPONSE, DUE, or DELIVERY_DATE columns for a given job.
    Maps job_id to the correct sheet row by scanning all rows.
    Only writes columns that are explicitly provided in the request.
    Never touches columns not in the request.
    """
    rows = get_cached_rows()
    target_row = None
    target_row_values = None

    for i, row in enumerate(rows):
        if i == 0:
            continue
        job_number = str(row[2]).strip() if len(row) > 2 else ""
        if job_number == job_id:
            target_row = i + 1
            target_row_values = row
            break

    if not target_row:
        raise HTTPException(status_code=404, detail="Job not found")

    try:
        requested_delivery = req.deliver if req.deliver is not None else req.delivery
        payload = req.model_dump(exclude_none=True)
        print(f"Incoming update payload for job {job_id}: {payload}")

        if req.status is not None:
            sheet_service.update_cell(target_row, STATUS_COL, req.status)
        if requested_delivery is not None:
            delivery_idx = EXPECTED_COLUMNS["delivery"]
            delivery_date_idx = EXPECTED_COLUMNS["delivery_date"]
            normalized_deliver = requested_delivery.strip().upper()
            current_deliver = str(target_row_values[delivery_idx]).strip().upper() if target_row_values and len(target_row_values) > delivery_idx else ""
            current_delivery_date = str(target_row_values[delivery_date_idx]).strip() if target_row_values and len(target_row_values) > delivery_date_idx else ""
            print(f"Job: {job_id}")
            print("Writing:")
            print(f"Column {DELIVERY_COL} = {requested_delivery}")
            sheet_service.update_cell(target_row, DELIVERY_COL, requested_delivery)
            if normalized_deliver == "YES" and (not current_delivery_date or current_deliver != "YES"):
                delivery_date = req.delivery_date or today_sheet_date()
                print(f"Column {DELIVERY_DATE_COL} = {delivery_date}")
                sheet_service.update_cell(target_row, DELIVERY_DATE_COL, delivery_date)
        if req.payment is not None:
            sheet_service.update_cell(target_row, PAYMENT_COL, req.payment)
        if req.response is not None:
            sheet_service.update_cell(target_row, RESPONSE_COL, req.response)
        if req.due is not None:
            sheet_service.update_cell(target_row, DUE_COL, req.due)
        if req.delivery_date is not None and requested_delivery is None:
            print(f"Job: {job_id}")
            print("Writing:")
            print(f"Column {DELIVERY_DATE_COL} = {req.delivery_date}")
            sheet_service.update_cell(target_row, DELIVERY_DATE_COL, req.delivery_date)
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

    column_map = build_column_map(rows[0])
    jobs = [parse_job_row(row, i, column_map) for i, row in enumerate(rows) if i > 0 and len(row) > 3]
    pending = len(get_pending_jobs(rows, debug=False))
    sent = sum(1 for j in jobs if j["message_status"] == "SENT")

    brands = {}
    brand_revenue = {}
    total_revenue = 0.0
    pending_revenue = 0.0
    paid_jobs = 0
    delivery_history = []
    for j in jobs:
        b = j["brand"].upper() or "UNKNOWN"
        brands[b] = brands.get(b, 0) + 1
        payment = parse_amount(j["payment"])
        due = parse_amount(j["due"])
        total_revenue += payment
        pending_revenue += due
        if payment > 0:
            paid_jobs += 1
            brand_revenue[b] = brand_revenue.get(b, 0.0) + payment
        if j["delivery_date"]:
            delivery_history.append({
                "job_number": j["job_number"],
                "customer_name": j["customer_name"],
                "delivery_date": j["delivery_date"],
                "payment": j["payment"],
                "due": j["due"],
            })

    return {
        "total_customers": len(jobs),
        "pending_messages": pending,
        "sent_messages": sent,
        "delivered_jobs": sum(1 for j in jobs if j["deliver"] == "YES"),
        "success_rate": (sent / (sent + pending) * 100) if (sent + pending) > 0 else 0,
        "brand_distribution": [{"name": k, "value": v} for k, v in brands.items()],
        "total_revenue": total_revenue,
        "pending_revenue": pending_revenue,
        "average_ticket": (total_revenue / paid_jobs) if paid_jobs else 0,
        "completed_jobs": sum(1 for j in jobs if j["deliver"] == "YES"),
        "brand_revenue": [{"name": k, "value": v} for k, v in brand_revenue.items()],
        "delivery_history": delivery_history,
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
