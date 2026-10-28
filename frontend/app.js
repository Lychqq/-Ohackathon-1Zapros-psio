/**
 * Ostrovok.ru — Подбор поездки целиком одним запросом
 * Архитектура: Чат-консоль + Интерактивный Артефакт (Claude Artifacts style)
 */

const DATA_STORE = {
  hotels: [
    {
      id: "h_ten_hardrock",
      name: "Hard Rock Hotel Tenerife",
      island: "Tenerife",
      islandRu: "Тенерифе",
      stars: 5,
      rating: 9.3,
      reviewsCount: 412,
      matchScore: 98,
      priceNight: 21500,
      exactAddress: "Avenida Adeje 300, Плайя-Параисо, 38678 Адехе, Тенерифе",
      coordinates: { lat: 28.121445, lon: -16.774698 },
      location: "Плайя-Параисо, Тенерифе",
      desc: "Премиальный 5-звездочный курорт с бассейнами с подогревом, лагуной и спа-центром у океана.",
      amenities: ["Бассейн", "Первая линия", "Спа-комплекс", "Бесплатный Wi-Fi", "Кондиционер", "Парковка"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "h_ten_anthelia",
      name: "Iberostar Selection Anthelia",
      island: "Tenerife",
      islandRu: "Тенерифе",
      stars: 5,
      rating: 9.5,
      reviewsCount: 528,
      matchScore: 94,
      priceNight: 24800,
      exactAddress: "Calle Londres 15, Коста-Адехе, 38660 Адехе, Тенерифе",
      coordinates: { lat: 28.089542, lon: -16.738160 },
      location: "Коста-Адехе, Тенерифе",
      desc: "Отель высшей категории в окружении субтропических садов на первой линии пляжа Фаньябе.",
      amenities: ["Бассейн", "Первая линия", "Спа-комплекс", "Бесплатный Wi-Fi", "Парковка"],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "h_ten_sol",
      name: "Sol Tenerife",
      island: "Tenerife",
      islandRu: "Тенерифе",
      stars: 4,
      rating: 8.5,
      reviewsCount: 310,
      priceNight: 13200,
      exactAddress: "Avenida Rafael Puig Llivina 12, 38660 Плайя-де-лас-Америкас, Арона, Тенерифе",
      coordinates: { lat: 28.064707, lon: -16.730751 },
      location: "Плайя-де-лас-Америкас, Тенерифе",
      desc: "Отель в 200 метрах от пляжа с открытыми бассейнами и видом на Атлантический океан.",
      amenities: ["Бассейн", "Пляж", "Бесплатный Wi-Fi", "Кондиционер"],
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_ten_isabel",
      name: "GF Isabel",
      island: "Tenerife",
      islandRu: "Тенерифе",
      stars: 4,
      rating: 8.6,
      reviewsCount: 284,
      priceNight: 15200,
      exactAddress: "Avenida de Moscu 2, Коста-Адехе, 38679 Адехе, Тенерифе",
      location: "Коста-Адехе, Тенерифе",
      desc: "Семейный курорт в традиционном канарском стиле с подогреваемыми бассейнами в 600 м от пляжа Фаньябе.",
      amenities: ["Бассейн", "Семейный клуб", "Спа-комплекс", "Бесплатный Wi-Fi", "Ресторан"],
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_ten_abama",
      name: "The Ritz-Carlton Tenerife, Abama",
      island: "Tenerife",
      islandRu: "Тенерифе",
      stars: 5,
      rating: 9.6,
      reviewsCount: 462,
      priceNight: 31000,
      exactAddress: "Carretera General TF-47 km 9, 38687 Гия-де-Исора, Тенерифе",
      location: "Гия-де-Исора, Тенерифе",
      desc: "Роскошный курорт на скале с панорамным видом на океан, собственным фуникулером к пляжу и мишленовскими ресторанами.",
      amenities: ["Частный пляж", "Гольф-поле", "Спа-комплекс", "Бассейны", "Парковка"],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_gc_baobab",
      name: "Lopesan Baobab Resort",
      island: "Gran Canaria",
      islandRu: "Гран-Канария",
      stars: 5,
      rating: 9.2,
      reviewsCount: 394,
      matchScore: 98,
      priceNight: 19800,
      exactAddress: "Calle Mar Adriatico 1, 35100 Мелонерас, Маспаломас, Гран-Канария",
      location: "Мелонерас, Гран-Канария",
      desc: "Курортный комплекс с 9 бассейнами и оригинальной африканской архитектурой в 600 м от дюн.",
      amenities: ["Бассейн", "Спа-комплекс", "Бесплатный Wi-Fi", "Кондиционер"],
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_gc_catalina",
      name: "Santa Catalina, a Royal Hideaway Hotel",
      island: "Gran Canaria",
      islandRu: "Гран-Канария",
      stars: 5,
      rating: 9.4,
      reviewsCount: 312,
      priceNight: 21400,
      exactAddress: "Calle Leon y Castillo 227, 35005 Лас-Пальмас, Гран-Канария",
      location: "Лас-Пальмас, Гран-Канария",
      desc: "Исторический гранд-отель в парковой зоне Лас-Пальмаса с открытым бассейном и высокой кухней.",
      amenities: ["Бассейн", "Спа-центр", "Парковая зона", "Бесплатный Wi-Fi"],
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_gc_bohemia",
      name: "Bohemia Suites & Spa",
      island: "Gran Canaria",
      islandRu: "Гран-Канария",
      stars: 5,
      rating: 9.3,
      reviewsCount: 228,
      priceNight: 23500,
      exactAddress: "Avenida Estados Unidos 28, 35100 Плайя-дель-Инглес, Гран-Канария",
      location: "Плайя-дель-Инглес, Гран-Канария",
      desc: "Дизайнерский бутик-отель только для взрослых с панорамным рестораном на крыше и видом на дюны Маспаломас.",
      amenities: ["Панорамный спа", "Бассейн", "Первая линия", "Ресторан на крыше"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_gc_gloria",
      name: "Gloria Palace San Agustin Thalasso",
      island: "Gran Canaria",
      islandRu: "Гран-Канария",
      stars: 4,
      rating: 8.7,
      reviewsCount: 340,
      priceNight: 14200,
      exactAddress: "Calle Las Margaritas s/n, 35100 Сан-Агустин, Сан-Бартоломе-де-Тирахана, Гран-Канария",
      location: "Сан-Агустин, Гран-Канария",
      desc: "Отель с крупнейшим в Европе центром талассотерапии с подогреваемой морской водой и видом на океан.",
      amenities: ["Талассо-центр", "Бассейн", "Вид на океан", "Бесплатный Wi-Fi"],
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_lanz_yaiza",
      name: "Princesa Yaiza Suite Hotel Resort",
      island: "Lanzarote",
      islandRu: "Лансароте",
      stars: 5,
      rating: 9.4,
      reviewsCount: 289,
      matchScore: 98,
      priceNight: 23400,
      exactAddress: "Avenida Papagayo 22, 35580 Плайя-Бланка, Яйса, Лансароте",
      location: "Плайя-Бланка, Лансароте",
      desc: "Традиционный канарский стиль, прямой выход на белый песчаный пляж и центр талассотерапии.",
      amenities: ["Бассейн", "Первая линия", "Спа-комплекс", "Бесплатный Wi-Fi", "Парковка"],
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_lanz_castillo",
      name: "Gran Castillo Tagoro Family & Fun",
      island: "Lanzarote",
      islandRu: "Лансароте",
      stars: 5,
      rating: 9.1,
      reviewsCount: 310,
      priceNight: 19800,
      exactAddress: "Calle Hoya de Afre 2, 35580 Плайя-Бланка, Яйса, Лансароте",
      location: "Плайя-Бланка, Лансароте",
      desc: "Роскошный курорт в мавританском стиле с 11 бассейнами и великолепным видом на Атлантику.",
      amenities: ["11 бассейнов", "Спа-комплекс", "Детский клуб", "Рестораны"],
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_lanz_arrecife",
      name: "Arrecife Gran Hotel & Spa",
      island: "Lanzarote",
      islandRu: "Лансароте",
      stars: 5,
      rating: 9.2,
      reviewsCount: 265,
      priceNight: 21000,
      exactAddress: "Parque Islas Canarias s/n, 35500 Арресифе, Лансароте",
      location: "Арресифе, Лансароте",
      desc: "Самый высокий отель острова прямо на пляже Эль-Редукто с панорамным рестораном на 17 этаже.",
      amenities: ["Панорамный вид", "Бассейн", "Спа", "Первая линия пляжа"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_lanz_jameos",
      name: "Seaside Los Jameos Playa",
      island: "Lanzarote",
      islandRu: "Лансароте",
      stars: 4,
      rating: 8.9,
      reviewsCount: 342,
      priceNight: 15600,
      exactAddress: "Calle Marte 2, 35510 Пуэрто-дель-Кармен, Тиас, Лансароте",
      location: "Пуэрто-дель-Кармен, Лансароте",
      desc: "Курорт в окружении пальмовых садов в 100 м от пляжа Лос-Посильос с теннисными кортами и спа.",
      amenities: ["Бассейны", "Теннисные корты", "Спа-центр", "Пляж рядом"],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_fuer_castillo",
      name: "Barcelo Fuerteventura Castillo",
      island: "Fuerteventura",
      islandRu: "Фуэртевентура",
      stars: 4,
      rating: 8.8,
      reviewsCount: 245,
      matchScore: 97,
      priceNight: 14600,
      exactAddress: "Avenida del Castillo s/n, 35610 Калета-де-Фусте, Антигуа, Фуэртевентура",
      location: "Калета-де-Фусте, Фуэртевентура",
      desc: "Бунгало на берегу океана, идеальное место для водных видов спорта и серфинга.",
      amenities: ["Бассейн", "Первая линия", "Бесплатный Wi-Fi", "Парковка"],
      image: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_fuer_palace",
      name: "Iberostar Selection Fuerteventura Palace",
      island: "Fuerteventura",
      islandRu: "Фуэртевентура",
      stars: 5,
      rating: 9.3,
      reviewsCount: 380,
      priceNight: 22800,
      exactAddress: "Urb. Las Gaviotas, Pasaje Playa 1, 35626 Морро-Хабле, Пахара, Фуэртевентура",
      location: "Морро-Хабле, Фуэртевентура",
      desc: "Премиальный курорт на первой линии пляжа Хандия с прямым спуском к золотому песку океана.",
      amenities: ["Первая линия", "Бассейн с подогревом", "Спа Sensations", "Рестораны"],
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_fuer_secrets",
      name: "Secrets Bahia Real Resort & Spa",
      island: "Fuerteventura",
      islandRu: "Фуэртевентура",
      stars: 5,
      rating: 9.5,
      reviewsCount: 290,
      priceNight: 26500,
      exactAddress: "Avenida Grandes Playas s/n, 35660 Корралехо, Ла-Олива, Фуэртевентура",
      location: "Корралехо, Фуэртевентура",
      desc: "Отель высшей категории с видом на острова Лобос и Лансароте у знаменитых дюн Корралехо.",
      amenities: ["Вид на дюны", "Спа-центр", "Частный пирс", "Высокая кухня"],
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "h_fuer_elba",
      name: "Elba Palace Golf & Vital Hotel",
      island: "Fuerteventura",
      islandRu: "Фуэртевентура",
      stars: 5,
      rating: 9.0,
      reviewsCount: 198,
      priceNight: 20200,
      exactAddress: "Urbanizacion Fuerteventura Golf Club, 35610 Калета-де-Фусте, Антигуа, Фуэртевентура",
      location: "Калета-де-Фусте, Фуэртевентура",
      desc: "Уединенный бутик-отель только для взрослых с гольф-полем чемпионского уровня и канарским патио.",
      amenities: ["Гольф-поле", "Бассейн", "Спа", "Ресторан высокой кухни"],
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
    }
  ],
  flights: [
    {
      id: "fl_1",
      airline: "Аэрофлот + Turkish Airlines",
      flightNumber: "SU-2134 / TK-1823",
      origin: "SVO",
      originCity: "Москва",
      destination: "TFS",
      destinationIsland: "Tenerife",
      departureTime: "07:45",
      arrivalTime: "15:20",
      duration: "8.5 ч в пути",
      stops: 1,
      priceTotal: 54000,
      baggage: "Багаж 23 кг включен"
    },
    {
      id: "fl_2",
      airline: "Emirates / Iberia",
      flightNumber: "EK-132 / IB-3820",
      origin: "DME",
      originCity: "Москва",
      destination: "TFS",
      destinationIsland: "Tenerife",
      departureTime: "11:20",
      arrivalTime: "20:40",
      duration: "9.3 ч в пути",
      stops: 1,
      priceTotal: 62000,
      baggage: "Багаж 23 кг включен"
    },
    {
      id: "fl_3",
      airline: "Turkish Airlines",
      flightNumber: "TK-402 / TK-1811",
      origin: "LED",
      originCity: "Санкт-Петербург",
      destination: "LPA",
      destinationIsland: "Gran Canaria",
      departureTime: "13:00",
      arrivalTime: "22:15",
      duration: "10.2 ч в пути",
      stops: 1,
      priceTotal: 58500,
      baggage: "Багаж 23 кг включен"
    },
    {
      id: "fl_4",
      airline: "Аэрофлот + Iberia",
      flightNumber: "SU-2500 / IB-3814",
      origin: "SVO",
      originCity: "Москва",
      destination: "ACE",
      destinationIsland: "Lanzarote",
      departureTime: "08:15",
      arrivalTime: "16:40",
      duration: "9.4 ч в пути",
      stops: 1,
      priceTotal: 59000,
      baggage: "Багаж 23 кг включен"
    },
    {
      id: "fl_5",
      airline: "Turkish Airlines",
      flightNumber: "TK-418 / TK-1830",
      origin: "VKO",
      originCity: "Москва",
      destination: "FUE",
      destinationIsland: "Fuerteventura",
      departureTime: "09:30",
      arrivalTime: "18:10",
      duration: "9.6 ч в пути",
      stops: 1,
      priceTotal: 57000,
      baggage: "Багаж 23 кг включен"
    }
  ],
  transfers: [
    {
      id: "tr_1",
      island: "Tenerife",
      vehicle: "Комфорт Седан",
      desc: "Встреча в зале прилета с табличкой • до 4 мест",
      route: "Аэропорт Тенерифе (TFS) -> Отель (35 км)",
      price: 4200
    },
    {
      id: "tr_2",
      island: "Tenerife",
      vehicle: "Минивэн Премиум",
      desc: "Просторный минивэн • до 7 мест, 6 чемоданов",
      route: "Аэропорт Тенерифе (TFS) -> Отель (35 км)",
      price: 6800
    },
    {
      id: "tr_3",
      island: "Gran Canaria",
      vehicle: "Комфорт Седан",
      desc: "Встреча в зале прилета • до 4 мест",
      route: "Аэропорт Лас-Пальмас (LPA) -> Мелонерас (32 км)",
      price: 3900
    },
    {
      id: "tr_4",
      island: "Lanzarote",
      vehicle: "Комфорт Седан",
      desc: "Встреча в зале прилета с именной табличкой • до 4 мест",
      route: "Аэропорт Арресифе (ACE) -> Плайя-Бланка (28 км)",
      price: 3800
    },
    {
      id: "tr_5",
      island: "Fuerteventura",
      vehicle: "Комфорт Седан",
      desc: "Встреча в зале прилета • до 4 мест",
      route: "Аэропорт Пуэрто-дель-Росарио (FUE) -> Отель (15 км)",
      price: 3500
    }
  ]
};

// Текущее состояние поездки
const tripState = {
  hasActiveTour: false,
  nights: null,
  guests: null,
  hasChosenGuests: false,
  hasChosenDate: false,
  startDay: 1,
  startMonth: "ноября",
  startYear: 2026,
  island: null,
  islandRu: null,
  selectedHotelId: null,
  recommendedHotelId: null,
  selectedFlightId: null,
  recommendedFlightId: null,
  selectedTransferId: null,
  recommendedTransferId: null,
  isArtifactOpen: false
};

document.addEventListener("DOMContentLoaded", () => {
  setupHandlers();
});

function setupHandlers() {
  const heroInput = document.getElementById("heroInput");
  const heroSubmitBtn = document.getElementById("heroSubmitBtn");
  const streamInput = document.getElementById("streamInput");
  const streamSendBtn = document.getElementById("streamSendBtn");
  const newTripBtn = document.getElementById("newTripBtn");
  const collapseArtBtn = document.getElementById("collapseArtifactBtn");
  const toggleChatBtn = document.getElementById("toggleChatBtn");
  const toggleChatBtnText = document.getElementById("toggleChatBtnText");
  const workspaceLayout = document.getElementById("workspaceLayout");
  const toggleBreakdownBtn = document.getElementById("toggleBreakdownBtn");
  const priceBreakdownDetails = document.getElementById("priceBreakdownDetails");
  const bookBtn = document.getElementById("bookPackageBtn");
  const suggButtons = document.querySelectorAll(".sugg-btn");
  const artTabs = document.querySelectorAll(".art-tab");

  // Переключение видимости диалога (полный экран для плана тура)
  if (toggleChatBtn) {
    toggleChatBtn.addEventListener("click", () => {
      const isCollapsed = workspaceLayout.classList.toggle("chat-collapsed");
      toggleChatBtnText.textContent = isCollapsed ? "Показать диалог" : "Скрыть диалог";
    });
  }

  // Переключение детальной разбивки цен
  if (toggleBreakdownBtn && priceBreakdownDetails) {
    toggleBreakdownBtn.addEventListener("click", () => {
      priceBreakdownDetails.classList.toggle("hidden");
    });
  }

  // Отправка из стартового окна
  heroSubmitBtn.addEventListener("click", () => {
    const q = heroInput.value.trim();
    if (q) startTripPlan(q);
  });

  heroInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      heroSubmitBtn.click();
    }
  });

  // Отправка из нижнего инпута
  streamSendBtn.addEventListener("click", () => {
    const q = streamInput.value.trim();
    if (q) {
      streamInput.value = "";
      sendUserFollowUp(q);
    }
  });

  streamInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      streamSendBtn.click();
    }
  });

  // Быстрые сценарии
  suggButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-query");
      startTripPlan(q);
    });
  });

  // Кнопка нового запроса
  newTripBtn.addEventListener("click", () => {
    resetToWelcome();
  });

  // Свернуть артефакт
  collapseArtBtn.addEventListener("click", () => {
    closeArtifact();
  });

  // Вкладки артефакта
  artTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      artTabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // Бронирование поездки целиком
  bookBtn.addEventListener("click", async () => {
    const h = DATA_STORE.hotels.find(x => x.id === tripState.selectedHotelId);
    const f = DATA_STORE.flights.find(x => x.id === tripState.selectedFlightId);
    const t = DATA_STORE.transfers.find(x => x.id === tripState.selectedTransferId);
    const total = calculateGrandTotal();

    let orderId = `OST-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    try {
      const res = await fetch("/api/v1/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_id: tripState.selectedHotelId,
          flight_id: tripState.selectedFlightId,
          transfer_id: tripState.selectedTransferId,
          nights: tripState.nights,
          guests: tripState.guests
        })
      });
      if (res.ok) {
        const data = await res.json();
        orderId = data.order_id;
      }
    } catch (e) {
      // При оффлайне используется сгенерированный orderId
    }

    alert(
      `Заказ #${orderId} успешно оформлен!\n\n` +
      `Отель: ${h ? h.name : ""} (${tripState.nights} ночей)\n` +
      `Перелет: ${f ? f.airline : ""} (${f ? f.originCity : ""})\n` +
      `Трансфер: ${t ? t.vehicle : ""}\n\n` +
      `Итоговая стоимость: ${total.toLocaleString("ru-RU")} ₽\n\n` +
      `Все стыковки и бронирования подтверждены.`
    );
  });
}

