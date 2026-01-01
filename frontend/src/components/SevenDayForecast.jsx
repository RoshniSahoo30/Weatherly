import { useContext } from "react"
import { AuthContext } from "../context/authcontext"

const SevenDayForecast = ({ daily }) => {
  const { darkMode } = useContext(AuthContext)

  const cardBg = darkMode
    ? "bg-slate-800 text-white"
    : "bg-white text-gray-800"

  const borderColor = darkMode
    ? "border-slate-700"
    : "border-gray-200"

  return (
    <div className={`${cardBg} p-6 rounded-xl shadow`}>
      <h3 className="text-lg font-semibold mb-4">
        5-Day Forecast
      </h3>

      {!daily || daily.length === 0 && (
        <p className="text-sm opacity-70">
          Search a city to see forecast
        </p>
      )}

      <ul className="space-y-2 text-sm">
        {daily?.map((day, i) => (
          <li
            key={i}
            className={`flex justify-between items-center border-b ${borderColor} pb-2 last:border-none`}
          >
            <span>
              {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </span>
            <span className="font-medium">
              {Math.round(day.temp)}°C
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SevenDayForecast
