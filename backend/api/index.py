import sys
from pathlib import Path


# Vercel will use backend/ as the project root. Add that directory explicitly so
# the existing FastAPI package import works both on Vercel and in local checks.
BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.main import app
