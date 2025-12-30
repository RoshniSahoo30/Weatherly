import { useContext } from "react"
import { AuthContext } from "../context/authcontext"

const SearchHistory = ({ history, onSelect, onClear }) => {
  const { darkMode } = useContext(AuthContext)
  if (history.length === 0) return null

  const cardBg = darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"

  return (
    <div className={`${cardBg} p-4 rounded-lg shadow`}>
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">Recent Searches</h3>
        <button
          onClick={onClear}
          className="px-2 py-1 border border-red-400 text-red-500 rounded text-sm"
        >
          Clear
        </button>
      </div>

      <ul className="space-y-2">
        {history.map((item) => (
          <li key={item._id}>
            <button onClick={() => onSelect(item.city)} className="hover:underline">
              {item.city}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SearchHistory
