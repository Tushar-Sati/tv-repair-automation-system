"""
Interactive script to verify and validate Google Sheets ID from URL.
Helps fix 404 errors caused by incorrect or mistyped spreadsheet IDs.
"""

import sys
import re

sys.path.append("backend")

from app.core.config import settings
from app.services.sheets_service import sheet_service

def extract_id_from_url(url: str) -> str:
    """Extract spreadsheet ID from Google Sheets URL."""
    # Pattern for Google Sheets URLs
    patterns = [
        r'docs\.google\.com/spreadsheets/d/([a-zA-Z0-9-_]+)',  # Standard format
        r'https?://docs\.google\.com/spreadsheets/d/([a-zA-Z0-9-_]+)',  # Full URL
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None

def validate_id_format(sheet_id: str) -> bool:
    """Validate if the ID looks like a valid Google Sheets ID."""
    # Google Sheets IDs are typically 44+ characters with alphanumeric, hyphen, underscore
    if not sheet_id or len(sheet_id) < 40:
        return False
    if not re.match(r'^[a-zA-Z0-9_-]+$', sheet_id):
        return False
    return True

def main():
    print("\n" + "="*70)
    print("  GOOGLE SHEETS ID VERIFICATION TOOL")
    print("="*70 + "\n")
    
    print("Current configuration:")
    print(f"  📊 Spreadsheet ID: {settings.GOOGLE_SHEET_ID}")
    print(f"  📋 Sheet Name: {settings.GOOGLE_SHEET_NAME}\n")
    
    print("OPTIONS:")
    print("  1. Test current configuration")
    print("  2. Verify ID format only")
    print("  3. Update .env with new ID (paste your Google Sheets URL)\n")
    
    choice = input("Select option (1-3): ").strip()
    
    if choice == "1":
        print("\nTesting connection with current ID...")
        try:
            sa_diag = sheet_service.get_service_account_diagnostics()
            print(f"\n✓ Service Account: {sa_diag['service_account_email']}")
            
            sheet_service.test_connection()
            print("✓ Connection successful!")
        
        except Exception as e:
            print(f"\n✗ Error: {e}")
            print("\nAttempting analysis...")
            try:
                analysis = sheet_service.analyze_404_error()
                print(f"\n🔍 ANALYSIS:\n")
                for cause in analysis['possible_causes']:
                    print(f"  • {cause['cause']} ({cause['likelihood']})")
            except:
                pass
    
    elif choice == "2":
        current_id = settings.GOOGLE_SHEET_ID
        is_valid = validate_id_format(current_id)
        print(f"\nID Format Validation: {current_id}")
        print(f"  Length: {len(current_id)} characters")
        print(f"  Valid format: {'✓ YES' if is_valid else '✗ NO'}")
        
        if not is_valid:
            print("\n⚠️  This ID format looks invalid!")
            print("  Google Sheets IDs should be 44+ characters of alphanumeric text, hyphens, and underscores.")
    
    elif choice == "3":
        print("\nPaste your Google Sheets URL below.")
        print("(Example: https://docs.google.com/spreadsheets/d/1ABC123XYZ/edit)\n")
        
        url_input = input("📋 Paste URL: ").strip()
        
        extracted_id = extract_id_from_url(url_input)
        
        if extracted_id:
            print(f"\n✓ Extracted ID: {extracted_id}")
            print(f"  Length: {len(extracted_id)} characters")
            
            is_valid = validate_id_format(extracted_id)
            print(f"  Format valid: {'✓ YES' if is_valid else '✗ NO'}")
            
            if extracted_id != settings.GOOGLE_SHEET_ID:
                print(f"\n⚠️  Different from current ID!")
                print(f"  Current:  {settings.GOOGLE_SHEET_ID}")
                print(f"  Extracted: {extracted_id}")
                
                update = input("\nUpdate .env with extracted ID? (y/n): ").strip().lower()
                
                if update == 'y':
                    try:
                        with open('.env', 'r') as f:
                            content = f.read()
                        
                        # Replace the GOOGLE_SHEET_ID line
                        content = re.sub(
                            r'GOOGLE_SHEET_ID=.*',
                            f'GOOGLE_SHEET_ID={extracted_id}',
                            content
                        )
                        
                        with open('.env', 'w') as f:
                            f.write(content)
                        
                        print(f"\n✓ Updated .env with new ID!")
                        print(f"  Run 'python verify_sheet_id.py' again to test.\n")
                    
                    except Exception as e:
                        print(f"\n✗ Error updating .env: {e}\n")
            else:
                print("\n✓ This ID matches your current configuration.")
        else:
            print("\n✗ Could not extract ID from URL.")
            print("  Make sure you copied the full Google Sheets URL.\n")
    
    else:
        print("Invalid option.\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled.\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Error: {e}\n")
        sys.exit(1)
