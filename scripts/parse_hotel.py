import httpx
import json
import os
import re
import time
islands = {
    "Тенерифе": "spain/canary_islands_tenerife_vicinity",
    "Гран-Канария": "spain/canary_islands_gran_canaria_vicinity",
    "Лансароте": "spain/canary_islands_lanzarote_vicinity",
    "Фуэртевентура": "spain/canary_islands_fuerteventura_vicinity",
    "Ла-Пальма": "spain/canary_islands_la_palma_vicinity",
    "Ла-Гомера": "spain/canary_islands_la_gomera_vicinity",
    "Эль-Йерро": "spain/canary_islands_el_hierro_vicinity",
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
transport = httpx.HTTPTransport(retries=3)
client = httpx.Client(transport=transport, headers=headers, timeout=15, follow_redirects=True)

data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data'))
os.makedirs(data_dir, exist_ok=True)
output_path = os.path.join(data_dir,'hotels.json')


def parse_hotel_card(item, island_name, slug):
    dateless = item.get('datelessRate') or {}
    price_rub = dateless.get('amount') if isinstance(dateless, dict) else None

    raw_images = item.get('images', [])
    images = []
    for img in raw_images[:5]:
        if isinstance(img, dict):
            tmpl = img.get('tmpl') or img.get('url') or ''
            if tmpl:
                images.append(tmpl.replace('{size}', '1024x768'))
        elif isinstance(img, str):
            images.append(img.replace('{size}', '1024x768'))

    raw_amenities = item.get('amenities',[])
    clean_amenities = []
    for a in raw_amenities:
        if isinstance(a, str):
            clean_amenities.append(a)
        elif isinstance(a, dict) and a.get('name'):
            clean_amenities.append(a.get('name'))

    master_id = item.get('masterId')
    hotel_url = f"https://ostrovok.ru/hotel/{slug}/mid{master_id}/" if master_id else None

    return {
        "id": item.get("id") or (str(master_id) if master_id else None),
        "master_id": master_id,
        "name":item.get("name"),
        "island": island_name,
        "price_rub": price_rub,
        "rating": item.get("rating"),
        "stars": item.get("stars"),
        "location": item.get("location"),
        "images": images,
        "amenities": clean_amenities[:10],
        "url": hotel_url,
    }


def parse_island_hotels(island_name, slug):
    page = 1
    island_hotels = []
    total_hotels = None

    while True:
        url = f"https://ostrovok.ru/hotel/{slug}/?page={page}"
        try:
            resp = client.get(url)
            if resp.status_code != 200:
                print(f"[{island_name}] статус {resp.status_code} на странице {page}, завершаем остров")
                break

            match =re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', resp.text)
            if not match:
                print(f"[{island_name}] не найден __NEXT_DATA__ на странице {page}")
                break

            data = json.loads(match.group(1))
            props = data.get("props", {}).get("pageProps", {})
            serp = props.get("serpData", {})

            if total_hotels is None:
                total_hotels = serp.get("totalHotels", 0)

            hotels_on_page = serp.get("hotels",[])
            if not hotels_on_page:
                break

            for h in hotels_on_page:
                parsed = parse_hotel_card(h,island_name, slug)
                island_hotels.append(parsed)

            total_pages = (total_hotels + 19) // 20 if total_hotels else "?"
            print(f"[{island_name}] стр {page}/{total_pages} | загружено: {len(island_hotels)} из {total_hotels}")

            if len(hotels_on_page) < 20 or len(island_hotels) >= total_hotels:
                break

            page += 1
            time.sleep(0.35)

        except Exception as e:
            print(f"[{island_name}] ошибка на странице {page}:", type(e).__name__, "->", e)
            time.sleep(1)
            page += 1

    return island_hotels


all_hotels = []
for name, slug in islands.items():
    print(f"\nСтарт: {name}")
    island_data = parse_island_hotels(name, slug)
    all_hotels.extend(island_data)
    print(f"Завершен {name}: получено {len(island_data)} отелей. Всего накоплено: {len(all_hotels)}")

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_hotels, f, ensure_ascii=False, indent=2)

print(f"\nИтог: собрано {len(all_hotels)} отелей")
print(f"Файл сохранен: {output_path}")
