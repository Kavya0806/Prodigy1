// --- Helper: City's coordinates using Open-Meteo Geocoding ---
async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || !data.results.length) throw Error('City not found.');
  let loc = data.results[0];
  return { lat: loc.latitude, lon: loc.longitude, name: loc.name, country: loc.country };
}

// --- Helper: Get current weather from Open-Meteo ---
async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.current_weather) throw Error('Weather data unavailable.');
  return data.current_weather;
}

// --- UI Handlers ---
const form = document.getElementById('location-form');
const cityInput = document.getElementById('city-input');
const weatherDiv = document.getElementById('weather-output');
const geoBtn = document.getElementById('geolocate');

// Display Weather Info
function showWeather(location, weather) {
  weatherDiv.innerHTML = `
    <table class="weather-table">
      <tr><td class="weather-label">Location:</td><td>${location}</td></tr>
      <tr><td class="weather-label">Temperature:</td><td>${weather.temperature}°C</td></tr>
      <tr><td class="weather-label">Windspeed:</td><td>${weather.windspeed} km/h</td></tr>
      <tr><td class="weather-label">Direction:</td><td>${weather.winddirection}°</td></tr>
      <tr><td class="weather-label">Condition:</td><td>${weather.weathercode !== undefined ? weatherDescription(weather.weathercode) : "—"}</td></tr>
      <tr><td class="weather-label">Time:</td><td>${weather.time.replace('T', ' ')}</td></tr>
    </table>
  `;
}
function showError(message) {
  weatherDiv.innerHTML = `<span style="color:#f89c; font-weight:600">${message}</span>`;
}

// Handle city-name lookup
form.onsubmit = async e => {
  e.preventDefault();
  let city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name or use GPS.");
    return;
  }
  weatherDiv.textContent = "Loading...";
  try {
    const coord = await getCoordinates(city);
    const weather = await getWeather(coord.lat, coord.lon);
    showWeather(`${coord.name}, ${coord.country}`, weather);
  } catch (err) {
    showError(err.message || "Could not get weather.");
  }
};

// Handle Geolocation ("My Location" button)
geoBtn.onclick = () => {
  weatherDiv.textContent = "Getting location...";
  if (!navigator.geolocation) {
    showError("Geolocation unsupported by your browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords;
    try {
      const weather = await getWeather(latitude, longitude);
      showWeather("My Location", weather);
    } catch (err) {
      showError(err.message || "Could not get weather.");
    }
  }, () => showError("Could not obtain geolocation."));
};

// Utility: basic weather code to description (Open-Meteo)
function weatherDescription(code) {
  // Reference: https://open-meteo.com/en/docs#api_form
  const codes = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog", 51: "Drizzle: Light", 53: "Drizzle",
    55: "Drizzle: Dense", 56: "Freezing Drizzle: Light", 57: "Freezing Drizzle: Dense",
    61: "Rain: Slight", 63: "Rain: Moderate", 65: "Rain: Heavy",
    66: "Freezing Rain: Light", 67: "Freezing Rain: Heavy",
    71: "Snow fall: Slight", 73: "Snow fall: Moderate", 75: "Snow fall: Heavy",
    77: "Snow grains", 80: "Rain showers: Slight", 81: "Rain showers: Moderate",
    82: "Rain showers: Violent", 85: "Snow showers: Slight", 86: "Snow showers: Heavy",
    95: "Thunderstorm: Slight/Moderate", 96: "Thunderstorm + hail: Slight", 99: "Thunderstorm + hail: Heavy"
  };
  return codes[code] || "Unknown";
}
