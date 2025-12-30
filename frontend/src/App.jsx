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

  const bg = darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-gray-900"
  const headerBg = darkMode ? "bg-slate-800" : "bg-white"

  useEffect(() => {
    if (user) loadFavorites()
  }, [user])

  const loadFavorites = async () => {
    const res = await API.get("/favorites")
    setFavorites(res.data)
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
            {/* 🌙 TOGGLE */}
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
          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2">
              <Weather
                city={selectedCity}
                onAddFavorite={(fav) =>
                  setFavorites((prev) => [...prev, fav])
                }
              />
            </section>

            <Favorites
              favorites={favorites}
              setFavorites={setFavorites}
              onCitySelect={setSelectedCity}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
