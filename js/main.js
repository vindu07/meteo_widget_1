// main.js - Meteo modulare funzionante su GitHub Pages

const widgetConfig = {
  daily: {
    title: "Previsioni 7 Giorni",
    template: "https://www.meteoblue.com/it/weather/widget/daily/{code}?geoloc=detect&days=7&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&precipunit=MILLIMETER&coloured=coloured&pictoicon=1&maxtemperature=1&mintemperature=1&windspeed=1&windgust=0&winddirection=1&uv=1&humidity=0&precipitation=1&precipitationprobability=1&spot=0&pressure=0&layout=dark",
    height: "420px",
    credit: "https://www.meteoblue.com/it/weather/week/index"
  },
  hourly: {
    title: "Previsioni Orarie",
    template: "https://www.meteoblue.com/it/weather/widget/three/{code}?geoloc=detect&nocurrent=0&noforecast=0&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=image",
    height: "592px",
    credit: "https://www.meteoblue.com/it/weather/week/index"
  },
  radar: {
    title: "Radar Windy",
    template: "https://embed.windy.com/embed2.html?lat=46.180&lon=11.830&zoom=8&level=surface&overlay=radar&marker=true",
    height: "600px",
    credit: null
  }
};

// Funzione generica per inserire widget
function createWidget(containerId, widget, code = "tonadico_italy_3165571") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const url = widget.template.replace("{code}", code);

  container.innerHTML = `
    <h2 class="text-xl font-semibold text-white mb-2">${widget.title}</h2>
    <iframe src="${url}" frameborder="0" scrolling="NO" allowtransparency="true"
        sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
        style="width: 100%; height: ${widget.height}; border-radius: 12px;">
    </iframe>
    ${widget.credit ? `<div class="text-center mt-1 text-sm opacity-60">
        <a href="${widget.credit}" target="_blank" rel="noopener" class="underline hover:opacity-100">
          meteoblue
        </a>
      </div>` : ""}
  `;
}

// Aggiorna tutti i widget
function updateWidgets(code) {
  createWidget("giorniDiv", widgetConfig.daily, code);
  createWidget("orarieDiv", widgetConfig.hourly, code);
  createWidget("radarDiv", widgetConfig.radar); // radar indipendente
}

// Funzione GPS per Windy
function useGPS() {
  if (!navigator.geolocation) {
    alert("Geolocalizzazione non supportata");
    return;
  }

  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude.toFixed(3);
    const lon = pos.coords.longitude.toFixed(3);
    widgetConfig.radar.template = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=8&level=surface&overlay=radar&marker=true`;
    createWidget("radarDiv", widgetConfig.radar);
  }, () => {
    alert("Impossibile ottenere la posizione");
  });
}

// Eventi al caricamento
document.addEventListener("DOMContentLoaded", () => {
  // Widget default
  updateWidgets("tonadico_italy_3165571");

  // Gestione input ricerca
  const searchInput = document.getElementById("searchInput");
  document.getElementById("searchBtn").addEventListener("click", () => {
    if (searchInput.value.trim() !== "") updateWidgets(searchInput.value.trim());
  });
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchInput.value.trim() !== "") updateWidgets(searchInput.value.trim());
  });

  // Pulsante GPS
  document.getElementById("gpsBtn").addEventListener("click", useGPS);
});
