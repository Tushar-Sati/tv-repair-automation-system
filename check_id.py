#!/usr/bin/env python3
"""Quick ID format check"""
import sys
sys.path.append("backend")

from app.core.config import settings

print("="*60)
print("SPREADSHEET ID ANALYSIS")
print("="*60)
print(f"\nCurrent ID: {settings.GOOGLE_SHEET_ID}")
print(f"Length: {len(settings.GOOGLE_SHEET_ID)} characters\n")

id_str = settings.GOOGLE_SHEET_ID

print("Character Analysis:")
print(f"  ✓ Contains lowercase 'l': {'YES ⚠️' if 'l' in id_str else 'NO'}")
print(f"  ✓ Contains uppercase 'I': {'YES ⚠️' if 'I' in id_str else 'NO'}")
print(f"  ✓ Contains '0' (zero):   {'YES ⚠️' if '0' in id_str else 'NO'}")
print(f"  ✓ Contains 'O' (letter): {'YES ⚠️' if 'O' in id_str else 'NO'}")
print(f"  ✓ Contains '-' (hyphen): {'YES' if '-' in id_str else 'NO'}")
print(f"  ✓ Contains '_' (under):  {'YES' if '_' in id_str else 'NO'}")

print("\n" + "="*60)
print("⚠️  IMPORTANT:")
print("="*60)
print("\nYour spreadsheet ID contains characters that commonly get confused:")
print("  - Lowercase 'l' could be uppercase 'I'")
print("  - Uppercase 'I' could be lowercase 'l'")
print("  - '0' (zero) could be 'O' (letter)")
print("  - 'O' (letter) could be '0' (zero)")

print("\n📌 TO FIX THE 404 ERROR:")
print("\n  1. Open your Google Sheet in a browser")
print("  2. Copy the URL from the address bar")
print("  3. Run: python verify_sheet_id.py")
print("  4. Select option 3 to extract and verify the ID")

print("\n" + "="*60)
