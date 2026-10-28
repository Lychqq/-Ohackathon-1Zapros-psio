from fastapi import APIRouter, HTTPException
from app.schemas import SearchRequest, SearchResponse
from app.services.tour_service import build_full_tour

router = APIRouter(tags=["Search"])

@router.post("/search", response_model=SearchResponse)
async def search_tour_package(payload: SearchRequest):
    """
    Основной эндпоинт подбора тура «О!дин запрос»:
    Принимает свободный текст от пользователя, извлекает параметры,
    запрашивает отели из базы данных PostgreSQL (или спарсенного каталога Островка),
    стыкует рейсы Aviasales и трансферы, и возвращает готовый турпакет.
    """
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Запрос не может быть пустым.")

    return build_full_tour(payload.query)
