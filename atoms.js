// Atmos Weather App (Bun integrated)
// 🌤️ Atmos Weather App

const sbar = document.querySelector('.sbar');
const sbtn = document.querySelector('.sbtn');
const BASE_URL = location.hostname === "localhost"
  ? "http://localhost:3000"
  : "https://atmos-5hgj.onrender.com";

// ✅ DAILY LIMIT (600 requests/device/day)
function checkDailyLimit() {
  const today = new Date().toDateString();
  const usage = JSON.parse(localStorage.getItem("apiUsage")) || {};

  if (usage.date !== today) {
    usage.date = today;
    usage.count = 0;
  }

  if (usage.count >= 600) {
    alert("🌐 Daily usage limit reached (600). Please try again tomorrow.");
    return false;
  }

  usage.count += 1;
  localStorage.setItem("apiUsage", JSON.stringify(usage));
  return true;
}

// 🌐 Fetch Weather by City
async function fetchWeatherByCity(city) {
  if (!checkDailyLimit()) return;

  try {
    const res = await fetch(`${BASE_URL}?city=${city}`);
    const data = await res.json();
    updateWeather(data);
    localStorage.setItem('lastCity', city);
  } catch (err) {
    console.error("❌ Error fetching weather by city:", err);
  }
}

// 📍 Fetch Weather by Coordinates
async function fetchWeatherByCoords(lat, lon) {
  if (!checkDailyLimit()) return;

  try {
    const res = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    updateWeather(data);
  } catch (err) {
    console.error("❌ Error fetching weather by coordinates:", err);
  }
}

// 🎨 Update UI
function updateWeather(data) {
  const city = data.name;
  const temp = Math.round(data.main.temp);
  const weather = data.weather[0].main;
  const time = new Date(data.dt * 1000).toLocaleTimeString();

  const tips = {
    Rain: "Carry an umbrella, it will Rain today! 🌧️ ",
    Drizzle: "You might need a hoodie. Light rain ahead! 🌦️ ",
    Thunderstorm: "Avoid commuting. Thunderstorm ongoing today!⛈️ ",
    Snow: "Stay warm. Snowfall begins today!❄️ ",
    Clear: "Good day to visit the beach! ☀️ ",
    Clouds: "Clouds will be watching over you today! ☁️ ",
    Mist: "Visibility might be low. Drive safe. 🌫️ ",
    Haze: "Air might feel heavy today. 🌫️ ",
    Fog: "Foggy day. Take precautions while driving! 🌁 "
  };

  const weatherDescriptions = {
    Rain: "It's rainy",
    Drizzle: "It's drizzling",
    Thunderstorm: "There's a thunderstorm",
    Snow: "It's snowing",
    Clear: "It's sunny",
    Clouds: "It's cloudy",
    Mist: "It's misty",
    Haze: "It's hazy",
    Fog: "It's foggy"
  };

  const backgroundImages = {
    Clear: {
      day: "Calm Day.jpg",
      night: "Calm Night.jpg"
    },
    Clouds: {
      day: "Cloudy Day.jpg",
      night: "Cloudy Night.jpg"
    },
    Rain: {
      day: "Rainy Day.jpg",
      night: "Rainy Night.jpg"
    },
    Snow: {
      day: "Snowy Night.jpg",
      night: "Snowy Night.jpg"
    },
    Beach: {
      day: "Beach Day.jpg",
      night: "Beach Night.jpg"
    }
  };

  const desc = weatherDescriptions[weather] || weather;
  let tip = tips[weather] || `Mostly ${desc} since ${time}`;

  if (temp > 37) tip = "Don't forget your shades and sunscreen today! ☀️";

  document.querySelector('.uphead p').textContent = `📍 ${city}`;
  document.querySelector('.midit h1').textContent = `${temp}°C`;

  const miditPara = document.querySelector('.midit p');
  if (miditPara) miditPara.textContent = desc;

  const wcardTip = document.querySelector('.wcard p');
  if (wcardTip) wcardTip.textContent = tip;

  const hour = new Date(data.dt * 1000).getHours();
  const isDayTime = hour >= 6 && hour < 19;

  let bgImage = "default.jpg";
  if (weather in backgroundImages) {
    const timeOfDay = isDayTime ? "day" : "night";
    bgImage = backgroundImages[weather][timeOfDay] || bgImage;
  }

  document.body.style.backgroundImage = `url('/assets/${bgImage}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}

// 🌎 Get Weather on Load
function getLocationAndWeather() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    },
    () => {
      console.log("❌ Couldn't get location");
    }
  );
}

// 🔍 City Search
sbtn.addEventListener('click', () => {
  if (sbar.value.trim() !== '') {
    const city = sbar.value.trim();
    fetchWeatherByCity(city);
    sbar.value = '';
    sbar.blur();
  }
});

sbar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && sbar.value.trim() !== '') {
    const city = sbar.value.trim();
    fetchWeatherByCity(city);
    sbar.value = '';
    sbar.blur();
  }
});

// ✅ Auto-fetch on page load
window.onload = getLocationAndWeather;
