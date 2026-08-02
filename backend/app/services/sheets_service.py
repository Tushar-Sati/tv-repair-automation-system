import logging

from google.oauth2 import service_account
from googleapiclient.discovery import build

from app.core.config import settings


logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


def column_index(column_letter: str) -> int:
    """Return the zero-based index for a Google Sheets column letter."""
    index = 0
    for char in column_letter.upper():
        index = index * 26 + (ord(char) - ord("A") + 1)
    return index - 1


# Single source of truth for the current Google Sheet layout.
# Q is intentionally unused and must never be written by backend code.
SHEET_COLUMN_LETTERS = {
    "date": "A",
    "customer_name": "B",
    "job_number": "C",
    "contact": "D",
    "brand": "E",
    "model_no": "F",
    "serial_no": "G",
    "symptoms": "H",
    "part_replacement": "I",
    "status": "J",
    "delivery": "K",
    "message_status": "L",
    "payment": "M",
    "response": "N",
    "due": "O",
    "delivery_date": "P",
}

FIELD_COLUMN_INDEXES = {
    field: column_index(column)
    for field, column in SHEET_COLUMN_LETTERS.items()
}

STATUS_COL = SHEET_COLUMN_LETTERS["status"]
DELIVERY_COL = SHEET_COLUMN_LETTERS["delivery"]
MESSAGE_STATUS_COL = SHEET_COLUMN_LETTERS["message_status"]
PAYMENT_COL = SHEET_COLUMN_LETTERS["payment"]
RESPONSE_COL = SHEET_COLUMN_LETTERS["response"]
DUE_COL = SHEET_COLUMN_LETTERS["due"]
DELIVERY_DATE_COL = SHEET_COLUMN_LETTERS["delivery_date"]
JOB_RANGE = "A:P"


class GoogleSheetService:

    def __init__(self):
        self._credentials = None
        self._service = None

    def _get_credentials(self):
        if self._credentials:
            return self._credentials

        import json

        # If running on Render, use the environment variable.
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

        # Fallback to local file.
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
        The DELIVERY column (K) is managed by job updates and must NOT be touched.
        """
        service = self._get_service()

        # Explicitly target MESSAGE_STATUS column only - never DELIVERY column.
        target_range = f"{settings.GOOGLE_SHEET_NAME}!{MESSAGE_STATUS_COL}{row_number}"

        service.spreadsheets().values().update(
            spreadsheetId=settings.GOOGLE_SHEET_ID,
            range=target_range,
            valueInputOption="RAW",
            body={
                "values": [["SENT"]]
            }
        ).execute()

        print(f"Marked SENT in MESSAGE_STATUS column ({MESSAGE_STATUS_COL}{row_number}) - DELIVERY column untouched")

    def update_cell(self, row_number: int, column: str, value: str):
        """Write a single value to a specific column in the given row."""
        if column.upper() == "Q":
            raise ValueError("Backend must not write to unused Google Sheets column Q")

        service = self._get_service()
        target_range = f"{settings.GOOGLE_SHEET_NAME}!{column}{row_number}"

        print(f"Updating {column}{row_number} = {value}")

        service.spreadsheets().values().update(
            spreadsheetId=settings.GOOGLE_SHEET_ID,
            range=target_range,
            valueInputOption="RAW",
            body={"values": [[value]]}
        ).execute()


sheet_service = GoogleSheetService()