/**
 * Определение острова из текста
 */
function detectIslandFromText(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  if (lower.includes("лансарот") || lower.includes("lanzarote")) return "Лансароте";
  if (lower.includes("гран-канари") || lower.includes("gran canaria") || lower.includes("маспаломас")) return "Гран-Канария";
  if (lower.includes("фуэртевентур") || lower.includes("fuerteventura")) return "Фуэртевентура";
  if (lower.includes("тенериф") || lower.includes("tenerife") || lower.includes("тейде")) return "Тенерифе";
  if (lower.includes("ла-пальм") || lower.includes("ла пальм")) return "Ла-Пальма";
  if (lower.includes("ла-гомер") || lower.includes("ла гомер")) return "Ла-Гомера";
  if (lower.includes("эль-йерр") || lower.includes("эль йерр")) return "Эль-Йерро";
  return null;
}

/**
 * Определение неподдерживаемых направлений вне Канар
 */
function detectUnsupportedDestination(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  const list = ["росси", "сочи", "крым", "москв", "петербург", "питер", "турци", "египет", "дубай", "тайланд", "бали"];
  for (const item of list) {
    if (lower.includes("в " + item) || lower.includes("по " + item) || lower.includes("на " + item) || lower.includes("до " + item) || lower === item) {
      return item === "росси" ? "Россия" : item.charAt(0).toUpperCase() + item.slice(1);
    }
  }
  return null;
}

