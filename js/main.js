// main.js originale compatibile

// === CONFIGURAZIONE WIDGET ===
const widgetConfig = {
  daily: {
    title: "Previsioni 7 Giorni",
    url: "https://www.meteoblue.com/it/weather/widget/daily/tonadico_italy_3165571?geoloc=detect&days=7&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&precipunit=MILLIMETER&coloured=coloured&pictoicon=1&maxtemperature=1&mintemperature=1&windspeed=1&windgust=0&winddirection=1&uv=1&humidity=0&precipitation=1&precipitationprobability=1&spot=0&pressure=0&layout=dark",
    height: "420px",
    credit: "https://www.meteoblue.com/it/weather/week/index"
  },
  hourly: {
    title: "Previsioni Orarie",
    url: "https://www.meteoblue.com/it/weather/widget/three/tonadico_italy_3165571?geoloc=detect&nocurrent=0&noforecast=0&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=image",
    height: "592px",
    credit: "https://www.meteoblue.com/it/weather/week/index"
  },
  radar: {
    title: "Radar Windy",
    url: "https://embed.windy.com/embed2.html?lat=46.180&lon=11.830&zoom=8&level=surface&overlay=radar&marker=true",
    height: "600px",
    credit: null
  }
};

// === FUNZIONE PER CREARE I WIDGET ===
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
      style="width: 100%; height: ${widget.height};">
    </iframe>
    ${widget.credit ? `<div style="text-align:center; margin-top:4px; opacity:0.6;">
      <a href="${widget.credit}" target="_blank" rel="noopener" style="color:#ccc; text-decoration:underline;">meteoblue</a>
    </div>` : ''}
  `;
}

//evidenzia la tab
function setActiveTab(tabIndex) {
  const buttons = document.querySelectorAll('.tabs button');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i === tabIndex);
  });
}


// === MOSTRA UN SOLO WIDGET ALLA VOLTA ===
function showWidget(id) {
  const widgets = document.querySelectorAll('.widget');
  widgets.forEach(w => w.style.display = 'none');
  document.getElementById(id).style.display = 'block';

  // Aggiorna tab attiva
  switch(id) {
    case 'giorniDiv': setActiveTab(0); break;
    case 'orarieDiv': setActiveTab(1); break;
    case 'radarDiv': setActiveTab(2); break;
  }
}

// === INIZIALIZZAZIONE PAGINA ===
document.addEventListener("DOMContentLoaded", () => {
  createWidget("giorniDiv", widgetConfig.daily);
  createWidget("orarieDiv", widgetConfig.hourly);
  createWidget("radarDiv", widgetConfig.radar);

  showWidget("giorniDiv");

  // Pulsante GPS
  document.getElementById("gpsBtn").addEventListener("click", () => {
    if (!navigator.geolocation) return alert("Geolocalizzazione non supportata");
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude.toFixed(3);
      const lon = pos.coords.longitude.toFixed(3);
      widgetConfig.radar.url = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=8&level=surface&overlay=radar&marker=true`;
      createWidget("radarDiv", widgetConfig.radar);
      showWidget("radarDiv");
    }, () => alert("Impossibile ottenere la posizione"));
  });

  // Pulsante ricerca
  const searchInput = document.getElementById("searchInput");
  document.getElementById("searchBtn").addEventListener("click", () => {
    const value = searchInput.value.trim();
    if (!value) return;
    const parts = value.split(",");
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lon)) {
        widgetConfig.radar.url = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=8&level=surface&overlay=radar&marker=true`;
        createWidget("radarDiv", widgetConfig.radar);
        showWidget("radarDiv");
      } else alert("Formato lat,lon non valido");
    } else alert("Inserisci lat e lon separati da una virgola, es: 46.180,11.830");
  });
});


