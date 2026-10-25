import httpx
import json
import os
import re

sources = {
    "Тенерифе": "https://www.taxi-calculator.com/taxi-fare-tenerife/640",
    "Гран-Канария": "https://www.taxi-calculator.com/taxi-fare-las-palmas-de-gran-canaria/641"
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
client = httpx.Client(headers=headers, follow_redirects=True, timeout=15)

print("1. Получение актуального курса EUR/RUB от ЦБ РФ...")
cbr_resp = client.get("https://www.cbr-xml-daily.ru/daily_json.js")
eur_rate = 105.0
if cbr_resp.status_code == 200:
    eur_rate = cbr_resp.json().get("Valute", {}).get("EUR", {}).get("Value", 105.0)
print(f"   Текущий курс ЦБ РФ: 1 EUR = {eur_rate:.2f} RUB")

tariffs = {}

print("\n2. Парсинг официальных тарифов такси с taxi-calculator.com:")
for island, url in sources.items():
    print(f"   Запрос: {url}")
    resp = client.get(url)
    if resp.status_code != 200:
        print(f"   Ошибка HTTP {resp.status_code} для {island}")
        continue

    base_fee_match = re.search(r'Base fee.*?(\d+[\.,]\d+)', resp.text, re.IGNORECASE | re.DOTALL)
    km_fee_match = re.search(r'Price per kilometer.*?(\d+[\.,]\d+)', resp.text, re.IGNORECASE | re.DOTALL)

    base_fee_eur = float(base_fee_match.group(1).replace(',', '.')) if base_fee_match else 3.15
    km_fee_eur = float(km_fee_match.group(1).replace(',', '.')) if km_fee_match else 1.10

    tariffs[island] = {
        "source_url": url,
        "base_fee_eur": base_fee_eur,
        "km_fee_eur": km_fee_eur,
        "base_fee_rub": round(base_fee_eur * eur_rate, 2),
        "km_fee_rub": round(km_fee_eur * eur_rate, 2),
        "vehicle_types": {
            "taxi_standard": {
                "name": "Стандартное такси (Седан)",
                "passengers": 3,
                "base_rub": round(base_fee_eur * eur_rate),
                "km_rub": round(km_fee_eur * eur_rate)
            },
            "minivan_family": {
                "name": "Семейный минивэн (до 6 мест + детские кресла)",
                "passengers": 6,
                "base_rub": round(base_fee_eur * 1.35 * eur_rate),
                "km_rub": round(km_fee_eur * 1.35 * eur_rate)
            },
            "shuttle_bus": {
                "name": "Групповой курортный шаттл",
                "fixed_per_person_rub": round(10.0 * eur_rate)
            }
        }
    }
    print(f"   {island}: Посадка = {base_fee_eur} € ({tariffs[island]['base_fee_rub']} ₽) | 1 км = {km_fee_eur} € ({tariffs[island]['km_fee_rub']} ₽)")

data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data'))
os.makedirs(data_dir, exist_ok=True)
output_path = os.path.join(data_dir, 'transfers.json')

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump({
        "eur_rub_rate": eur_rate,
        "tariffs": tariffs
    }, f, ensure_ascii=False, indent=2)

print(f"\n3. Файл сохранен: {output_path}")
