import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const protect = async (req, res, next) => {
  try {
    let token

    // 1. Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }

    // 2. If no token
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" })
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. Get user from DB (exclude password)
    req.user = await User.findById(decoded.userId).select("-password")

    if (!req.user) {
      return res.status(401).json({ message: "User not found" })
    }

    // 5. Proceed to next middleware / controller
    next()

  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" })
  }
}
