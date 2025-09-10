// js/main.js — aggiorna/pezza i widget Meteoblue + Windy (radar)
// Assicurati che in index.html ci siano gli elementi con questi id:
// #giorni, #orarie, #radar, #locationInput, #searchBtn, #gpsBtn
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tabContent');
const giorniDiv = document.getElementById('giorni');
const orarieDiv = document.getElementById('orarie');
const radarDiv = document.getElementById('radar');

const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const gpsBtn = document.getElementById('gpsBtn');

// TAB switching
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    tabContents.forEach(c => c.classList.remove('active'));
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// HELPERS: crea iframe + script (usato per i widget Meteoblue)
function injectMeteoblue(container, iframeUrl, scriptUrl, height = '520px') {
  // Pulisce il contenitore (per evitare doppioni di script)
  container.innerHTML = '';
  // iframe
  const iframe = document.createElement('iframe');
  iframe.src = iframeUrl;
  iframe.frameBorder = 0;
  iframe.scrolling = 'no';
  iframe.setAttribute('allowtransparency', 'true');
  iframe.style.width = '100%';
  iframe.style.height = height;
  iframe.style.borderRadius = '12px';
  container.appendChild(iframe);
  // script (necessario per il resize/initialization del widget Meteoblue)
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scriptUrl;
  // append script dopo l'iframe
  container.appendChild(script);
}

// Carica i widget Meteoblue (giorni + orarie)
function loadMeteoblueWidgets() {
  // Daily (7 giorni) — usa la chiave Tonadico che mi hai dato
  const dailyBase = 'https://www.meteoblue.com/en/weather/widget/daily/tonadico_italy_3165571?geoloc=detect&days=7&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&coloured=1';
  injectMeteoblue(giorniDiv, dailyBase, dailyBase + '&iframe=1', '520px');

  // Three-hour (previsioni orarie/3h) — widget ufficiale Meteoblue per orari
  const threehourBase = 'https://www.meteoblue.com/en/weather/widget/threehour/tonadico_italy_3165571?geoloc=detect&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&coloured=1&pictoicon=1&days=3';
  injectMeteoblue(orarieDiv, threehourBase, threehourBase + '&iframe=1', '615px');
}

// Carica/aggiorna Windy (radar) nel contenitore radarDiv
function loadWindy(lat = 46.180, lon = 11.830) {
  radarDiv.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.src = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=8&level=surface&overlay=radar&marker=true`;
  iframe.frameBorder = 0;
  iframe.style.width = '100%';
  iframe.style.height = '600px';
  iframe.style.borderRadius = '12px';
  radarDiv.appendChild(iframe);
}

// Geocoding semplice con Nominatim (OpenStreetMap)
async function geocode(city) {
  try {
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
    const json = await resp.json();
    if (!json || json.length === 0) return null;
    return { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon), display_name: json[0].display_name };
  } catch (e) {
    console.error('Geocoding error', e);
    return null;
  }
}

// Button handlers
searchBtn.addEventListener('click', async () => {
  const city = locationInput.value.trim();
  if (!city) return alert('Inserisci una località');
  const g = await geocode(city);
  if (!g) return alert('Località non trovata');
  loadWindy(g.lat.toFixed(3), g.lon.toFixed(3));
  // opzionale: salva ultimo risultato
  localStorage.setItem('lastLocation', city);
});

gpsBtn.addEventListener('click', () => {
  if (!navigator.geolocation) return alert('Geolocalizzazione non supportata');
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude.toFixed(3);
    const lon = pos.coords.longitude.toFixed(3);
    loadWindy(lat, lon);
    locationInput.value = `Lat:${lat},Lon:${lon}`;
    localStorage.setItem('lastLocation', `Lat:${lat},Lon:${lon}`);
  }, err => {
    console.warn(err);
    alert('Errore nel GPS');
  }, { enableHighAccuracy: true });
});

// Restore last location (solo per radar)
window.addEventListener('load', () => {
  loadMeteoblueWidgets(); // carica Meteoblue (giorni + orarie)
  const last = localStorage.getItem('lastLocation');
  if (last && last.startsWith('Lat:')) {
    // formato GPS salvato
    const parts = last.replace('Lat:','').replace('Lon:','').split(',');
    loadWindy(parts[0], parts[1]);
  } else {
    // default Tonadico
    loadWindy(46.180, 11.830);
  }
});
