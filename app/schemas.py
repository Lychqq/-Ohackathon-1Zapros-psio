from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# --- Health Check ---
class HealthCheckResponse(BaseModel):
    status: str = Field(default="ok", description="Общий статус сервиса")
    version: str = Field(default="0.1.0", description="Версия API")
    database: str = Field(default="connected", description="Статус подключения к PostgreSQL")
    timestamp: str = Field(description="Текущее серверное время в ISO формате")

# --- Hotel Schema ---
class HotelItem(BaseModel):
    id: str
    name: str
    island: str
    island_ru: str
    stars: int
    rating: float
    reviews_count: int
    match_score: int = 95
    price_night: float
    exact_address: str
    location: str
    desc: str
    amenities: List[str]
    image: str

# --- Flight Schema ---
class FlightItem(BaseModel):
    id: str
    airline: str
    flight_number: str
    origin: str
    origin_city: str
    destination: str
    destination_island: str
    departure_time: str
    arrival_time: str
    duration: str
    stops: int = 1
    price_total: float
    baggage: str

# --- Transfer Schema ---
class TransferItem(BaseModel):
    id: str
    island: str
    vehicle: str
    desc: str
    route: str
    price: float

# --- Timeline Step ---
class TimelineStep(BaseModel):
    time: str
    title: str
    desc: str
    step_type: str = "flight"  # flight | transfer | hotel

# --- Search Request & Response ---
class SearchRequest(BaseModel):
    query: str = Field(..., description="Свободный текстовый запрос пользователя")
    history: Optional[List[Dict[str, str]]] = Field(default=[], description="История диалога")

class SearchResponse(BaseModel):
    island: str
    island_ru: str
    nights: int
    guests: int
    dates_text: str
    reply_text: str
    selected_hotel: HotelItem
    hotels: List[HotelItem]
    selected_flight: FlightItem
    flights: List[FlightItem]
    selected_transfer: TransferItem
    transfers: List[TransferItem]
    timeline: List[TimelineStep]
    total_hotel_price: float
    total_flight_price: float
    total_transfer_price: float
    grand_total: float

# --- Booking Request & Response ---
class BookRequest(BaseModel):
    hotel_id: str
    flight_id: str
    transfer_id: str
    nights: int = 7
    guests: int = 2
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None

class BookResponse(BaseModel):
    order_id: str
    status: str = "confirmed"
    created_at: str
    summary: Dict[str, Any]
    total_price: float

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    trip_context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    ui_actions: List[Dict[str, Any]] = []