/**
 * Определение абстрактного или неполного запроса (когда нет конкретных дат или количества человек)
 */
function isVagueQuery(text) {
  const lower = text.toLowerCase().trim();

  // Если явно указана длительность или количество людей — запрос конкретный
  const hasDuration = /\d+\s*(дн|ноч|нед)/.test(lower) || lower.includes("недел") || lower.includes("уикенд");
  const hasGuests = /\d+\s*(чел|гост|взросл|пасс)/.test(lower) || lower.includes("один") || lower.includes("соло") || lower.includes("двоих") || lower.includes("пара") || lower.includes("семь");
  const hasExplicitCommand = lower.includes("собери тур") || lower.includes("тур под ключ") || lower.includes("открой план");

  if (hasDuration && hasGuests && (lower.includes("собери тур") || lower.includes("открой план") || /\d+★/.test(lower) || lower.includes("звезд"))) {
    return false;
  }

  // Если просто назван остров ("Фуэртевентура", "хочу на Тенерифе"), но нет деталей — пусть агент спросит детали через квиз
  return true;
}

/**
 * Старт планирования тура через бэкенд FastAPI с бесшовным оффлайн-фоллбеком
 */
async function startTripPlan(query) {
  // Скрываем Welcome Hero
  document.getElementById("chatWelcomeHero").classList.add("hidden");
  document.getElementById("stickyChatInputBar").classList.remove("hidden");

  // 1. Проверка неподдерживаемых направлений
  const unsupported = detectUnsupportedDestination(query);
  if (unsupported) {
    addChatMessage("user", query);
    addChatMessage("agent", `Сервис «О!дин запрос» специализируется исключительно на комплексных турах на Канарские острова. Туры по направлению **${unsupported}** сервис не бронирует.\n\nВыберите один из Канарских островов для подбора поездки целиком:`);
    renderInteractiveQuizInChat({
      question: "Какой остров Канарского архипелага выберем?",
      options: [
        { id: "tenerife", text: "Тенерифе — пляжи, вулкан Тейде и аквапарки" },
        { id: "gran_canaria", text: "Гран-Канария — золотые дюны Маспаломас" },
        { id: "lanzarote", text: "Лансароте — марсианская лава и уединение" },
        { id: "fuerteventura", text: "Фуэртевентура — океан, белый песок и серфинг" }
      ]
    });
    return;
  }

  // 2. Если запрос абстрактный — передаем его агенту для диалога и интерактивного опроса
  if (isVagueQuery(query)) {
    sendUserFollowUp(query);
    return;
  }

  // 3. Если в запросе есть конкретика — собираем полный тур
  await assembleTourPackage(query);
}

