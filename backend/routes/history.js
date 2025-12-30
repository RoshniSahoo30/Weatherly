import express from "express"
import { protect } from "../middleware/authmiddleware.js"
import SearchHistory from "../models/searchhistory.js"

const router = express.Router()

// ✅ Get search history (per user)
router.get("/", protect, async (req, res) => {
  try {
    const history = await SearchHistory.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(10)

    res.json(history)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" })
  }
})

// Clear all search history for logged-in user
router.delete("/", protect, async (req, res) => {
  try {
    await SearchHistory.deleteMany({ user: req.user.id })
    res.json({ message: "Search history cleared" })
  } catch (err) {
    res.status(500).json({ message: "Failed to clear history" })
  }
})

// ✅ Save search history
// Save search history (deduplicated)
router.post("/", protect, async (req, res) => {
  try {
    const { city } = req.body
    if (!city) {
      return res.status(400).json({ message: "City required" })
    }

    // 🔥 Remove existing entry for same city + user
    await SearchHistory.deleteMany({
      user: req.user.id,
      city,
    })

    // 🔥 Add fresh entry at top
    const entry = await SearchHistory.create({
      user: req.user.id,
      city,
    })

    res.json(entry)
  } catch (err) {
    res.status(500).json({ message: "Failed to save history" })
  }
})


export default router
