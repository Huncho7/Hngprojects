const express = require("express");
const axios = require("axios");
const app = express();

const IPINFO_API_TOKEN = "d4ad19c8cb7155";
const WEATHER_API_KEY = "9d61038d6226427e964111724240207"; // Replace with your actual API key
const WEATHER_API_URL = "http://api.weatherapi.com/v1/current.json"; // The endpoint for current weather

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Guest";
  let clientIp = req.ip.replace(/^::ffff:/, "");
  console.log(clientIp)

  const request = await fetch("https://ipinfo.io/json?token=d4ad19c8cb7155");
  const jsonResponse = await request.json();

  console.log(jsonResponse.ip, jsonResponse.city);

  try {
    // Use WeatherAPI to get geolocation and weather data
    const response = await axios.get(
      `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${jsonResponse.city}`
    );
    const data = response.data;
    const city = data.location.name;
    const temperature = data.current.temp_c;

    // Respond with JSON
    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`,
    });
  } catch (error) {
    console.error("Error fetching data from WeatherAPI:", error.message);
    res.status(500).json({ error: "Failed to retrieve data from the API" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
