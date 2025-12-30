import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"

//Register
export const register = async (req, res) => {
  try {
    const { email, password } = req.body

    //Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    //Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" })
    }

    //Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    //Create user
    const user = await User.create({
      email,
      password: hashedPassword
    })

    //Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    //Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email
      }
    })

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    //Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    //Check user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    //Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    //Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email
      }
    })

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
