import httpx
import json
import os

canary_islands_map = {
    'TFS': {'island': 'Тенерифе', 'is_international': True},
    'TFN': {'island': 'Тенерифе', 'is_international': True},
    'LPA': {'island': 'Гран-Канария', 'is_international': True},
    'ACE': {'island': 'Лансароте', 'is_international': True},
    'FUE': {'island': 'Фуэртевентура', 'is_international': True},
    'SPC': {'island': 'Ла-Пальма', 'is_international': True},
    'GMZ': {'island': 'Ла-Гомера','is_international': False},
    'VDE': {'island': 'Эль-Йерро', 'is_international': False},
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
client =httpx.Client(headers=headers, timeout=15)

print("Загрузка официальной базы аэропортов Aviasales (Travelpayouts Data API)...")
url = "https://api.travelpayouts.com/data/ru/airports.json"

try:
    resp = client.get(url)
    if resp.status_code != 200:
        print(f"Ошибка HTTP {resp.status_code} при обращении к {url}")
        exit(1)

    all_airports = resp.json()
    print(f"Всего аэропортов в базе Aviasales: {len(all_airports)}")

    airports_data = {}
    for item in all_airports:
        code = item.get('code')
        if code in canary_islands_map:
            meta = canary_islands_map[code]
            coords = item.get('coordinates', {})
            airports_data[code] = {
                'code': code,
                'name': item.get('name'),
                'island': meta['island'],
                'city_code': item.get('city_code'),
                'country_code':item.get('country_code'),
                'lat': coords.get('lat'),
                'lon': coords.get('lon'),
                'is_international':meta['is_international']
            }
            print(f"  [{code}] {item.get('name')} | Остров: {meta['island']} | lat: {coords.get('lat')}, lon: {coords.get('lon')}")

    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__),'../data'))
    os.makedirs(data_dir, exist_ok=True)
    output_path = os.path.join(data_dir, 'airports.json')

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(airports_data, f, ensure_ascii=False, indent=2)

    print(f"\nУспешно собрано аэропортов: {len(airports_data)} из 8")
    print(f"Сохранено в: {output_path}")

except Exception as e:
    print("Ошибка парсинга базы аэропортов:", type(e).__name__, "->", e)
