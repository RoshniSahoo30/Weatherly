import axios from "axios"

// 🌦 Current Weather
export const getWeather = async (req, res) => {
  try {
    const { city, lat, lon } = req.query

    let url = ""

    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    } else {
      return res.status(400).json({ message: "City or location required" })
    }

    const response = await axios.get(url)
    res.json(response.data)
  } catch {
    res.status(404).json({ message: "Weather not found" })
  }
}

// 🌫 AQI
export const getAQI = async (req, res) => {
  const { lat, lon } = req.query

  if (!lat || !lon) {
    return res.status(400).json({ message: "lat & lon required" })
  }

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/air_pollution",
    {
      params: {
        lat,
        lon,
        appid: process.env.WEATHER_API_KEY,
      },
    }
  )

  res.json(response.data)
}

// 📅 7-Day Forecast (FREE TIER SAFE)
export const getDailyForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query

    if (!lat || !lon) {
      return res.status(400).json({ message: "lat & lon required" })
    }

    const forecastRes = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          lat,
          lon,
          units: "metric",
          appid: process.env.WEATHER_API_KEY,
        },
      }
    )

    // 🔍 HARD GUARD
    if (
      !forecastRes.data ||
      !Array.isArray(forecastRes.data.list)
    ) {
      console.error("Invalid forecast response:", forecastRes.data)
      return res.status(500).json({ message: "Invalid forecast data" })
    }

    const dailyMap = {}

    for (const item of forecastRes.data.list) {
      if (
        item.dt_txt &&
        item.dt_txt.includes("12:00:00") &&
        item.main &&
        typeof item.main.temp === "number"
      ) {
        const date = item.dt_txt.split(" ")[0]
        dailyMap[date] = {
          dt: item.dt,
          temp: item.main.temp,
        }
      }
    }

    const daily = Object.values(dailyMap).slice(0, 7)

    if (daily.length === 0) {
      console.error("No midday entries found")
      return res.status(404).json({ message: "No daily data available" })
    }

    res.json({ daily })
  } catch (error) {
    console.error(
      "Daily forecast error:",
      error.response?.data || error.message
    )
    res.status(500).json({ message: "Daily forecast not found" })
  }
}

// 📈 Hourly Forecast (5-day / 3-hour)
export const getForecast = async (req, res) => {
  try {
    const { city } = req.query

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          q: city,
          units: "metric",
          appid: process.env.WEATHER_API_KEY,
        },
      }
    )

    res.json(response.data)
  } catch {
    res.status(404).json({ message: "Forecast not found" })
  }
}