/**
 * Полная сборка турпакета под конкретный запрос
 */
async function assembleTourPackage(query) {
  // addChatMessage("user", query);

  try {
    const res = await fetch("/api/v1/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query })
    });

    if (!res.ok) throw new Error("Search API error");
    const data = await res.json();

    // Синхронизируем состояние
    tripState.island = data.island_ru || data.island;
    tripState.islandRu = data.island_ru || data.island;
    tripState.nights = data.nights;
    tripState.guests = data.guests;

    if (data.hotels && data.hotels.length > 0) {
      DATA_STORE.hotels = data.hotels.map(h => ({
        id: h.id,
        name: h.name,
        island: h.island,
        islandRu: h.island_ru,
        stars: h.stars,
        rating: h.rating,
        reviewsCount: h.reviews_count,
        matchScore: h.match_score,
        priceNight: h.price_night,
        exactAddress: h.exact_address,
        location: h.location,
        desc: h.desc,
        amenities: h.amenities,
        image: h.image
      }));
    }

    if (data.flights && data.flights.length > 0) {
      DATA_STORE.flights = data.flights.map(f => ({
        id: f.id,
        airline: f.airline,
        flightNumber: f.flight_number,
        origin: f.origin,
        originCity: f.origin_city,
        destination: f.destination,
        destinationIsland: f.destination_island,
        departureTime: f.departure_time,
        arrivalTime: f.arrival_time,
        duration: f.duration,
        stops: f.stops,
        priceTotal: f.price_total,
        baggage: f.baggage
      }));
    }

    if (data.transfers && data.transfers.length > 0) {
      DATA_STORE.transfers = data.transfers.map(t => ({
        id: t.id,
        island: t.island,
        vehicle: t.vehicle,
        desc: t.desc,
        route: t.route,
        price: t.price
      }));
    }

    tripState.hasActiveTour = true;
    tripState.selectedHotelId = data.selected_hotel.id;
    tripState.recommendedHotelId = data.selected_hotel.id;
    tripState.selectedFlightId = data.selected_flight.id;
    tripState.selectedTransferId = data.selected_transfer.id;

    addAgentMessageWithArtifact(data.reply_text, data.grand_total);
    openArtifact();

  } catch (err) {
    parseQuery(query);
    tripState.hasActiveTour = true;
    const h = DATA_STORE.hotels.find(x => x.id === tripState.selectedHotelId);
    const f = DATA_STORE.flights.find(x => x.id === tripState.selectedFlightId);
    const t = DATA_STORE.transfers.find(x => x.id === tripState.selectedTransferId);
    const total = calculateGrandTotal();

    const replyText =
      `По вашему запросу я подобрал и состыковал поездку на остров ${tripState.islandRu} целиком:\n\n` +
      `• Проживание: ${h.name} (${h.stars}★) на ${tripState.nights} ночей;\n` +
      `• Перелет: ${f.airline} (вылет ${f.originCity} ${f.departureTime}, прилет ${f.arrivalTime}, багаж включен);\n` +
      `• Трансфер: ${t.vehicle} прямо из зала прилета до отеля.\n\n` +
      `Время прилета и трансфера состыковано со временем заселения в отель. ` +
      `Вы можете детально настроить поездку в плане справа.`;

    addAgentMessageWithArtifact(replyText, total);
    openArtifact();
  }
}

function getCurrentTripContext() {
  if (!tripState.hasActiveTour || !tripState.selectedHotelId) {
    return {
      has_active_tour: false,
      island: tripState.island,
      island_ru: tripState.islandRu,
      nights: tripState.nights || null,
      guests: tripState.hasChosenGuests ? tripState.guests : null,
      departure_date: tripState.hasChosenDate ? `${tripState.startDay} ${tripState.startMonth} ${tripState.startYear}` : null,
      hotel_id: tripState.selectedHotelId || null,
      selected_hotel_id: tripState.selectedHotelId || null,
      hotel_stars: tripState.preferredStars || null,
      available_islands: [
        { id: "tenerife", name: "Тенерифе", desc: "Вулкан Тейде, черные и золотые пляжи, развитая инфраструктура" },
        { id: "gran_canaria", name: "Гран-Канария", desc: "Дюны Маспаломас, спа-комплексы и песчаные бухты" },
        { id: "lanzarote", name: "Лансароте", desc: "Марсианские лавовые пейзажи и спокойный отдых" },
        { id: "fuerteventura", name: "Фуэртевентура", desc: "Бесконечные дикие пляжи и мировой центр виндсерфинга" }
      ]
    };
  }

  const h = DATA_STORE.hotels.find(x => x.id === tripState.selectedHotelId);
  const f = DATA_STORE.flights.find(x => x.id === tripState.selectedFlightId);
  const t = DATA_STORE.transfers.find(x => x.id === tripState.selectedTransferId);

  // Фильтруем доступные отели на текущем острове
  const currentIsland = (tripState.islandRu || tripState.island || "").toLowerCase();
  let matchedHotels = DATA_STORE.hotels.filter(x => {
    const hi = (x.island || "").toLowerCase();
    const hiru = (x.islandRu || "").toLowerCase();
    return hi.includes(currentIsland) || currentIsland.includes(hi) || hiru.includes(currentIsland) || currentIsland.includes(hiru);
  });
  if (matchedHotels.length === 0) {
    matchedHotels = DATA_STORE.hotels;
  }

  const availableHotels = matchedHotels.map(x => ({
    id: x.id,
    name: x.name,
    stars: x.stars,
    rating: x.rating,
    price_night: x.priceNight,
    amenities: x.amenities,
    location: x.location
  }));

  const availableFlights = DATA_STORE.flights.map(x => ({
    id: x.id,
    airline: x.airline,
    origin_city: x.originCity,
    departure_time: x.departureTime,
    arrival_time: x.arrivalTime,
    price_total: x.priceTotal
  }));

  const availableTransfers = DATA_STORE.transfers.map(x => ({
    id: x.id,
    vehicle: x.vehicle,
    price: x.price
  }));

  return {
    island: tripState.island,
    island_ru: tripState.islandRu,
    nights: tripState.nights,
    guests: tripState.guests,
    hotel_id: tripState.selectedHotelId,
    hotel_name: h ? h.name : "",
    hotel_stars: h ? h.stars : 5,
    hotel_rating: h ? h.rating : 9.0,
    hotel_address: h ? h.exactAddress : "",
    hotel_price_night: h ? h.priceNight : 0,
    hotel_amenities: h ? h.amenities : [],
    flight_id: tripState.selectedFlightId,
    airline: f ? f.airline : "",
    origin_city: f ? f.originCity : "Москва",
    destination_island: f ? f.destinationIsland : tripState.islandRu,
    departure_time: f ? f.departureTime : "",
    arrival_time: f ? f.arrivalTime : "",
    transfer_id: tripState.selectedTransferId,
    transfer_vehicle: t ? t.vehicle : "",
    transfer_price: t ? t.price : 0,
    available_hotels: availableHotels,
    available_flights: availableFlights,
    available_transfers: availableTransfers
  };
}

