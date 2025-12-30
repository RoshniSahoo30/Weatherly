import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedTheme = localStorage.getItem("theme")

    if (storedUser) setUser(JSON.parse(storedUser))
    if (storedTheme === "dark") setDarkMode(true)
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const login = (user, token) => {
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, darkMode, setDarkMode }}
    >
      {children}
    </AuthContext.Provider>
  )
}
