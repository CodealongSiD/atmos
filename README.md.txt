# 🌤️ Atmos Weather App

**Atmos** is a lightweight weather app that fetches real-time weather data using city names or geolocation.  
Built with **Vanilla JS frontend** and **Bun-powered backend**, it ensures API security by proxying weather data via a secure server.

---

## 🔧 Tech Stack

- ⚡ **Frontend**: HTML, CSS, JavaScript (Vanilla)
- 🔐 **Backend**: [Bun](https://bun.sh) (JavaScript runtime)
- 🌍 **API**: [OpenWeatherMap](https://openweathermap.org/api)
- 🧪 Local Dev: Live Server + Bun

---

## 🚀 Features

- Search weather by **city name**
- Fetch weather using **geolocation**
- Dynamic **background themes** based on weather
- LocalStorage support for **last searched city**
- All **API keys are hidden** via `.env` and never exposed to frontend

---

## 🔐 Security

All API calls go through the **Bun backend**, keeping the API key secure using environment variables.

---

## 📁 Project Structure

Atmos_Weather_App/
│
├── index.html # UI layout
├── atoms.js # Frontend logic (DOM, fetch, UI)
├── bun.js # Bun server to proxy weather data
├── .env # API key (ignored in Git)
├── .gitignore # Git exclusions
├── assets/ # Background images
└── styles.css # Styling

# 🔧 Setup & Run Atmos Weather App Locally

# 1. Clone the repo
git clone https://github.com/yourusername/atmos-weather-app.git
cd atmos-weather-app

# 2. Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# 3. Create .env file with your OpenWeather API key
echo "API_KEY=your_openweather_api_key" > .env

# 4. Start the Bun backend (serves on http://localhost:3000)
bun run bun.js

# 5. Open frontend with Live Server (e.g., VSCode extension)
# Make sure index.html is served on http://127.0.0.1:5500

📦 Future Improvements
Deploy backend to Railway / Fly.io

Deploy frontend to Vercel / Netlify

Add hourly & 5-day forecast

Progressive Web App (PWA) support

🧑‍💻 Author
Made by Siddharth Sharma