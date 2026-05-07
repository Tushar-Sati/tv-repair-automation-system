import os
import re
import logging
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class SpreadsheetIDValidator:
    """Validates Google Sheets ID format and detects common character mistakes."""
    
    # Google Sheets IDs are typically 44 characters of alphanumeric, hyphen, and underscore
    VALID_PATTERN = r"^[a-zA-Z0-9_-]{44,}$"
    
    @staticmethod
    def validate_format(sheet_id: str) -> tuple[bool, str]:
        """
        Validate spreadsheet ID format and detect common mistakes.
        
        Returns:
            (is_valid, message)
        """
        if not sheet_id:
            return False, "GOOGLE_SHEET_ID is empty or not set in .env"
        
        sheet_id = sheet_id.strip()
        
        # Check basic format
        if not re.match(SpreadsheetIDValidator.VALID_PATTERN, sheet_id):
            return False, f"Invalid format: ID should be alphanumeric with hyphens/underscores, got: {sheet_id}"
        
        # Detect common character mistakes
        mistakes = []
        
        # Check for lowercase 'l' that might be uppercase 'I'
        if 'l' in sheet_id:
            mistakes.append("Contains lowercase 'l' (could be uppercase 'I')")
        
        # Check for '0' that might be 'O'
        if '0' in sheet_id:
            mistakes.append("Contains '0' (could be 'O')")
        
        # Check for uppercase 'O' that might be '0'
        if 'O' in sheet_id:
            mistakes.append("Contains uppercase 'O' (could be '0')")
        
        # Check for uppercase 'I' that might be lowercase 'l'
        if 'I' in sheet_id:
            mistakes.append("Contains uppercase 'I' (could be lowercase 'l')")
        
        if mistakes:
            warning_msg = f"Potential character mistakes detected: {', '.join(mistakes)}"
            # logger.warning(f"{warning_msg} in ID: {sheet_id}")
        
        return True, f"Valid spreadsheet ID format ({len(sheet_id)} characters)"


class Settings:
    """Configuration settings with validation for Google Sheets integration."""
    
    def __init__(self):
        self._google_sheet_id = os.getenv("GOOGLE_SHEET_ID", "").strip()
        self._google_sheet_name = os.getenv("GOOGLE_SHEET_NAME", "Sheet1").strip()
        self._google_service_file = "google-service-account.json"
        
        # Validate configuration on initialization
        self._validate_configuration()
    
    @property
    def GOOGLE_SHEET_ID(self) -> str:
        return self._google_sheet_id
    
    @property
    def GOOGLE_SHEET_NAME(self) -> str:
        return self._google_sheet_name
    
    @property
    def GOOGLE_SERVICE_FILE(self) -> str:
        return self._google_service_file
    
    def _validate_configuration(self) -> None:
        """Validate all configuration settings on initialization."""
        # Validate spreadsheet ID
        is_valid, message = SpreadsheetIDValidator.validate_format(self._google_sheet_id)
        logger.debug(f"Spreadsheet ID validation: {message}")
        
        if not is_valid:
            logger.error(f"Configuration validation failed: {message}")
            raise ValueError(f"Invalid configuration: {message}")
        
        # Validate sheet name
        if not self._google_sheet_name:
            logger.error("GOOGLE_SHEET_NAME is empty or not set in .env")
            raise ValueError("GOOGLE_SHEET_NAME must be set in .env")
        
        # Validate service account file exists
        if not Path(self._google_service_file).exists():
            logger.error(f"Service account file not found: {self._google_service_file}")
            raise FileNotFoundError(f"Service account file not found: {self._google_service_file}")
        
        # Log configuration summary for debugging
        logger.debug(
            f"Google Sheets Configuration:\n"
            f"  - Spreadsheet ID: {self._google_sheet_id}\n"
            f"  - Sheet Name: {self._google_sheet_name}\n"
            f"  - Service Account File: {Path(self._google_service_file).absolute()}"
        )
    
    def get_debug_info(self) -> dict:
        """Return debug information about current configuration."""
        return {
            "spreadsheet_id": self.GOOGLE_SHEET_ID,
            "sheet_name": self.GOOGLE_SHEET_NAME,
            "credential_file_path": str(Path(self.GOOGLE_SERVICE_FILE).absolute()),
            "credential_file_exists": Path(self.GOOGLE_SERVICE_FILE).exists(),
        }


settings = Settings()