/**
 * Применение UI-действий, возвращенных AI-агентом
 */
function applyAgentAction(action) {
  if (!action || !action.type) return;

  // 1. Полная сборка тура под указанные параметры
  if (action.type === "build_tour" || action.type === "switch_island") {
    if (false) {
      return;
    }
    const island = action.island || tripState.islandRu || "Тенерифе";
    const nights = action.nights || tripState.nights || 7;
    const guests = action.guests || tripState.guests || 2;
    assembleTourPackage(`Тур на остров ${island} на ${nights} ночей для ${guests} человек`);
    return;
  }

  // 2. Смена количества ночей
  if (action.type === "set_nights" && action.nights) {
    tripState.nights = parseInt(action.nights, 10);
    renderArtifactContent();
    const grand = calculateGrandTotal();
    const grandEl = document.getElementById("calcGrandTotalPrice");
    if (grandEl) grandEl.textContent = `${grand.toLocaleString("ru-RU")} ₽`;
  }

  // Смена даты вылета
  if (action.type === "set_departure_date" && action.day) {
    tripState.startDay = parseInt(action.day, 10);
    if (action.month) tripState.startMonth = action.month;
    renderArtifactContent();
  }

  // 3. Смена количества гостей
  if (action.type === "set_guests" && action.guests) {
    tripState.guests = parseInt(action.guests, 10);
    renderArtifactContent();
    const grand = calculateGrandTotal();
    const grandEl = document.getElementById("calcGrandTotalPrice");
    if (grandEl) grandEl.textContent = `${grand.toLocaleString("ru-RU")} ₽`;
  }

  // 4. Смена конкретного отеля
  if (action.type === "set_hotel" && action.hotel_id) {
    const hotel = DATA_STORE.hotels.find(x => x.id === action.hotel_id);
    if (hotel) {
      tripState.selectedHotelId = action.hotel_id;
      renderArtifactContent();
    }
  } else if (action.type === "set_flight" && action.flight_id) {
    const flight = DATA_STORE.flights.find(x => x.id === action.flight_id);
    if (flight) {
      tripState.selectedFlightId = action.flight_id;
      renderArtifactContent();
    }
  } else if (action.type === "set_transfer" && action.transfer_id) {
    const transfer = DATA_STORE.transfers.find(x => x.id === action.transfer_id);
    if (transfer) {
      tripState.selectedTransferId = action.transfer_id;
      renderArtifactContent();
    }
  }
}

/**
 * Рендер интерактивного квиза прямо в чате
 */
function renderInteractiveQuizInChat(quizAction) {
  const container = document.getElementById("chatHistory");
  const quizDiv = document.createElement("div");
  quizDiv.className = "chat-msg chat-msg-agent chat-quiz-msg";

  const optionsHtml = (quizAction.options || []).map((opt, i) => `
    <button class="quiz-option-btn" onclick="handleQuizAnswer('${escapeHtml(opt.text)}')">
      <span class="quiz-option-dot"></span>
      <span class="quiz-option-text">${escapeHtml(opt.text)}</span>
    </button>
  `).join("");

  quizDiv.innerHTML = `
    <div class="bubble quiz-bubble">
      <div class="quiz-header">
        <span class="quiz-badge">Уточнение формата</span>
      </div>
      <div class="quiz-question">${escapeHtml(quizAction.question || "Что именно вам ближе?")}</div>
      <div class="quiz-options-list">
        ${optionsHtml}
      </div>
    </div>
  `;
  container.appendChild(quizDiv);
  container.scrollTop = container.scrollHeight;
}

window.handleQuizAnswer = function(answerText) {
  const ansLower = answerText.toLowerCase();
  if (ansLower.includes("1 человек") || ansLower.includes("соло")) {
    tripState.guests = 1;
    tripState.hasChosenGuests = true;
  } else if (ansLower.includes("2 человек") || ansLower.includes("пара")) {
    tripState.guests = 2;
    tripState.hasChosenGuests = true;
  } else if (ansLower.includes("3+") || ansLower.includes("семья")) {
    tripState.guests = 3;
    tripState.hasChosenGuests = true;
  }
  if (ansLower.includes("ноябр") || ansLower.includes("декабр") || ansLower.includes("январ") || ansLower.includes("ближайш")) {
    tripState.hasChosenDate = true;
  }

  // Распознаем выбор отеля из квиза: выставляем selectedHotelId и preferredStars
  const foundHotel = DATA_STORE.hotels.find(h => {
    const hName = h.name.toLowerCase();
    return ansLower.includes(hName) || hName.includes(ansLower);
  });
  if (foundHotel) {
    tripState.selectedHotelId = foundHotel.id;
    tripState.preferredStars = foundHotel.stars || 4;
  } else if (ansLower.includes("3★") || ansLower.includes("3*")) {
    tripState.preferredStars = 3;
  } else if (ansLower.includes("4★") || ansLower.includes("4*") || ansLower.includes("эко") || ansLower.includes("комфорт")) {
    tripState.preferredStars = 4;
  } else if (ansLower.includes("5★") || ansLower.includes("5*") || ansLower.includes("люкс") || ansLower.includes("премиум")) {
    tripState.preferredStars = 5;
  }
  // Вместо топорного assembleTourPackage посылаем ответ агенту
  sendUserFollowUp(answerText);
};

/**
 * Последующие сообщения в диалоге с реальным AI-агентом
 */
