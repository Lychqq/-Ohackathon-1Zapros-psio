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

    ui_acts = result.get("ui_actions", [])
    has_build = any(a.get("type") in ["build_tour", "switch_island"] for a in ui_acts)
    all_text = " ".join([m.content for m in payload.history] + [payload.message]).lower()
    has_chosen_hotel = bool(
        trip_ctx.get("hotel_id") or 
        trip_ctx.get("selected_hotel_id") or 
        any(k in all_text for k in ["llano campo", "hermigua", "los herrera", "la punta", "bellavista", "botanico", "anthelia", "yaiza", "castillo"])
    )

    if has_build and not has_chosen_hotel:
        ui_acts = [a for a in ui_acts if a.get("type") not in ["build_tour", "switch_island"]]
        hotels = trip_ctx.get("available_hotels", [])
        options = []
        for h in hotels[:4]:
            h_name = h.get("name", "Отель")
            h_stars = h.get("stars", 3)
            h_price = h.get("price", 0)
            options.append({
                "id": str(h.get("id")),
                "text": f"{h_name} ({h_stars}★, от {h_price:,} ₽/ночь)"
            })
        if options:
            ui_acts.append({
                "type": "show_quiz",
                "question": "Какой вариант проживания вам ближе?",
                "options": options
            })
            result["reply"] = "Отлично, зафиксировал гостей! Теперь выберите отель на Ла-Гомере из проверенных вариантов:"
    return ChatResponse(
        reply=result.get("reply", ""),
        ui_actions=ui_acts
    )
