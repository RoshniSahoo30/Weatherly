import { useState, useContext } from "react"
import API from "../services/api"
import { AuthContext } from "../context/authcontext"

const Login = () => {
  const { login, darkMode } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const cardBg = darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await API.post("/auth/login", { email, password })
      login(res.data.user, res.data.token)
    } catch {
      setError("Invalid credentials")
    }
  }

  return (
    <div className={`${cardBg} p-6 rounded-lg shadow space-y-4`}>
      <h2 className="text-xl font-semibold text-center">Login</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border rounded px-3 py-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Login
      </button>
    </div>
  )
}

export default Login
