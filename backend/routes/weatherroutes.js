import express from "express"
import {
  getWeather,
  getForecast,
  getAQI,
  getDailyForecast,
} from "../controllers/weathercontroller.js"
import { protect } from "../middleware/authmiddleware.js"

const router = express.Router()

router.get("/", protect, getWeather)
router.get("/forecast", protect, getForecast)
router.get("/aqi", getAQI)
router.get("/daily", getDailyForecast)

export default router
