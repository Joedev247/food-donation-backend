const express = require("express");
const mongoose = require("mongoose");
const Donation = require("../models/Donation");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.donorId) {
      query.donorId = req.query.donorId;
    }
    if (req.query.ngoId) {
      query.ngoId = req.query.ngoId;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    const donations = await Donation.find(query).sort({ createdAt: -1 });
    res.json({ donations: donations.map((donation) => ({
      id: donation._id.toString(),
      donorId: donation.donorId.toString(),
      ngoId: donation.ngoId?.toString() || undefined,
      foodType: donation.foodType,
      quantity: donation.quantity,
      unit: donation.unit,
      pickupLocation: donation.pickupLocation,
      availability: donation.availability,
      notes: donation.notes,
      status: donation.status,
      createdAt: donation.createdAt.toISOString(),
    })) });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { donorId, foodType, quantity, unit, pickupLocation, availability, notes } = req.body;
    if (!donorId || !foodType || !quantity || !unit || !pickupLocation || !availability) {
      return res.status(400).json({ message: "All donation fields are required except notes." });
    }

    if (!mongoose.Types.ObjectId.isValid(donorId)) {
      return res.status(400).json({ message: "donorId is not valid." });
    }

    const donation = await Donation.create({
      donorId,
      foodType: foodType.trim(),
      quantity: Number(quantity),
      unit: unit.trim(),
      pickupLocation: pickupLocation.trim(),
      availability: availability.trim(),
      notes: notes?.trim(),
      status: "pending",
    });

    res.status(201).json({ donation: {
      id: donation._id.toString(),
      donorId: donation.donorId.toString(),
      ngoId: donation.ngoId?.toString(),
      foodType: donation.foodType,
      quantity: donation.quantity,
      unit: donation.unit,
      pickupLocation: donation.pickupLocation,
      availability: donation.availability,
      notes: donation.notes,
      status: donation.status,
      createdAt: donation.createdAt.toISOString(),
    } });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Donation ID is not valid." });
    }

    const allowedUpdates = ["foodType", "quantity", "unit", "pickupLocation", "availability", "notes", "status", "ngoId"];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.foodType) updates.foodType = updates.foodType.trim();
    if (updates.unit) updates.unit = updates.unit.trim();
    if (updates.pickupLocation) updates.pickupLocation = updates.pickupLocation.trim();
    if (updates.availability) updates.availability = updates.availability.trim();
    if (updates.notes !== undefined) updates.notes = updates.notes?.trim();
    if (updates.ngoId && !mongoose.Types.ObjectId.isValid(updates.ngoId)) {
      return res.status(400).json({ message: "ngoId is not valid." });
    }

    const donation = await Donation.findByIdAndUpdate(id, updates, { new: true });
    if (!donation) {
      return res.status(404).json({ message: "Donation not found." });
    }

    res.json({ donation: {
      id: donation._id.toString(),
      donorId: donation.donorId.toString(),
      ngoId: donation.ngoId?.toString(),
      foodType: donation.foodType,
      quantity: donation.quantity,
      unit: donation.unit,
      pickupLocation: donation.pickupLocation,
      availability: donation.availability,
      notes: donation.notes,
      status: donation.status,
      createdAt: donation.createdAt.toISOString(),
    } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Donation ID is not valid." });
    }

    const donation = await Donation.findByIdAndDelete(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found." });
    }

    res.json({ message: "Donation deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
