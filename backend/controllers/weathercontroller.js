import axios from "axios"

// 🌦 Current Weatherexport 
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
  } catch (error) {
    res.status(404).json({ message: "Weather not found" })
  }
}

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
  } catch (err) {
    res.status(404).json({ message: "Forecast not found" })
  }
}
