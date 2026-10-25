import json
import os
import time
from sqlalchemy import (
    Boolean,
    Column,
    Float,
    Index,
    Integer,
    MetaData,
    String,
    Table,
    Text,
    create_engine,
)
from sqlalchemy.dialects.postgresql import JSONB, insert

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_NAME = os.getenv("DB_NAME", "odin_canary")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# 1. Автоматическая проверка и создание БД через дефолтное подключение
try:
    import psycopg
    conn_info = f"host={DB_HOST} port={DB_PORT} user={DB_USER} password={DB_PASSWORD} dbname=postgres"
    with psycopg.connect(conn_info, autocommit=True) as p_conn:
        with p_conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))
            if not cur.fetchone():
                print(f"Создаем базу данных {DB_NAME}...")
                cur.execute(f"CREATE DATABASE {DB_NAME}")
            else:
                print(f"База данных {DB_NAME} найдена.")
except Exception as e:
    print(f"Проверка базы данных: {e}")

# 2. Инициализация SQLAlchemy Engine и MetaData
engine = create_engine(DATABASE_URL, echo=False)
metadata = MetaData()

# Таблица островов
islands_table = Table(
    "islands",
    metadata,
    Column("name", String(50), primary_key=True),
    Column("ostrovok_region_id", Integer, nullable=True)
)

# Таблица аэропортов
airports_table = Table(
    "airports",
    metadata,
    Column("code", String(5), primary_key=True),
    Column("name", String(150), nullable=False),
    Column("island", String(50), nullable=False, index=True),
    Column("city_code", String(10), nullable=True),
    Column("country_code", String(5), nullable=True),
    Column("lat", Float, nullable=True),
    Column("lon", Float, nullable=True),
    Column("is_international", Boolean, default=True)
)

# Таблица отелей с GIN индексом по удобствам
hotels_table = Table(
    "hotels",
    metadata,
    Column("id", String(350), primary_key=True),
    Column("master_id", Integer, nullable=True),
    Column("name", String(500), nullable=False),
    Column("island", String(50), nullable=False, index=True),
    Column("price_rub", Float, nullable=True, index=True),
    Column("rating", Float, nullable=True, index=True),
    Column("stars", Integer, nullable=True, index=True),
    Column("location", JSONB, nullable=True),
    Column("images", JSONB, nullable=True),
    Column("amenities", JSONB, nullable=True),
    Column("url", Text, nullable=True),
    Index("idx_hotels_amenities_gin", "amenities", postgresql_using="gin")
)

# Таблица авиаперелетов
flights_table = Table(
    "flights",
    metadata,
    Column("id", String(50), primary_key=True),
    Column("origin", String(5), nullable=False, index=True),
    Column("origin_city", String(50), nullable=False),
    Column("origin_airport", String(100), nullable=True),
    Column("destination", String(5), nullable=False, index=True),
    Column("destination_island", String(50), nullable=False, index=True),
    Column("airline", String(100), nullable=False),
    Column("flight_number", String(50), nullable=False),
    Column("departure_time", String(10), nullable=False),
    Column("arrival_time", String(10), nullable=False),
    Column("duration_hours", Float, nullable=False),
    Column("stops", Integer, default=1),
    Column("stopover_city", String(50), nullable=True),
    Column("price_rub", Float, nullable=False, index=True),
    Column("baggage_included", Boolean, default=True),
    Column("tier", String(20), default="optimal"),
    Index("idx_flights_route", "origin", "destination")
)

# Таблица тарифов трансферов
transfers_table = Table(
    "transfer_tariffs",
    metadata,
    Column("island", String(50), primary_key=True),
    Column("source_url", Text, nullable=True),
    Column("base_fee_eur", Float, nullable=True),
    Column("km_fee_eur", Float, nullable=True),
    Column("base_fee_rub", Float, nullable=True),
    Column("km_fee_rub", Float, nullable=True),
    Column("vehicle_types", JSONB, nullable=True)
)

print("Создание таблиц и индексов через SQLAlchemy metadata.create_all()...")
metadata.create_all(engine)
print("Схема БД готова.")

data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data'))
start_time = time.time()

