// main.js - Gestione widget meteo e radar

// === CONFIGURAZIONE WIDGET ===
const widgetConfig = {
  daily: {
    title: "Previsioni 7 Giorni",
    url: "https://www.meteoblue.com/it/weather/widget/daily?geoloc=detect&days=7&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&precipunit=MILLIMETER&coloured=coloured&pictoicon=1&maxtemperature=1&mintemperature=1&windspeed=1&windgust=0&winddirection=1&uv=1&humidity=0&precipitation=1&precipitationprobability=1&spot=0&pressure=0&layout=dark",
    height: "420px",
    credit: "https://www.meteoblue.com/it/weather/week/index"
  },
  hourly: {
    title: "Previsioni Orarie",
    url: "https://www.meteoblue.com/it/weather/widget/three?geoloc=detect&nocurrent=0&noforecast=0&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=image",
    height: "592px",
    credit: "https://www.meteoblue.com/it/weather/week/index"
  },
  radar: {
    title: "Radar Windy",
    url: "https://embed.windy.com/embed2.html?lat=46.180&lon=11.830&zoom=8&level=surface&overlay=radar&marker=true",
    height: "600px",
    credit: null // Windy non richiede link obbligatorio
  }
};

// === FUNZIONE GENERICA PER INSERIRE IFRAME ===
function createWidget(containerId, widget) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <h2 class="text-xl font-semibold text-white mb-2">${widget.title}</h2>
    <iframe src="${widget.url}"
      frameborder="0"
      scrolling="NO"
      allowtransparency="true"
      sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
      style="width: 100%; height: ${widget.height}; border-radius: 12px;">
    </iframe>
    ${
      widget.credit
        ? `<div class="text-center mt-1 text-sm opacity-60">
             <a href="${widget.credit}" target="_blank" rel="noopener" class="underline hover:opacity-100">
               meteoblue
             </a>
           </div>`
        : ""
    }
  `;
}

// === INIZIALIZZAZIONE PAGINA ===
document.addEventListener("DOMContentLoaded", () => {
  createWidget("giorniDiv", widgetConfig.daily);
  createWidget("orarieDiv", widgetConfig.hourly);
  createWidget("radarDiv", widgetConfig.radar);
});

// === CAMBIO LOCALITÀ (Opzionale) ===
function updateLocation(newUrlDaily, newUrlHourly) {
  widgetConfig.daily.url = newUrlDaily;
  widgetConfig.hourly.url = newUrlHourly;
  createWidget("giorniDiv", widgetConfig.daily);
  createWidget("orarieDiv", widgetConfig.hourly);
}
