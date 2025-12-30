import { useContext } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "../utils/leafletIcon.js"
import { AuthContext } from "../context/authcontext"

const WeatherMap = ({ lat, lon, city, temp }) => {
  const { darkMode } = useContext(AuthContext)
  if (!lat || !lon) return null

  const tileUrl = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  return (
    <div className="h-72 w-full rounded-lg overflow-hidden shadow">
      <MapContainer center={[lat, lon]} zoom={10} className="h-full w-full">
        <TileLayer url={tileUrl} />
        <Marker position={[lat, lon]}>
          <Popup>
            <strong>{city}</strong>
            <br />
            🌡 {temp}°C
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default WeatherMap
