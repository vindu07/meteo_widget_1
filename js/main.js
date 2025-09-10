
// main.js - Versione modulare con geolocalizzazione e ricerca

// === CONFIGURAZIONE WIDGET ===
// {code} verrà sostituito automaticamente con "nome_paese_id"
const widgetConfig = {
  daily: {
    title: "Previsioni 7 Giorni",
    template:
      "https://www.meteoblue.com/it/weather/widget/daily/{code}?geoloc=detect&days=7&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&precipunit=MILLIMETER&coloured=coloured&pictoicon=1&maxtemperature=1&mintemperature=1&windspeed=1&windgust=0&winddirection=1&uv=1&humidity=0&precipitation=1&precipitationprobability=1&spot=0&pressure=0&layout=dark",
    height: "420px",
    credit: "https://www.meteoblue.com/it/weather/week/index"
  },
  hourly: {
    title: "Previsioni Orarie",
    template:
      "https://www.meteoblue.com/it/weather/widget/three/{code}?geoloc=detect&nocurrent=0&noforecast=0&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=image",
    height: "592px",
    credit: "https://www.meteoblue.com/it/weather/week/index"
  },
  radar: {
    title: "Radar Windy",
    template:
      "https://embed.windy.com/embed2.html?lat=46.180&lon=11.830&zoom=8&level=surface&overlay=radar&marker=true",
    height: "600px",
    credit: null
  }
};

// === RENDER GENERICO DEL WIDGET ===
function createWidget(containerId, widget, code = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const url = code ? widget.template.replace("{code}", code) : widget.template;

  container.innerHTML = `
    <h2 class="text-xl font-semibold text-white mb-2">${widget.title}</h2>
    <iframe src="${url}"
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

// === CERCA SOLO CODICE CITTA SU METEOBLUE ===
async function getMeteoblueCode(cityName) {
  try {
    const res = await fetch(
      `https://www.meteoblue.com/en/server/search/query3?query=${encodeURIComponent(cityName)}`
    );
    const data = await res.json();

    if (data && data.length > 0) {
      const city = data[0];
      // Costruisce codice città: nome_paese_geonameId
      return `${city.name.toLowerCase().replace(/\s+/g, "-")}_${city.country.toLowerCase().replace(/\s+/g, "-")}_${city.geonameId}`;
    } else {
      alert("Località non trovata su Meteoblue.");
      return null;
    }
  } catch (err) {
    console.error("Errore ricerca città:", err);
    return null;
  }
}

// === AGGIORNA I WIDGET CON NUOVO CODICE ===
function updateWidgets(code) {
  createWidget("giorniDiv", widgetConfig.daily, code);
  createWidget("orarieDiv", widgetConfig.hourly, code);
  createWidget("radarDiv", widgetConfig.radar); // radar non usa codice città
}

// === GEOLOCALIZZAZIONE ===
async function rilevaPosizione() {
  if (!navigator.geolocation) {
    const fallbackCode = await getMeteoblueCode("Tonadico");
    if (fallbackCode) updateWidgets(fallbackCode);
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const res = await fetch(
        `https://www.meteoblue.com/en/server/search/query3?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const city = data[0];
        const code = `${city.name.toLowerCase()}_${city.country.toLowerCase()}_${city.geonameId}`;
        document.getElementById("searchInput").value = `${city.name}, ${city.country}`;
        updateWidgets(code);
      } else {
        const fallbackCode = await getMeteoblueCode("Tonadico");
        if (fallbackCode) updateWidgets(fallbackCode);
      }
    } catch (err) {
      console.error("Errore reverse geocoding:", err);
    }
  });
}

// === EVENTI ===
document.addEventListener("DOMContentLoaded", () => {
  rilevaPosizione();

  document.getElementById("searchInput").addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const code = await getMeteoblueCode(e.target.value);
      if (code) updateWidgets(code);
    }
  });
});
