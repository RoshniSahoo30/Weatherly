import { useEffect, useState, useContext } from "react"
import API from "../services/api"
import HourlyChart from "./HourlyChart"
import { AuthContext } from "../context/authcontext"

const Weather = ({ city, onAddFavorite }) => {
  const { darkMode, user } = useContext(AuthContext)

  const [searchCity, setSearchCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [hourly, setHourly] = useState([])
  const [aqi, setAqi] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [message, setMessage] = useState("")
  const [adding, setAdding] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)

  /* 🎨 THEME */
  const cardBg = darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
  const inputBg = darkMode
    ? "bg-slate-700 border-slate-600 text-white"
    : "bg-white border-gray-300 text-gray-800"
  const chipBg = darkMode
    ? "bg-slate-700 hover:bg-slate-600"
    : "bg-gray-100 hover:bg-gray-200"

  /* 🔹 Load recent searches */
  const loadRecentSearches = async () => {
    try {
      const res = await API.get("/history")
      setRecentSearches(res.data)
    } catch {
      setRecentSearches([])
    }
  }

  useEffect(() => {
    if (!user) {
      setWeather(null)
      setHourly([])
      setAqi(null)
      setAlerts([])
      setRecentSearches([])
    } else {
      loadRecentSearches()
    }
  }, [user])

  /* 🔹 Save search */
  const saveSearchHistory = async (cityName) => {
    try {
      await API.post("/history", { city: cityName })
    } catch {}
  }

  /* 🧹 Clear search history */
  const clearSearchHistory = async () => {
    try {
      await API.delete("/history")
      setRecentSearches([])
    } catch {
      setMessage("Failed to clear search history")
    }
  }

  /* 🔹 Hourly processing */
  const processHourly = (list) => {
    const data = list.slice(0, 8).map((item) => ({
      time: item.dt_txt.split(" ")[1].slice(0, 5),
      temp: Math.round(item.main.temp),
    }))
    setHourly(data)
  }

  /* 🔹 Forecast */
  const fetchForecast = async (cityName) => {
    try {
      const res = await API.get(
        `/weather/forecast?city=${encodeURIComponent(cityName)}`
      )
      processHourly(res.data.list)
    } catch {
      setHourly([])
    }
  }

  /* 🌫 AQI */
  const fetchAQI = async (lat, lon) => {
    try {
      const res = await API.get(`/weather/aqi?lat=${lat}&lon=${lon}`)
      setAqi(res.data.list[0].main.aqi)
    } catch {
      setAqi(null)
    }
  }

  /* 🔹 Weather by city */
  const fetchWeather = async (cityName) => {
    if (!cityName) return
    try {
      const res = await API.get(
        `/weather?city=${encodeURIComponent(cityName)}`
      )
      setWeather(res.data)
      setMessage("")
      fetchForecast(cityName)
      fetchAQI(res.data.coord.lat, res.data.coord.lon)
      await saveSearchHistory(cityName)
      loadRecentSearches()
    } catch {
      setMessage("City not found")
      setWeather(null)
      setHourly([])
      setAqi(null)
    }
  }

  /* 📍 Location weather */
  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation not supported")
      return
    }

    setLoadingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await API.get(
            `/weather?lat=${coords.latitude}&lon=${coords.longitude}`
          )
          setWeather(res.data)
          setMessage("")
          fetchForecast(res.data.name)
          fetchAQI(res.data.coord.lat, res.data.coord.lon)
          await saveSearchHistory(res.data.name)
          loadRecentSearches()
        } catch {
          setMessage("Failed to fetch location weather")
        } finally {
          setLoadingLocation(false)
        }
      },
      () => {
        setMessage("Location permission denied")
        setLoadingLocation(false)
      }
    )
  }

  /* ⭐ Favorites */
  const addToFavorites = async () => {
    if (!weather) return
    try {
      setAdding(true)
      const res = await API.post("/favorites", { city: weather.name })
      onAddFavorite(res.data)
      setMessage("Added to favorites")
    } catch {
      setMessage("Already in favorites")
    } finally {
      setAdding(false)
    }
  }

  /* 🌫 AQI Label */
  const getAQIInfo = (aqi) => {
    const map = {
      1: ["Good", "text-green-600"],
      2: ["Fair", "text-yellow-500"],
      3: ["Moderate", "text-orange-500"],
      4: ["Poor", "text-red-500"],
      5: ["Very Poor", "text-purple-600"],
    }
    return map[aqi] || ["Unknown", "text-gray-500"]
  }

  /* 🚨 Health Alerts (SYNCED SAFELY) */
  useEffect(() => {
    if (!weather || aqi === null) return

    const temp = weather.main.temp
    const condition = weather.weather[0]?.main.toLowerCase()
    const newAlerts = []

    if (temp >= 38)
      newAlerts.push({ type: "danger", msg: "🌡 Heatwave: Avoid outdoors" })

    if (temp <= 5)
      newAlerts.push({ type: "warning", msg: "❄ Cold weather: Dress warm" })

    if (aqi >= 4)
      newAlerts.push({ type: "danger", msg: "🌫 Poor air quality: Wear mask" })

    if (condition.includes("rain"))
      newAlerts.push({ type: "info", msg: "🌧 Carry an umbrella" })

    if (condition.includes("thunder"))
      newAlerts.push({ type: "danger", msg: "⛈ Thunderstorm: Stay indoors" })

    setAlerts(newAlerts)
  }, [weather, aqi])

  /* 🔹 Favorite click */
  useEffect(() => {
    if (city) fetchWeather(city)
  }, [city])

  return (
    <div className={`${cardBg} p-8 rounded-xl shadow space-y-6`}>
      <h2 className="text-xl font-semibold text-center">Weather Search</h2>

      {/* Search */}
      <div className="flex gap-2">
        <input
          className={`flex-1 border rounded px-3 py-2 ${inputBg}`}
          placeholder="Enter city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button
          onClick={() => fetchWeather(searchCity)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={getLocationWeather}
          disabled={loadingLocation}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          📍 Location
        </button>
      </div>

      {/* 🕘 Recent Searches */}
{recentSearches.length > 0 && (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-sm font-semibold">
        Recent Searches
      </h4>

      <button
        onClick={clearSearchHistory}
        className="
          px-3 py-1
          text-sm font-medium
          text-red-500
          border border-red-400
          rounded
          hover:bg-red-50
          transition
        "
      >
        Clear
      </button>
    </div>

    <div className="flex flex-wrap gap-2">
      {recentSearches.map((item) => (
        <button
          key={item._id}
          onClick={() => fetchWeather(item.city)}
          className={`px-3 py-1 rounded text-sm ${chipBg}`}
        >
          {item.city}
        </button>
      ))}
    </div>
  </div>
)}

      {/* Alerts */}
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`px-4 py-2 rounded text-sm ${
            a.type === "danger"
              ? "bg-red-100 text-red-700"
              : a.type === "warning"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {a.msg}
        </div>
      ))}

      {/* Weather */}
      {weather && (
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold">{weather.name}</h3>
          <p className="text-4xl font-bold text-blue-600">
            {Math.round(weather.main.temp)}°C
          </p>
          {aqi !== null && (
            <p className={`text-sm ${getAQIInfo(aqi)[1]}`}>
              AQI: {getAQIInfo(aqi)[0]}
            </p>
          )}
          <p className="capitalize opacity-80">
            {weather.weather[0].description}
          </p>
          <button
            onClick={addToFavorites}
            disabled={adding}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            {adding ? "Adding..." : "Add to Favorites"}
          </button>
        </div>
      )}

      {/* Hourly */}
      {hourly.length > 0 && <HourlyChart data={hourly} />}

      {message && <p className="text-center text-sm">{message}</p>}
    </div>
  )
}

export default Weather