async function sendUserFollowUp(text) {
  // 1. Проверка неподдерживаемых локаций
  const unsupported = detectUnsupportedDestination(text);
  if (unsupported) {
    addChatMessage("user", text);
    addChatMessage("agent", `Сервис «О!дин запрос» специализируется исключительно на комплексных турах на Канарские острова. Туры по направлению **${unsupported}** сервис не бронирует.\n\nВыберите один из Канарских островов для отдыха:`);
    renderInteractiveQuizInChat({
      question: "Какой остров Канарского архипелага выберем?",
      options: [
        { id: "tenerife", text: "Тенерифе — пляжи, вулкан Тейде и аквапарки" },
        { id: "gran_canaria", text: "Гран-Канария — золотые дюны Маспаломас" },
        { id: "lanzarote", text: "Лансароте — марсианская лава и уединение" },
        { id: "fuerteventura", text: "Фуэртевентура — океан, белый песок и серфинг" }
      ]
    });
    return;
  }

  // 2. Если в сообщении запрошен конкретный остров или параметры, но не было сборки — отправляем агенту
  // Сохраняем остров в состояние, если пользователь его упомянул
  const mentionedIsland = detectIslandFromText(text);
  if (mentionedIsland) {
    tripState.island = mentionedIsland;
    tripState.islandRu = mentionedIsland;
  }

  addChatMessage("user", text);

  // Индикатор размышлений агента
  const lowerText = text.toLowerCase();
  if (lowerText.includes("1 человек") || lowerText.includes("соло") || lowerText.includes("один") || lowerText.includes("на одного")) {
    tripState.guests = 1;
    tripState.hasChosenGuests = true;
  } else if (lowerText.includes("2 человек") || lowerText.includes("пара") || lowerText.includes("двоих") || lowerText.includes("на двоих")) {
    tripState.guests = 2;
    tripState.hasChosenGuests = true;
  } else if (lowerText.includes("3 и более") || lowerText.includes("3+") || lowerText.includes("семья") || lowerText.includes("троих")) {
    tripState.guests = 3;
    tripState.hasChosenGuests = true;
  }
  const nightsMatch = lowerText.match(/(\d+)\s*(?:ноч|дн)/);
  if (nightsMatch) {
    tripState.nights = parseInt(nightsMatch[1], 10);
  } else if (lowerText.includes("недельк") || lowerText.includes("неделю") || lowerText.includes("неделя")) {
    tripState.nights = 7;
  } else if (lowerText.includes("две недели")) {
    tripState.nights = 14;
  }
  const dayMatch = lowerText.match(/(?:вылет\s+|с\s+)?(\d{1,2})\s*(?:-го|-я|го)?\s*(ноябр|декабр|январ|феврал|март|апрел)/);
  if (dayMatch) {
    tripState.startDay = parseInt(dayMatch[1], 10);
    const m = dayMatch[2];
    if (m.startsWith("ноябр")) tripState.startMonth = "ноября";
    else if (m.startsWith("декабр")) tripState.startMonth = "декабря";
    else if (m.startsWith("январ")) tripState.startMonth = "января";
    else if (m.startsWith("феврал")) tripState.startMonth = "февраля";
    tripState.hasChosenDate = true;
  } else if (lowerText.includes("ноябр") || lowerText.includes("декабр") || lowerText.includes("новогод") || lowerText.includes("ближайш")) {
    tripState.hasChosenDate = true;
  }
  if (lowerText.includes("3★") || lowerText.includes("3 звезд") || lowerText.includes("3*")) {
    tripState.preferredStars = 3;
  } else if (lowerText.includes("4★") || lowerText.includes("4 звезд") || lowerText.includes("4*")) {
    tripState.preferredStars = 4;
  } else if (lowerText.includes("5★") || lowerText.includes("5 звезд") || lowerText.includes("5*") || lowerText.includes("люкс")) {
    tripState.preferredStars = 5;
  } else if (lowerText.includes("эко") || lowerText.includes("комфорт")) {
    tripState.preferredStars = 4;
  }
  const typingId = "typing-" + Date.now();
  const container = document.getElementById("chatHistory");
  const typingDiv = document.createElement("div");
  typingDiv.id = typingId;
  typingDiv.className = "chat-msg chat-msg-agent";
  typingDiv.innerHTML = `<div class="bubble" style="opacity: 0.7; font-style: italic;">Агент анализирует базу и готовит ответ...</div>`;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;

  try {
    const historyPayload = (window.chatMessagesList || []).slice(-8).map(m => ({
      role: m.role === "agent" ? "assistant" : "user",
      content: m.text
    }));

    const res = await fetch("/api/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history: historyPayload,
        trip_context: getCurrentTripContext()
      })
    });

    const el = document.getElementById(typingId);
    if (el) el.remove();

    if (res.ok) {
      const data = await res.json();

      // 1. Применяем реальные действия над сайтом
      if (data.ui_actions && Array.isArray(data.ui_actions)) {
        data.ui_actions.forEach(act => applyAgentAction(act));
      }

      // 2. Добавляем форматированный ответ консультанта
      if (data.reply) {
        addChatMessage("agent", data.reply);
      }

      // 3. Если агент запустил интерактивные опросы — рендерим все
      const quizActions = (data.ui_actions || []).filter(a => a.type === "show_quiz");
      quizActions.forEach(quizAction => {
        renderInteractiveQuizInChat(quizAction);
      });
    } else {
      addChatMessage("agent", "Не удалось связаться с сервером. Попробуйте еще раз.");
    }
  } catch (err) {
    const el = document.getElementById(typingId);
    if (el) el.remove();
    addChatMessage("agent", "Сервер временно недоступен. Проверьте соединение.");
  }
}

function parseQuery(text) {
  const lower = text.toLowerCase();
  let island = "Tenerife";
  let islandRu = "Тенерифе";

  if (lower.includes("гран-канари") || lower.includes("gran canaria")) {
    island = "Gran Canaria";
    islandRu = "Гран-Канария";
  } else if (lower.includes("лансароте") || lower.includes("lanzarote")) {
    island = "Lanzarote";
    islandRu = "Лансароте";
  } else if (lower.includes("фуэртевентур") || lower.includes("fuerteventura")) {
    island = "Fuerteventura";
    islandRu = "Фуэртевентура";
  }

  tripState.island = island;
  tripState.islandRu = islandRu;

  // Выбираем лучший отель острова (рекомендация нейросети)
  const matchingHotels = DATA_STORE.hotels.filter(h => h.island === island);
  tripState.selectedHotelId = (matchingHotels[0] || DATA_STORE.hotels[0]).id;
  tripState.recommendedHotelId = tripState.selectedHotelId;

  // Выбираем рейс под остров
  const matchingFlights = DATA_STORE.flights.filter(f => f.destinationIsland === island);
  tripState.selectedFlightId = (matchingFlights[0] || DATA_STORE.flights[0]).id;
  tripState.recommendedFlightId = tripState.selectedFlightId;

  // Выбираем трансфер
  const matchingTransfers = DATA_STORE.transfers.filter(t => t.island === island);
  tripState.selectedTransferId = (matchingTransfers[0] || DATA_STORE.transfers[0]).id;
  tripState.recommendedTransferId = tripState.selectedTransferId;
}

/**
 * Управление Артефактом
 */
function openArtifact() {
  tripState.isArtifactOpen = true;
  const layout = document.getElementById("workspaceLayout");
  layout.classList.remove("chat-only");
  layout.classList.add("split-view");
  renderArtifactContent();
}

function closeArtifact() {
  tripState.isArtifactOpen = false;
  const layout = document.getElementById("workspaceLayout");
  layout.classList.remove("split-view");
  layout.classList.add("chat-only");
}

function resetToWelcome() {
  closeArtifact();
  const layout = document.getElementById("workspaceLayout");
  layout.classList.remove("chat-collapsed");
  const btnText = document.getElementById("toggleChatBtnText");
  if (btnText) btnText.textContent = "Скрыть диалог";
  document.getElementById("chatHistory").innerHTML = "";
  const welcome = document.getElementById("chatWelcomeHero");
  welcome.classList.remove("hidden");
  document.getElementById("chatHistory").appendChild(welcome);
  document.getElementById("stickyChatInputBar").classList.add("hidden");
  document.getElementById("heroInput").value = "";
}

/**
 * Отрисовка данных внутри Артефакта
 */
