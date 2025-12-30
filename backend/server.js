import express from "express"
import dotenv from "dotenv"
import cors from "cors"
//const express = require("express")

import { connectDB } from "./config/db.js"

// ROUTES
import authRoutes from "./routes/authroutes.js"
import weatherRoutes from "./routes/weatherroutes.js"
import favoriteRoutes from "./routes/favroutes.js"
import historyRoutes from "./routes/history.js"

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://weatherly-ochre-ten.vercel.app"
    ],
    credentials: true,
  })
)
app.use(express.json())

// ---------- ROUTES ----------

app.use("/api/auth", authRoutes)
app.use("/api/weather", weatherRoutes)
app.use("/api/favorites", favoriteRoutes)
app.use("/api/history", historyRoutes)

// ---------- HEALTH CHECK ----------
app.get("/health", (req, res) => {
  res.json({ status: "OK" })
})

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
