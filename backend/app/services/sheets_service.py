import logging
from google.oauth2 import service_account
from googleapiclient.discovery import build

from app.core.config import settings


logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


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
                range=f"{sheet_name}!A:K"
            )
            .execute(num_retries=1)
        )

        rows = result.get("values", [])

        print(f"Loaded {len(rows)} rows")

        return rows

    def mark_message_sent(self, row_number):

        service = self._get_service()

        service.spreadsheets().values().update(
            spreadsheetId=settings.GOOGLE_SHEET_ID,
            range=f"{settings.GOOGLE_SHEET_NAME}!K{row_number}",
            valueInputOption="RAW",
            body={
                "values": [["SENT"]]
            }
        ).execute()

        print(f"Marked SENT in row {row_number}")


sheet_service = GoogleSheetService()