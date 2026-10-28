import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. Health test
r_health = client.get("/api/v1/health")
print("1. Health:", r_health.status_code, r_health.json()["status"])

# 2. Search test - Tenerife
r_search_ten = client.post("/api/v1/search", json={"query": "Тенерифе на двоих на 7 ночей, отель 5 звезд с бассейном у океана"})
assert r_search_ten.status_code == 200
data_ten = r_search_ten.json()
print("2. Search Tenerife:", r_search_ten.status_code, "Island:", data_ten["island_ru"], "Hotel:", data_ten["selected_hotel"]["name"], "Total:", data_ten["grand_total"])

# 3. Search test - Gran Canaria
r_search_gc = client.post("/api/v1/search", json={"query": "Гран-Канария, 7 ночей, отель рядом с дюнами"})
assert r_search_gc.status_code == 200
data_gc = r_search_gc.json()
print("3. Search Gran Canaria:", r_search_gc.status_code, "Island:", data_gc["island_ru"], "Hotel:", data_gc["selected_hotel"]["name"])

# 4. Search test - Lanzarote
r_search_lanz = client.post("/api/v1/search", json={"query": "Лансароте спа-отель на первой линии"})
assert r_search_lanz.status_code == 200
data_lanz = r_search_lanz.json()
print("4. Search Lanzarote:", r_search_lanz.status_code, "Island:", data_lanz["island_ru"], "Hotels count:", len(data_lanz["hotels"]))

# 5. Book test
r_book = client.post("/api/v1/book", json={
    "hotel_id": data_ten["selected_hotel"]["id"],
    "flight_id": data_ten["selected_flight"]["id"],
    "transfer_id": data_ten["selected_transfer"]["id"],
    "nights": 7,
    "guests": 2
})
assert r_book.status_code == 200
print("5. Booking:", r_book.status_code, r_book.json()["order_id"], r_book.json()["status"])

print("ALL API TESTS PASSED!")
