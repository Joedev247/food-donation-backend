const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Donation = require("../models/Donation");
const { sanitizeUser } = require("../utils/sanitize");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, email, password, role, phone, organizationType, address } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required." });
    }

    if (!["donor", "ngo", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be donor or ngo." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      phone: phone?.trim(),
      organizationType: organizationType?.trim(),
      address: address?.trim(),
    });

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.role) {
      query.role = req.query.role;
    }
    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ users: users.map(sanitizeUser) });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "User ID is not valid." });
    }

    const updateFields = {};
    ["name", "email", "phone", "organizationType", "address"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
      }
    });

    if (updateFields.email) {
      updateFields.email = updateFields.email.toLowerCase();
      const existingUser = await User.findOne({ email: updateFields.email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(409).json({ message: "Email is already in use." });
      }
    }

    const user = await User.findByIdAndUpdate(id, updateFields, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "User ID is not valid." });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await Donation.deleteMany({ donorId: id });
    await Donation.updateMany({ ngoId: id }, { ngoId: null, status: "pending" });

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
