import express from "express"
import { protect } from "../middleware/authmiddleware.js"
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favcontroller.js"

const router = express.Router()

router.get("/", protect, getFavorites)
router.post("/", protect, addFavorite)
router.delete("/:id", protect, removeFavorite)

export default router
