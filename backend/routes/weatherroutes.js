import express from "express"
import {
  getWeather,
  getForecast,
  getAQI,
} from "../controllers/weathercontroller.js"
import { protect } from "../middleware/authmiddleware.js"

const router = express.Router()

router.get("/", protect, getWeather)
router.get("/forecast", protect, getForecast)
router.get("/aqi", getAQI)

export default router
