from datetime import datetime, timezone
from fastapi import APIRouter
from app.schemas import HealthCheckResponse
from app.database import check_db_health
from app.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthCheckResponse)
def health_check():
    """
    Эндпоинт проверки работоспособности сервиса и доступности PostgreSQL.
    Возвращает 200 OK при живом сервисе.
    """
    db_ok = check_db_health()
    return HealthCheckResponse(
        status="ok" if db_ok else "degraded",
        version=settings.VERSION,
        database="connected" if db_ok else "disconnected",
        timestamp=datetime.now(timezone.utc).isoformat()
    )
