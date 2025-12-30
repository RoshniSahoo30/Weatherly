import { useContext } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { AuthContext } from "../context/authcontext"

const HourlyChart = ({ data }) => {
  const { darkMode } = useContext(AuthContext)

  const strokeColor = darkMode ? "#93c5fd" : "#2563eb"

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="time" stroke={darkMode ? "#fff" : "#000"} />
        <YAxis unit="°C" stroke={darkMode ? "#fff" : "#000"} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="temp"
          stroke={strokeColor}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default HourlyChart
