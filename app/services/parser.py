import re
from typing import Dict, Any, List

def parse_user_query(text: str) -> Dict[str, Any]:
    """
    Разбор естественного языка запроса на параметры тура:
    - остров
    - количество ночей
    - количество гостей
    - звездность отеля
    - город вылета
    - пожелания к удобствам
    """
    lower = text.lower()
    
    # 1. Остров
    island = "Tenerife"
    island_ru = "Тенерифе"
    if any(w in lower for w in ["гран-канари", "gran canaria", "маспаломас", "ла-пальмас"]):
        island = "Gran Canaria"
        island_ru = "Гран-Канария"
    elif any(w in lower for w in ["лансароте", "lanzarote", "арресифе"]):
        island = "Lanzarote"
        island_ru = "Лансароте"
    elif any(w in lower for w in ["фуэртевентур", "fuerteventura", "корралехо"]):
        island = "Fuerteventura"
        island_ru = "Фуэртевентура"
    elif any(w in lower for w in ["ла пальма", "ла-пальм", "la palma"]):
        island = "La Palma"
        island_ru = "Ла-Пальма"
    elif any(w in lower for w in ["ла гомера", "ла-гомер", "la gomera"]):
        island = "La Gomera"
        island_ru = "Ла-Гомера"
    elif any(w in lower for w in ["эль йерро", "эль-йерр", "el hierro", "йерро"]):
        island = "El Hierro"
        island_ru = "Эль-Йерро"

    # 2. Ночи
    nights = 7
    nights_match = re.search(r"(\d+)\s*(?:ноч|дн)", lower)
    if nights_match:
        nights = int(nights_match.group(1))
    elif "на две недели" in lower or "14 дней" in lower:
        nights = 14
    elif "на выходные" in lower or "уикенд" in lower:
        nights = 3

    # 3. Гости
    guests = 2
    guests_match = re.search(r"(\d+)\s*(?:гост|человек|взросл|пасс)", lower)
    if guests_match:
        guests = int(guests_match.group(1))
    elif any(w in lower for w in ["один", "одна", "в одиночку", "на одного"]):
        guests = 1
    elif any(w in lower for w in ["двоих", "вдвоем", "на пару"]):
        guests = 2
    elif any(w in lower for w in ["троих", "втроем", "семь", "с ребенком"]):
        guests = 3
    elif "четвер" in lower:
        guests = 4

    # 4. Звездность
    min_stars = 4
    if any(w in lower for w in ["5 звезд", "5*", "пять звезд", "люкс", "luxury", "премиум", "делюкс"]):
        min_stars = 5
    elif any(w in lower for w in ["3 звезд", "3*", "эконом", "недорого"]):
        min_stars = 3

    # 5. Город вылета
    origin_city = "Москва"
    origin_code = "SVO"
    if any(w in lower for w in ["питер", "петербург", "спб", "led"]):
        origin_city = "Санкт-Петербург"
        origin_code = "LED"

    # 6. Локация / район (Маспаломас, Коста-Адехе, Корралехо и т.д.)
    location_keyword = ""
    for kw in ["маспаломас", "maspalomas", "коста-адехе", "адехе", "adeje", "корралехо", "corralejo", "мелонерас", "meloneras", "плая-дель-инглез", "playa del ingles", "пуэрто-де-ла-крус"]:
        if kw in lower:
            location_keyword = kw
            break

    # 7. Удобства
    amenities = []
    if any(w in lower for w in ["бассейн", "pool"]):
        amenities.append("Бассейн")
    if any(w in lower for w in ["первая линия", "у океана", "на берегу", "пляж", "beach"]):
        amenities.append("Первая линия")
    if any(w in lower for w in ["спа", "spa", "талассо"]):
        amenities.append("Спа-комплекс")
    if any(w in lower for w in ["серф", "виндсерф", "водные вид"]):
        amenities.append("Водные виды спорта")
    if any(w in lower for w in ["гольф", "golf"]):
        amenities.append("Гольф-поле")

    has_explicit_island = any(w in lower for w in [
        "тенерифе", "tenerife", "адехе", "арона",
        "гран-канари", "gran canaria", "маспаломас", "ла-пальмас",
        "лансароте", "lanzarote", "арресифе",
        "фуэртевентур", "fuerteventura", "корралехо",
        "ла пальма", "la palma"
    ])

    is_generic_or_vague = (
        not has_explicit_island and (
            any(w in lower for w in [
                "привет", "здравствуй", "добрый", "хей", "салют",
                "что ты можешь", "что можешь", "предложи", "хочу отдохнуть",
                "чот необычное", "что-то необычное", "необычн", "посоветуй",
                "помоги выбрать", "куда поехать", "не знаю", "расскажи"
            ]) or len(text.strip().split()) <= 2
        )
    )

    return {
        "island": island,
        "island_ru": island_ru,
        "has_explicit_island": has_explicit_island,
        "is_generic_or_vague": is_generic_or_vague,
        "nights": nights,
        "guests": guests,
        "min_stars": min_stars,
        "origin_city": origin_city,
        "origin_code": origin_code,
        "location_keyword": location_keyword,
        "amenities": amenities
    }
