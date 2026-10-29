from fastapi import APIRouter, HTTPException
from app.schemas import ChatRequest, ChatResponse
from app.services.llm import generate_chat_response
from app.services.tour_service import get_hotels_for_trip, get_flights_for_trip, get_transfers_for_trip

router = APIRouter(tags=["Chat"])

def detect_island(text: str) -> str:
    lower = text.lower()
    if any(k in lower for k in ["ла-гомер", "ла гомер", "la gomera", "гомер"]): return "Ла-Гомера"
    if any(k in lower for k in ["эль-йерр", "эль йерр", "el hierro", "йерро"]): return "Эль-Йерро"
    if any(k in lower for k in ["ла-пальм", "ла пальм", "la palma"]): return "Ла-Пальма"
    if any(k in lower for k in ["фуэртевентур", "fuerteventura"]): return "Фуэртевентура"
    if any(k in lower for k in ["лансароте", "lanzarote"]): return "Лансароте"
    if any(k in lower for k in ["гран-канари", "gran canaria", "маспаломас"]): return "Гран-Канария"
    return "Тенерифе"

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(payload: ChatRequest):
    """
    Эндпоинт живого диалога с AI-агентом Островка.
    Обогащает контекст реальными данными из БД/датасетов для любого упоминаемого острова!
    """
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Сообщение не может быть пустым.")

    messages = [{"role": m.role, "content": m.content} for m in payload.history]
    messages.append({"role": "user", "content": payload.message})

    trip_ctx = payload.trip_context or {}

    # Если отели еще не переданы или пустые — подтягиваем РЕАЛЬНЫЕ данные из базы по острову!
    if not trip_ctx.get("available_hotels"):
        # Определяем остров из контекста, текущего сообщения или всей истории сообщений
        island = trip_ctx.get("island_ru") or trip_ctx.get("island")
        if not island:
            # Ищем сначала в текущем сообщении
            island = detect_island(payload.message)
            # Если по дефолту определился Тенерифе, проверяем историю диалога (не называл ли пользователь Ла-Гомеру ранее)
            if island == "Тенерифе" and payload.history:
                all_text = " ".join([m.content for m in payload.history])
                history_island = detect_island(all_text)
                if history_island != "Тенерифе" or "тенериф" in all_text.lower():
                    island = history_island
        
        real_hotels = get_hotels_for_trip(island)
        real_flights = get_flights_for_trip(island)
        real_transfers = get_transfers_for_trip(island)

        trip_ctx["island_ru"] = island
        trip_ctx["island"] = island
        trip_ctx["available_hotels"] = [
            {
                "id": h.id,
                "name": h.name,
                "stars": h.stars,
                "rating": h.rating,
                "price": int(h.price_night),
                "features": h.amenities[:3],
                "area": h.location
            }
            for h in real_hotels[:4]
        ]
        trip_ctx["available_flights"] = [
            {
                "id": f.id,
                "airline": f.airline,
                "time": f.departure_time,
                "price": int(f.price_total)
            }
            for f in real_flights[:2]
        ]
        trip_ctx["available_transfers"] = [
            {
                "id": t.id,
                "type": t.vehicle,
                "price": int(t.price)
            }
            for t in real_transfers[:2]
        ]

    result = await generate_chat_response(messages=messages, trip_context=trip_ctx)

    return ChatResponse(
        reply=result.get("reply", ""),
        ui_actions=result.get("ui_actions", [])
    )
