import logging
from google.oauth2 import service_account
from googleapiclient.discovery import build

from app.core.config import settings


logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# Column references in the Google Sheet (A=1, B=2, ...)
# K = DELIVER (col 11)  — managed by the team; never written by this script
# L = MESSAGE_STATUS (col 12) — written ONLY by this script
DELIVER_COL = "K"
MESSAGE_STATUS_COL = "L"


class GoogleSheetService:

    def __init__(self):

        self._credentials = None
        self._service = None

    def _get_credentials(self):

        if self._credentials is None:

            self._credentials = (
                service_account.Credentials
                .from_service_account_file(
                    settings.GOOGLE_SERVICE_FILE,
                    scopes=SCOPES
                )
            )

        return self._credentials

    def _get_service(self):

        if self._service is None:

            credentials = self._get_credentials()

            self._service = build(
                "sheets",
                "v4",
                credentials=credentials
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
                range=f"{sheet_name}!A:M"
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


sheet_service = GoogleSheetService()