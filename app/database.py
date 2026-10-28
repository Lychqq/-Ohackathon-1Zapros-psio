from sqlmodel import create_engine, Session, text
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    connect_args={"connect_timeout": 3},
)

def check_db_health() -> bool:
    """Проверка доступности базы данных PostgreSQL"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            return True
    except Exception:
        return False

def get_db():
    """Dependency для внедрения сессии SQLModel в эндпоинты FastAPI"""
    with Session(engine) as session:
        yield session
