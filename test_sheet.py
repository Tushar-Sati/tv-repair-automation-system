import sys

sys.path.append("backend")

from app.services.sheets_service import sheet_service
from app.services.job_parser import get_pending_jobs


rows = sheet_service.get_rows()

pending_jobs = get_pending_jobs(rows)

print("\nPENDING JOBS:\n")

for job in pending_jobs:

    print(job)