import logging
from google.oauth2 import service_account
from googleapiclient.discovery import build

from app.core.config import settings


logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# Column references in the Google Sheet (A=1, B=2, ...)
# L = MESSAGE_STATUS (col 12) — written ONLY by this script
# P = DELIVERY (col 16)
# Q = DELIVERY_DATE (col 17)
MESSAGE_STATUS_COL = "L"
DELIVERY_COL = "P"
DELIVERY_DATE_COL = "Q"
JOB_RANGE = "A:Q"


class GoogleSheetService:

    def __init__(self):
        self._credentials = None
        self._service = None

    def _get_credentials(self):
        if self._credentials:
            return self._credentials
            
        import json
        
        # If running on Render, use the environment variable
        if hasattr(settings, "GOOGLE_CREDENTIALS_JSON") and settings.GOOGLE_CREDENTIALS_JSON:
            try:
                creds_dict = json.loads(settings.GOOGLE_CREDENTIALS_JSON)
                self._credentials = service_account.Credentials.from_service_account_info(
                    creds_dict,
                    scopes=SCOPES
                )
                return self._credentials
            except Exception as e:
                logger.error(f"Failed to parse GOOGLE_CREDENTIALS_JSON: {e}")
                
        # Fallback to local file
        self._credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_SERVICE_FILE,
            scopes=SCOPES
        )
        return self._credentials

    def _get_service(self):
        if self._service:
            return self._service
            
        credentials = self._get_credentials()
        self._service = build(
            "sheets",
            "v4",
            credentials=credentials,
            cache_discovery=False
        )
        return self._service

    def get_rows(self, sheet_name=None):

        sheet_name = sheet_name or settings.GOOGLE_SHEET_NAME

        print("Fetching rows from Google Sheets...")

        service = self._get_service()

        result = (
            service.spreadsheets()
            .values()
            .get(
                spreadsheetId=settings.GOOGLE_SHEET_ID,
                range=f"{sheet_name}!{JOB_RANGE}"
            )
            .execute(num_retries=1)
        )

        rows = result.get("values", [])

        print(f"Loaded {len(rows)} rows")

        return rows

    def mark_message_sent(self, row_number):
        """Write 'SENT' ONLY to the MESSAGE_STATUS column (L).
        The DELIVER column (K) is managed by the team and must NOT be touched.
        """
        service = self._get_service()

        # Explicitly target MESSAGE_STATUS column only — never DELIVER column
        target_range = f"{settings.GOOGLE_SHEET_NAME}!{MESSAGE_STATUS_COL}{row_number}"

        service.spreadsheets().values().update(
            spreadsheetId=settings.GOOGLE_SHEET_ID,
            range=target_range,
            valueInputOption="RAW",
            body={
                "values": [["SENT"]]
            }
        ).execute()

        print(f"Marked SENT in MESSAGE_STATUS column ({MESSAGE_STATUS_COL}{row_number}) — DELIVER column untouched")

    def update_cell(self, row_number: int, column: str, value: str):
        """Write a single value to a specific column in the given row."""
        service = self._get_service()
        target_range = f"{settings.GOOGLE_SHEET_NAME}!{column}{row_number}"

        service.spreadsheets().values().update(
            spreadsheetId=settings.GOOGLE_SHEET_ID,
            range=target_range,
            valueInputOption="RAW",
            body={"values": [[value]]}
        ).execute()

        print(f"Updated {column}{row_number} = {value!r}")


sheet_service = GoogleSheetService()
