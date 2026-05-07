import sys
import time

sys.path.append("backend")

from app.services.sheets_service import sheet_service
from app.services.job_parser import get_pending_jobs
from app.services.message_builder import build_message

import pywhatkit


rows = sheet_service.get_rows()

pending_jobs = get_pending_jobs(rows)

print("\nSENDING WHATSAPP MESSAGES...\n")


for job in pending_jobs:

    phone_number = job["phone_number"]

    message = build_message(job)

    print(f"Sending to {phone_number}")

    pywhatkit.sendwhatmsg_instantly(
        phone_number,
        message,
        wait_time=12,
        tab_close=True,
        close_time=3
    )

    time.sleep(8)

    sheet_service.mark_message_sent(
        job["row_number"]
    )

    print("Marked SENT")


print("Done.")