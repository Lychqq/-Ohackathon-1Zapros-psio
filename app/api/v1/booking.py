import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.schemas import BookRequest, BookResponse

router = APIRouter(tags=["Booking"])

@router.post("/book", response_model=BookResponse)
def create_booking(payload: BookRequest):
    """
    Эндпоинт единого бронирования всего пакета поездки.
    Фиксирует отель, билеты на перелет и трансфер под единым номером заказа.
    """
    if not payload.hotel_id or not payload.flight_id or not payload.transfer_id:
        raise HTTPException(
            status_code=400,
            detail="Для бронирования тура целиком необходимы выбранные hotel_id, flight_id и transfer_id."
        )

    order_id = f"OST-{uuid.uuid4().hex[:8].upper()}"
    now_iso = datetime.now(timezone.utc).isoformat()

    return BookResponse(
        order_id=order_id,
        status="confirmed",
        created_at=now_iso,
        summary={
            "hotel_id": payload.hotel_id,
            "flight_id": payload.flight_id,
            "transfer_id": payload.transfer_id,
            "nights": payload.nights,
            "guests": payload.guests,
            "contact_name": payload.contact_name or "Гость",
        },
        total_price=0.0  # Рассчитывается динамически на клиенте / в БД
    )