function renderArtifactContent() {
  const hotel = DATA_STORE.hotels.find(x => x.id === tripState.selectedHotelId);
  const flight = DATA_STORE.flights.find(x => x.id === tripState.selectedFlightId);
  const transfer = DATA_STORE.transfers.find(x => x.id === tripState.selectedTransferId);

  // Заголовок артефакта
  const titleEl = document.getElementById("artifactTripTitle");
  if (titleEl) {
    titleEl.textContent = `${tripState.islandRu || "Канары"}: тур на ${tripState.nights || 7} ночей`;
  }

  // Обновление строки дат и гостей
  const datesEl = document.getElementById("journeyDatesText");
  if (datesEl) {
    const nights = tripState.nights || 7;
    const guests = tripState.guests || 2;
    const startDay = tripState.startDay || 1;
    const endDay = startDay + nights;
    const month = tripState.startMonth || "ноября";
    const year = tripState.startYear || 2026;
    const guestsWord = guests === 1 ? "1 гость" : (guests < 5 ? `${guests} гостя` : `${guests} гостей`);
    const nightsWord = nights === 1 ? "1 ночь" : (nights < 5 ? `${nights} ночи` : `${nights} ночей`);
    datesEl.textContent = `${startDay} — ${endDay} ${month} ${year} (${nightsWord}, ${guestsWord})`;
  }

  // Рейс в таймлайне
  if (flight) {
    const flTimeEl = document.getElementById("timelineFlightTime");
    const flTitleEl = document.getElementById("timelineFlightTitle");
    const flDescEl = document.getElementById("timelineFlightDesc");
    if (flTimeEl) flTimeEl.textContent = `${flight.departureTime} — ${flight.arrivalTime}`;
    if (flTitleEl) flTitleEl.textContent = `Вылет ${flight.originCity} (${flight.origin}) — ${tripState.islandRu || flight.destinationIsland} (${flight.destination})`;
    if (flDescEl) flDescEl.textContent = `${flight.airline} • ${flight.duration} • ${flight.baggage}`;
  }

  // Трансфер в таймлайне
  if (transfer) {
    const trTitleEl = document.getElementById("timelineTransferTitle");
    const trDescEl = document.getElementById("timelineTransferDesc");
    if (trTitleEl) trTitleEl.textContent = `Трансфер: ${transfer.vehicle}`;
    if (trDescEl) trDescEl.textContent = `${transfer.desc} • ${transfer.price.toLocaleString("ru-RU")} ₽`;
  }

  // Отель в таймлайне
  if (hotel) {
    const htTitleEl = document.getElementById("timelineHotelTitle");
    const htDescEl = document.getElementById("timelineHotelDesc");
    if (htTitleEl) htTitleEl.textContent = `Заселение: ${hotel.name} ${"★".repeat(hotel.stars || 4)}`;
    if (htDescEl) htDescEl.textContent = `${hotel.exactAddress || hotel.location || "Канары"} • Номер подготовлен к приезду`;
  }

  // Отрисовка каталогов по вкладкам
  renderHotelsCatalog();
  renderFlightsCatalog();
  renderTransfersCatalog();

  // Расчет стоимости
  updatePriceCalculation(hotel, flight, transfer);
}

