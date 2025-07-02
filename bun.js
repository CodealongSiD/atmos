// bun.js

import { config } from "dotenv";
config();

const API_KEY = process.env.API_KEY;
const BASE_URL = "http://api.openweathermap.org/data/2.5/weather";
let today = new Date().toDateString();
let dailyCount = 0;

Bun.serve({
    port: 3000,
    hostname: "0.0.0.0",

    fetch: async (req) => {
        const url = new URL(req.url);
        const city = url.searchParams.get("city");
        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");

        let fetchUrl;
        if (city) {
            fetchUrl = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
            console.log("🌐 Fetching weather for city:", fetchUrl);
        } else if (lat && lon) {
            fetchUrl = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            console.log("🌐 Fetching weather for coordinates:", fetchUrl);
        } else {
            return new Response(JSON.stringify({ error: "Missing query: 'city' or 'lat+lon' required" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }

        // 🔄 Reset daily counter
        const now = new Date().toDateString();
        if (now !== today) {
            today = now;
            dailyCount = 0;
            console.log("🔁 New day detected. API count reset.");
        }

        // 🚫 Limit check
        if (dailyCount >= 600) {
            console.warn("⚠️ API limit reached for today");
            return new Response(JSON.stringify({ error: "Daily API limit of 600 calls reached." }), {
                status: 429,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }

        try {
            const res = await fetch(fetchUrl);
            const data = await res.json();

            if (data.cod === 401 || data.message === "Invalid API key.") {
                return new Response(JSON.stringify({ error: "API key is invalid." }), {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                });
            }

            dailyCount += 1; // ✅ Only count on success

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: "Server error", details: err.message }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }
    },
});

console.log("🌐 Bun server running at http://localhost:3000");
