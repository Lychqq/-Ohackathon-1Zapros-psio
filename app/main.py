import os
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.schemas import HealthCheckResponse
from app.database import check_db_health
from app.api.v1.health import router as health_router
from app.api.v1.search import router as search_router
from app.api.v1.booking import router as booking_router
from app.api.v1.chat import router as chat_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Сервис комплексного подбора тура (Отель + Перелет + Трансфер) одним запросом на Канарские острова.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Корневой эндпоинт health (для Docker, K8s, внешних чекеров)
@app.get("/health", response_model=HealthCheckResponse, tags=["Health"])
def root_health_check():
    db_ok = check_db_health()
    return HealthCheckResponse(
        status="ok" if db_ok else "degraded",
        version=settings.VERSION,
        database="connected" if db_ok else "disconnected",
        timestamp=datetime.now(timezone.utc).isoformat()
    )

# Подключение роутеров v1
app.include_router(health_router, prefix=settings.API_V1_PREFIX)
app.include_router(search_router, prefix=settings.API_V1_PREFIX)
app.include_router(booking_router, prefix=settings.API_V1_PREFIX)
app.include_router(chat_router, prefix=settings.API_V1_PREFIX)

# Раздача фронтенда (static)
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
