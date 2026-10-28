import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

res_root = client.get("/health")
print("Status /health:", res_root.status_code)
print("Response /health:", res_root.json())

res_v1 = client.get("/api/v1/health")
print("Status /api/v1/health:", res_v1.status_code)
print("Response /api/v1/health:", res_v1.json())
