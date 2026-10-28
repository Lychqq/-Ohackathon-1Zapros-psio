from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Index
from sqlalchemy.dialects.postgresql import JSONB

class Hotel(SQLModel, table=True):
    __tablename__ = "hotels"

    id: str = Field(primary_key=True, max_length=150)
    master_id: Optional[str] = Field(default=None, max_length=50)
    name: str = Field(index=True, max_length=255)
    island: str = Field(index=True, max_length=50)
    price_rub: Optional[float] = Field(default=None, index=True)
    rating: Optional[float] = Field(default=None, index=True)
    stars: Optional[int] = Field(default=None, index=True)
    location: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSONB))
    images: Optional[List[str]] = Field(default=None, sa_column=Column(JSONB))
    amenities: Optional[List[str]] = Field(default=None, sa_column=Column(JSONB))
    url: Optional[str] = Field(default=None)

    __table_args__ = (
        Index("idx_hotels_island_stars", "island", "stars"),
        Index("idx_hotels_island_price", "island", "price_rub"),
        Index("idx_hotels_amenities_gin", "amenities", postgresql_using="gin"),
    )

class Flight(SQLModel, table=True):
    __tablename__ = "flights"

    id: str = Field(primary_key=True, max_length=50)
    origin: str = Field(index=True, max_length=10)
    origin_city: str = Field(max_length=100)
    origin_airport: Optional[str] = Field(default=None, max_length=100)
    destination: str = Field(index=True, max_length=10)
    destination_island: str = Field(index=True, max_length=50)
    airline: str = Field(max_length=150)
    flight_number: str = Field(max_length=50)
    departure_time: str = Field(max_length=10)
    arrival_time: str = Field(max_length=10)
    duration_hours: Optional[float] = Field(default=None)
    stops: int = Field(default=1)
    stopover_city: Optional[str] = Field(default=None, max_length=100)
    price_rub: float = Field(index=True)
    baggage_included: bool = Field(default=True)
    tier: str = Field(default="optimal", max_length=50)

class Airport(SQLModel, table=True):
    __tablename__ = "airports"

    code: str = Field(primary_key=True, max_length=10)
    name: str = Field(max_length=150)
    island: str = Field(index=True, max_length=50)
    city_code: Optional[str] = Field(default=None, max_length=10)
    country_code: Optional[str] = Field(default=None, max_length=10)
    lat: Optional[float] = Field(default=None)
    lon: Optional[float] = Field(default=None)
    is_international: bool = Field(default=True)

class TransferTariff(SQLModel, table=True):
    __tablename__ = "transfer_tariffs"

    id: str = Field(primary_key=True, max_length=100)
    island: str = Field(index=True, max_length=50)
    vehicle_type: str = Field(max_length=50)
    name: str = Field(max_length=150)
    passengers: int = Field(default=3)
    base_rub: float
    km_rub: float
