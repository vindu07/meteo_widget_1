const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tabContent');
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const gpsBtn = document.getElementById('gpsBtn');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    tabContents.forEach(c=>c.classList.remove('active'));
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// Funzione per fetch Meteoblue JSON
async function fetchWeather(lat, lon) {
  const apiKey = "TUO_API_KEY_METEBLUE";
  const url = `https://my.meteoblue.api/forecast?lat=${lat}&lon=${lon}&apikey=${apiKey}&hours=24`;
  const res = await fetch(url);
  const data = await res.json();

  // Mostra dati orari
  const orarieDiv = document.getElementById('orarie');
  orarieDiv.innerHTML = '';
  data.hourly.forEach(hour=>{
    const div = document.createElement('div');
    div.innerHTML = `<img src="img/${hour.icon}.png" width="32"> ${hour.time} - ${hour.temperature}°C`;
    orarieDiv.appendChild(div);
  });

  // Mostra dati 7 giorni
  const giorniDiv = document.getElementById('giorni');
  giorniDiv.innerHTML = '';
  data.daily.forEach(day=>{
    const div = document.createElement('div');
    div.innerHTML = `<img src="img/${day.icon}.png" width="32"> ${day.day} - min:${day.min}° max:${day.max}°`;
    giorniDiv.appendChild(div);
  });
}

// Funzione ricerca città
async function geocode(city) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
  const data = await res.json();
  if(data.length) return {lat:data[0].lat, lon:data[0].lon};
  else alert("Località non trovata");
}

// Pulsanti
searchBtn.onclick = async () => {
  const loc = await geocode(locationInput.value);
  fetchWeather(loc.lat, loc.lon);
};
gpsBtn.onclick = () => {
  navigator.geolocation.getCurrentPosition(pos=>{
    fetchWeather(pos.coords.latitude, pos.coords.longitude);
  }, ()=>alert("Errore GPS"));
};

// Caricamento iniziale Tonadico
fetchWeather(46.180, 11.830);
