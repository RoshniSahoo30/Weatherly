import { useContext } from "react"
import API from "../services/api"
import { AuthContext } from "../context/authcontext"

const Favorites = ({ favorites, setFavorites, onCitySelect }) => {
  const { darkMode } = useContext(AuthContext)

  const cardBg = darkMode
    ? "bg-slate-800 text-white"
    : "bg-white text-gray-800"

  const hoverBg = darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"

  const removeFavorite = async (id) => {
    try {
      await API.delete(`/favorites/${id}`)
      setFavorites((prev) => prev.filter((fav) => fav._id !== id))
    } catch {}
  }

  return (
    <div className={`${cardBg} p-6 rounded-xl shadow`}>
      <h3 className="text-lg font-semibold mb-4">
        Favorite Cities
      </h3>

      {favorites.length === 0 && (
        <p className="text-sm opacity-70">No favorites yet</p>
      )}

      <ul className="space-y-2">
        {favorites.map((fav) => (
          <li
            key={fav._id}
            className={`group flex justify-between items-center px-3 py-2 rounded ${hoverBg} transition`}
          >
            <button
              onClick={() => onCitySelect(fav.city)}
              className="hover:underline text-left"
            >
              {fav.city}
            </button>

            <button
              onClick={() => removeFavorite(fav._id)}
              className="opacity-0 group-hover:opacity-100 text-red-500 transition"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Favorites
