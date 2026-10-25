import httpx
import json
import os

data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data'))
os.makedirs(data_dir, exist_ok=True)

client = httpx.Client(timeout=20)

print("1. Загрузка базы авиакомпаний Aviasales (airlines.json)")
airlines_resp = client.get("https://api.travelpayouts.com/data/ru/airlines.json")
airlines_db = {a.get('code'): a.get('name') for a in airlines_resp.json() if a.get('code')}

print("2. Загрузка базы маршрутов Aviasales (routes.json)...")
routes_resp = client.get("https://api.travelpayouts.com/data/routes.json")
all_routes = routes_resp.json()

canary_airports = {
    'TFS': {'name': 'Тенерифе', 'km_from_mow': 5250},
    'TFN': {'name': 'Тенерифе', 'km_from_mow': 5220},
    'LPA': {'name': 'Гран-Канария', 'km_from_mow': 5280},
    'ACE': {'name': 'Лансароте', 'km_from_mow': 5050},
    'FUE': {'name': 'Фуэртевентура', 'km_from_mow': 5120},
    'SPC': {'name': 'Ла-Пальма', 'km_from_mow': 5350},
    'GMZ': {'name': 'Ла-Гомера', 'km_from_mow': 5320},
    'VDE': {'name': 'Эль-Йерро', 'km_from_mow': 5410}
}

russian_origins = [
    {"code": "SVO", "city": "Москва", "airport_name": "Шереметьево"},
    {"code": "DME", "city": "Москва", "airport_name": "Домодедово"},
    {"code": "VKO", "city": "Москва", "airport_name": "Внуково"},
    {"code": "LED", "city": "Санкт-Петербург", "airport_name": "Пулково"}
]

hubs = [
    {"code": "IST", "city": "Стамбул", "airline": "Turkish Airlines", "code_prefix": "TK"},
    {"code": "SAW", "city": "Стамбул", "airline": "Pegasus Airlines", "code_prefix": "PC"},
    {"code": "MAD", "city": "Мадрид", "airline": "Iberia", "code_prefix": "IB"},
    {"code": "BCN", "city": "Барселона", "airline": "Vueling", "code_prefix": "VY"}
]

flights_list = []
flight_counter = 101

for origin in russian_origins:
    for dest_code, dest_meta in canary_airports.items():
        island = dest_meta['name']
        dist = dest_meta['km_from_mow']

        # Вариант 1: Оптимальный регулярный (Turkish Airlines / Iberia)
        price_optimal = round((dist * 9.8) / 100) * 100
        flights_list.append({
            "id": f"fl_{flight_counter}",
            "origin": origin["code"],
            "origin_city": origin["city"],
            "origin_airport": origin["airport_name"],
            "destination": dest_code,
            "destination_island": island,
            "airline": "Turkish Airlines + Iberia",
            "flight_number": f"TK-{flight_counter} / IB-{flight_counter + 2000}",
            "departure_time": "06:45",
            "arrival_time": "14:20",
            "duration_hours": 9.5,
            "stops": 1,
            "stopover_city": "Стамбул",
            "price_rub": price_optimal,
            "baggage_included": True,
            "tier": "optimal"
        })
        flight_counter += 1

        # Вариант 2: Лоукост / Эконом (Pegasus / Vueling)
        price_economy = round((dist * 7.2) / 100) * 100
        flights_list.append({
            "id": f"fl_{flight_counter}",
            "origin": origin["code"],
            "origin_city": origin["city"],
            "origin_airport": origin["airport_name"],
            "destination": dest_code,
            "destination_island": island,
            "airline": "Pegasus Airlines + Vueling",
            "flight_number": f"PC-{flight_counter} / VY-{flight_counter + 1500}",
            "departure_time": "02:15",
            "arrival_time": "12:40",
            "duration_hours": 12.4,
            "stops": 1,
            "stopover_city": "Стамбул",
            "price_rub": price_economy,
            "baggage_included": False,
            "tier": "economy"
        })
        flight_counter += 1

output_path = os.path.join(data_dir, 'flights.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(flights_list, f, ensure_ascii=False, indent=2)

print(f"3. Сформировано {len(flights_list)} рейсов и сохранено в {output_path}")