with engine.begin() as conn:
    # 1. Загрузка островов
    islands_file = os.path.join(data_dir, 'canary_islands.json')
    if os.path.exists(islands_file):
        with open(islands_file, 'r', encoding='utf-8') as f:
            islands_data = json.load(f)
        island_rows = [{"name": k, "ostrovok_region_id": v} for k, v in islands_data.items()]
        stmt = insert(islands_table).values(island_rows)
        stmt = stmt.on_conflict_do_update(
            index_elements=[islands_table.c.name],
            set_={"ostrovok_region_id": stmt.excluded.ostrovok_region_id}
        )
        conn.execute(stmt)
        print(f"Загружено островов: {len(island_rows)}")

    # 2. Загрузка аэропортов
    airports_file = os.path.join(data_dir, 'airports.json')
    if os.path.exists(airports_file):
        with open(airports_file, 'r', encoding='utf-8') as f:
            airports_data = json.load(f)
        airport_rows = [
            {
                "code": a["code"],
                "name": a["name"],
                "island": a["island"],
                "city_code": a.get("city_code"),
                "country_code": a.get("country_code"),
                "lat": a.get("lat"),
                "lon": a.get("lon"),
                "is_international": a.get("is_international", True)
            }
            for a in airports_data.values()
        ]
        stmt = insert(airports_table).values(airport_rows)
        stmt = stmt.on_conflict_do_update(
            index_elements=[airports_table.c.code],
            set_={
                "name": stmt.excluded.name,
                "island": stmt.excluded.island,
                "lat": stmt.excluded.lat,
                "lon": stmt.excluded.lon
            }
        )
        conn.execute(stmt)
        print(f"Загружено аэропортов: {len(airport_rows)}")

    # 3. Загрузка трансферов
    transfers_file = os.path.join(data_dir, 'transfers.json')
    if os.path.exists(transfers_file):
        with open(transfers_file, 'r', encoding='utf-8') as f:
            transfers_data = json.load(f)
        tariffs = transfers_data.get('tariffs', {})
        transfer_rows = [
            {
                "island": island,
                "source_url": t.get("source_url"),
                "base_fee_eur": t.get("base_fee_eur"),
                "km_fee_eur": t.get("km_fee_eur"),
                "base_fee_rub": t.get("base_fee_rub"),
                "km_fee_rub": t.get("km_fee_rub"),
                "vehicle_types": t.get("vehicle_types", {})
            }
            for island, t in tariffs.items()
        ]
        if transfer_rows:
            stmt = insert(transfers_table).values(transfer_rows)
            stmt = stmt.on_conflict_do_update(
                index_elements=[transfers_table.c.island],
                set_={
                    "base_fee_rub": stmt.excluded.base_fee_rub,
                    "km_fee_rub": stmt.excluded.km_fee_rub,
                    "vehicle_types": stmt.excluded.vehicle_types
                }
            )
            conn.execute(stmt)
            print(f"Загружено тарифов трансферов: {len(transfer_rows)}")

    # 4. Загрузка рейсов
    flights_file = os.path.join(data_dir, 'flights.json')
    if os.path.exists(flights_file):
        with open(flights_file, 'r', encoding='utf-8') as f:
            flights_data = json.load(f)
        stmt = insert(flights_table).values(flights_data)
        stmt = stmt.on_conflict_do_update(
            index_elements=[flights_table.c.id],
            set_={"price_rub": stmt.excluded.price_rub}
        )
        conn.execute(stmt)
        print(f"Загружено авиарейсов: {len(flights_data)}")

    # 5. Загрузка 19 689 отелей пачками
    hotels_file = os.path.join(data_dir, 'hotels.json')
    if os.path.exists(hotels_file):
        print("Чтение hotels.json...")
        with open(hotels_file, 'r', encoding='utf-8') as f:
            hotels_data = json.load(f)

        total_hotels = len(hotels_data)
        print(f"Заливка {total_hotels} отелей через SQLAlchemy Core...")

        hotel_rows = [
            {
                "id": h.get("id") or str(h.get("master_id")),
                "master_id": h.get("master_id"),
                "name": h.get("name"),
                "island": h.get("island"),
                "price_rub": h.get("price_rub"),
                "rating": h.get("rating"),
                "stars": h.get("stars"),
                "location": h.get("location") or {},
                "images": h.get("images") or [],
                "amenities": h.get("amenities") or [],
                "url": h.get("url")
            }
            for h in hotels_data
        ]

        stmt = insert(hotels_table)
        stmt = stmt.on_conflict_do_update(
            index_elements=[hotels_table.c.id],
            set_={
                "price_rub": stmt.excluded.price_rub,
                "rating": stmt.excluded.rating,
                "stars": stmt.excluded.stars
            }
        )
        batch_size = 1000
        for i in range(0, total_hotels, batch_size):
            batch = hotel_rows[i:i + batch_size]
            conn.execute(stmt, batch)
            print(f"  Залито {min(i + batch_size, total_hotels)} / {total_hotels} отелей...")

        print(f"Все {total_hotels} отелей сохранены в базе данных.")

elapsed = round(time.time() - start_time, 2)
print(f"\nСидирование завершено за {elapsed} сек.")
