const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sanitizeUser } = require("../utils/sanitize");

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "change_me_to_secure_secret";

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, jwtSecret, {
      expiresIn: "7d",
    });

    res.json({ user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