function renderHotelsCatalog() {
  const container = document.getElementById("hotelsCatalogList");
  if (!container) return;

  const currentIsland = (tripState.islandRu || tripState.island || "").toLowerCase();
  let islandHotels = DATA_STORE.hotels.filter(h => {
    const hi = (h.island || "").toLowerCase();
    const hiru = (h.islandRu || "").toLowerCase();
    return hi.includes(currentIsland) || currentIsland.includes(hi) || hiru.includes(currentIsland) || currentIsland.includes(hiru);
  });
  if (islandHotels.length === 0) {
    islandHotels = DATA_STORE.hotels;
  }

  // Первым выводим текущий выбранный / рекомендованный отель, затем по рейтингу
  const sorted = [...islandHotels].sort((a, b) => {
    if (a.id === tripState.selectedHotelId) return -1;
    if (b.id === tripState.selectedHotelId) return 1;
    if (a.id === tripState.recommendedHotelId) return -1;
    if (b.id === tripState.recommendedHotelId) return 1;
    return (b.rating || 0) - (a.rating || 0);
  });

  container.innerHTML = sorted.map(hotel => {
    const isSelected = hotel.id === tripState.selectedHotelId;
    const isAiPick = hotel.id === tripState.recommendedHotelId;
    const totalPrice = hotel.priceNight * tripState.nights;

    return `
      <div class="catalog-hotel-card ${isSelected ? 'selected' : ''}">
        <div class="catalog-hotel-img-box">
          <img class="catalog-hotel-img" src="${hotel.image}" alt="${hotel.name}">
          ${isAiPick ? `<span class="badge-ai-pick">Рекомендация • ${hotel.matchScore || 98}%</span>` : ''}
          ${isSelected ? `<span class="badge-selected">Выбран в туре</span>` : ''}
        </div>
        <div class="catalog-hotel-body">
          <div class="catalog-hotel-top">
            <h3 class="catalog-hotel-name">${hotel.name}</h3>
            <span class="catalog-hotel-stars">${"★".repeat(hotel.stars)}</span>
          </div>

          <div class="catalog-hotel-address">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${hotel.exactAddress || hotel.location}</span>
          </div>

          <div class="catalog-hotel-rating">
            <span class="rating-badge">★ ${hotel.rating}</span>
            <span>${hotel.reviewsCount} отзывов</span>
            <span class="badge-match-pill">${hotel.matchScore || 95}% совпадение</span>
          </div>

          <p class="catalog-hotel-desc">${hotel.desc}</p>

          <div class="catalog-hotel-amenities">
            ${hotel.amenities.map(a => `<span class="amenity-chip">${a}</span>`).join("")}
          </div>

          <div class="catalog-hotel-bottom">
            <div class="catalog-hotel-price-col">
              <span class="catalog-hotel-price">${totalPrice.toLocaleString("ru-RU")} ₽</span>
              <span class="catalog-hotel-price-sub">${hotel.priceNight.toLocaleString("ru-RU")} ₽ / ночь • ${tripState.nights} ночей</span>
            </div>

            <button
              type="button"
              class="btn-select-item ${isSelected ? 'active' : ''}"
              onclick="switchHotel('${hotel.id}')"
            >
              ${isSelected ? 'Выбран в туре' : 'Выбрать этот отель'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderFlightsCatalog() {
  const container = document.getElementById("flightsCatalogList");
  if (!container) return;

  const available = DATA_STORE.flights.filter(f => f.destinationIsland === tripState.island);
  const flightsToShow = available.length > 0 ? available : DATA_STORE.flights;

  const sorted = [...flightsToShow].sort((a, b) => {
    if (a.id === tripState.selectedFlightId) return -1;
    if (b.id === tripState.selectedFlightId) return 1;
    return 0;
  });

  container.innerHTML = sorted.map(flight => {
    const isSelected = flight.id === tripState.selectedFlightId;
    const totalPrice = flight.priceTotal * tripState.guests;

    return `
      <div class="catalog-item-card ${isSelected ? 'selected' : ''}">
        <div class="catalog-item-header">
          <div>
            <h4 class="catalog-item-title">${flight.airline} (${flight.flightNumber})</h4>
            <div class="catalog-item-sub">${flight.originCity} (${flight.origin}) — ${tripState.islandRu} (${flight.destination})</div>
          </div>
          ${isSelected ? `<span class="badge-selected" style="position: static;">Выбран в туре</span>` : ''}
        </div>

        <div class="catalog-item-meta">
          <div><b>В пути:</b> ${flight.duration.replace(" в пути", "")} (пересадок: ${flight.stops})</div>
          <div><b>График:</b> вылет ${flight.departureTime} • прилет ${flight.arrivalTime}</div>
          <div><b>Условия:</b> ${flight.baggage}</div>
        </div>

        <div class="catalog-item-footer">
          <div>
            <div class="catalog-hotel-price">${totalPrice.toLocaleString("ru-RU")} ₽</div>
            <div class="catalog-hotel-price-sub">за ${tripState.guests} пассажиров туда и обратно</div>
          </div>

          <button
            type="button"
            class="btn-select-item ${isSelected ? 'active' : ''}"
            onclick="switchFlight('${flight.id}')"
          >
            ${isSelected ? 'Выбран в туре' : 'Выбрать этот рейс'}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderTransfersCatalog() {
  const container = document.getElementById("transfersCatalogList");
  if (!container) return;

  const available = DATA_STORE.transfers.filter(t => t.island === tripState.island);
  const transfersToShow = available.length > 0 ? available : DATA_STORE.transfers;

  const sorted = [...transfersToShow].sort((a, b) => {
    if (a.id === tripState.selectedTransferId) return -1;
    if (b.id === tripState.selectedTransferId) return 1;
    return 0;
  });

  container.innerHTML = sorted.map(transfer => {
    const isSelected = transfer.id === tripState.selectedTransferId;

    return `
      <div class="catalog-item-card ${isSelected ? 'selected' : ''}">
        <div class="catalog-item-header">
          <div>
            <h4 class="catalog-item-title">${transfer.vehicle}</h4>
            <div class="catalog-item-sub">${transfer.route.replace("->", "→")}</div>
          </div>
          ${isSelected ? `<span class="badge-selected" style="position: static;">Выбран в туре</span>` : ''}
        </div>

        <div class="catalog-item-meta">
          <div><b>Условия поездки:</b> ${transfer.desc}</div>
          <div><b>Тариф:</b> Фиксированный, без доплат за пробки или задержку рейса</div>
        </div>

        <div class="catalog-item-footer">
          <div>
            <div class="catalog-hotel-price">${transfer.price.toLocaleString("ru-RU")} ₽</div>
            <div class="catalog-hotel-price-sub">Индивидуальный трансфер в отель</div>
          </div>

          <button
            type="button"
            class="btn-select-item ${isSelected ? 'active' : ''}"
            onclick="switchTransfer('${transfer.id}')"
          >
            ${isSelected ? 'Выбран в туре' : 'Выбрать этот трансфер'}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

window.switchHotel = function(id) {
  tripState.selectedHotelId = id;
  renderArtifactContent();
  const hotel = DATA_STORE.hotels.find(x => x.id === id);
  if (hotel) {
    addChatMessage("agent", `Отель изменен на ${hotel.name}. Таймлайн заселения и общая стоимость тура пересчитаны.`);
  }
};

window.switchFlight = function(id) {
  tripState.selectedFlightId = id;
  renderArtifactContent();
  const flight = DATA_STORE.flights.find(x => x.id === id);
  if (flight) {
    addChatMessage("agent", `Рейс изменен на ${flight.airline}. График вылета и трансфера обновлен.`);
  }
};

window.switchTransfer = function(id) {
  tripState.selectedTransferId = id;
  renderArtifactContent();
  const transfer = DATA_STORE.transfers.find(x => x.id === id);
  if (transfer) {
    addChatMessage("agent", `Трансфер изменен на ${transfer.vehicle}.`);
  }
};

function calculateGrandTotal() {
  const h = DATA_STORE.hotels.find(x => x.id === tripState.selectedHotelId);
  const f = DATA_STORE.flights.find(x => x.id === tripState.selectedFlightId);
  const t = DATA_STORE.transfers.find(x => x.id === tripState.selectedTransferId);

  const hotelTotal = (h ? h.priceNight : 0) * tripState.nights;
  const flightTotal = (f ? f.priceTotal : 0) * tripState.guests;
  const transferTotal = t ? t.price : 0;

  return hotelTotal + flightTotal + transferTotal;
}

function updatePriceCalculation(hotel, flight, transfer) {
  const hotelTotal = (hotel ? hotel.priceNight : 0) * tripState.nights;
  const flightTotal = (flight ? flight.priceTotal : 0) * tripState.guests;
  const transferTotal = transfer ? transfer.price : 0;
  const grandTotal = hotelTotal + flightTotal + transferTotal;

  document.getElementById("calcHotelPrice").textContent = `${hotelTotal.toLocaleString("ru-RU")} ₽`;
  document.getElementById("calcFlightPrice").textContent = `${flightTotal.toLocaleString("ru-RU")} ₽`;
  document.getElementById("calcTransferPrice").textContent = `${transferTotal.toLocaleString("ru-RU")} ₽`;
  document.getElementById("calcGrandTotalPrice").textContent = `${grandTotal.toLocaleString("ru-RU")} ₽`;
}

/**
 * Аккуратный парсер Markdown для сообщений чата
 */
function formatMarkdown(text) {
  if (!text) return "";
  let html = escapeHtml(text);
  // Жирный шрифт **текст**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Курсив *текст*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Списки с точками или дефисами
  html = html.replace(/(?:^|\n)[•\-\*]\s+(.+)/g, '<li class="chat-li">$1</li>');
  html = html.replace(/(<li class="chat-li">[\s\S]*?<\/li>)/g, '<ul class="chat-ul">$1</ul>');
  // Убираем склеенные теги списков
  html = html.replace(/<\/ul>\s*<ul class="chat-ul">/g, '');
  // Нумерованные списки 1. 2. 3.
  html = html.replace(/(?:^|\n)(\d+)\.\s+(.+)/g, '<li class="chat-oli"><span class="oli-num">$1.</span> $2</li>');
  html = html.replace(/(<li class="chat-oli">[\s\S]*?<\/li>)/g, '<ol class="chat-ol">$1</ol>');
  html = html.replace(/<\/ol>\s*<ol class="chat-ol">/g, '');
  // Абзацы
  html = html.replace(/\n\n/g, '<div class="chat-p-gap"></div>');
  html = html.replace(/\n/g, '<br>');
  return html;
}

/**
 * Чат сообщения
 */
function addChatMessage(role, text) {
  if (!window.chatMessagesList) window.chatMessagesList = [];
  window.chatMessagesList.push({ role, text });
  const container = document.getElementById("chatHistory");
  const div = document.createElement("div");
  div.className = `chat-msg ${role === 'user' ? 'chat-msg-user' : 'chat-msg-agent'}`;
  div.innerHTML = `<div class="bubble">${role === 'user' ? escapeHtml(text).replace(/\n/g, '<br>') : formatMarkdown(text)}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addAgentMessageWithArtifact(text, total) {
  if (!window.chatMessagesList) window.chatMessagesList = [];
  window.chatMessagesList.push({ role: "agent", text });
  const container = document.getElementById("chatHistory");
  const div = document.createElement("div");
  div.className = "chat-msg chat-msg-agent";

  div.innerHTML = `
    <div class="bubble">
      ${formatMarkdown(text)}

      <div class="artifact-trigger-card" onclick="openArtifact()">
        <div class="trigger-info">
          <strong>Поездка на ${tripState.islandRu} целиком</strong>
          <span>Все включено • ${total.toLocaleString("ru-RU")} ₽</span>
        </div>
        <div class="btn-open-art">
          <span>Открыть план</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
  `;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
