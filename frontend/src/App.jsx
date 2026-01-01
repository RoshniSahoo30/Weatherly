import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./context/authcontext"
import API from "./services/api"

import Register from "./components/register"
import Login from "./components/login"
import Weather from "./components/weather"
import Favorites from "./components/favorites"

const App = () => {
  const { user, logout, darkMode, setDarkMode } = useContext(AuthContext)

  const [selectedCity, setSelectedCity] = useState("")
  const [favorites, setFavorites] = useState([])
  const [dailyForecast, setDailyForecast] = useState([])
  

  const bg = darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-gray-900"
  const headerBg = darkMode ? "bg-slate-800" : "bg-white"


  /* Load favorites on login */
  useEffect(() => {
    if (user) loadFavorites()
    else {
      setFavorites([])
      //setDailyForecast([])
      setSelectedCity("")
    }
  }, [user])

  const loadFavorites = async () => {
    const res = await API.get("/favorites")
    setFavorites(res.data)
  }

  /* 📅 Fetch 7-day forecast */
const fetch7DayForecast = async (lat, lon) => {
  try {
    const res = await API.get(`/weather/daily?lat=${lat}&lon=${lon}`)
    console.log(res.data);
    setDailyForecast(res.data.daily.slice(0, 7))
  } catch (err) {
    setDailyForecast([])
  }
}

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* HEADER */}
      <header className={`${headerBg} border-b border-slate-200`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-2xl font-bold text-blue-600">
            🌦 Weatherly
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode((p) => !p)}
              className="px-3 py-1 border rounded"
            >
              {darkMode ? "🌞 Light" : "🌙 Dark"}
            </button>

            {user && (
              <>
                <span className="text-sm">{user.email}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {!user && (
          <div className="grid md:grid-cols-2 gap-6">
            <Register />
            <Login />
          </div>
        )}

        {user && (
          <div className="grid lg:grid-cols-[1fr_2fr_1fr] gap-8">
            {/* LEFT: 7-Day Forecast */}
            <section className={`rounded-xl shadow p-4 text-sm self-start ${
                darkMode
                  ? "bg-slate-800 text-gray-100"
                  : "bg-white text-gray-800"
              }`}>
              <h3 className="font-semibold mb-3">
                5-Day Forecast
              </h3>

              {dailyForecast.length === 0 && (
                <p className="text-gray-400">
                  Search a city to see forecast
                </p>
              )}

              {dailyForecast.map((day, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b pb-1 mb-1 last:border-none"
                >
                  <span>
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                  <span className="font-medium">
                    {Math.round(day.temp)}°C
                  </span>
                </div>
              ))}
            </section>

            {/* CENTER: Weather */}
            <section>
              <Weather
                city={selectedCity}
                onAddFavorite={(fav) =>
                  setFavorites((prev) => [...prev, fav])
                }
                onWeatherLoaded={(lat, lon) =>
                  fetch7DayForecast(lat, lon)
                }
              />
            </section>

            {/* RIGHT: Favorites */}
            <Favorites
              favorites={favorites}
              setFavorites={setFavorites}
              onCitySelect={(city) => setSelectedCity(city)}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
