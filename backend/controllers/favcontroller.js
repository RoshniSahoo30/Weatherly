import FavoriteCity from "../models/favcity.js"

// ADD FAVORITE
export const addFavorite = async (req, res) => {
  try {
    const { city } = req.body
    if (!city) {
      return res.status(400).json({ message: "City is required" })
    }

    const exists = await FavoriteCity.findOne({
      user: req.user._id,
      city,
    })

    if (exists) {
      return res.status(409).json({ message: "Already added" })
    }

    const favorite = await FavoriteCity.create({
      user: req.user._id,
      city,
    })

    // ✅ SEND FAVORITE DIRECTLY
    res.status(201).json(favorite)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET FAVORITES
export const getFavorites = async (req, res) => {
  try {
    const favorites = await FavoriteCity.find({
      user: req.user._id,
    }).sort({ createdAt: -1 })

    res.json(favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// REMOVE FAVORITE
export const removeFavorite = async (req, res) => {
  await FavoriteCity.deleteOne({
    _id: req.params.id,
    user: req.user._id,
  })
  res.json({ message: "Removed" })
}
