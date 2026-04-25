const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    foodType: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true, trim: true },
    pickupLocation: { type: String, required: true, trim: true },
    availability: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    status: { type: String, required: true, enum: ["pending", "accepted", "collected", "completed", "cancelled"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Donation", donationSchema);
