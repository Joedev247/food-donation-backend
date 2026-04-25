const express = require("express");
const Donation = require("../models/Donation");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { userId, role } = req.query;
    if (!userId || !role) {
      return res.status(400).json({ message: "userId and role are required." });
    }

    const allowedRoles = ["donor", "ngo", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "role must be donor, ngo, or admin." });
    }

    const response = {
      totalDonations: 0,
      pendingDonations: 0,
      acceptedDonations: 0,
      completedDonations: 0,
    };

    if (role === "donor") {
      response.totalDonations = await Donation.countDocuments({ donorId: userId });
      response.pendingDonations = await Donation.countDocuments({ donorId: userId, status: "pending" });
      response.acceptedDonations = await Donation.countDocuments({ donorId: userId, status: "accepted" });
      response.completedDonations = await Donation.countDocuments({ donorId: userId, status: "completed" });
    } else if (role === "ngo") {
      response.pendingDonations = await Donation.countDocuments({ status: "pending" });
      response.acceptedDonations = await Donation.countDocuments({ ngoId: userId, status: "accepted" });
      response.completedDonations = await Donation.countDocuments({ ngoId: userId, status: "completed" });
      response.totalDonations = response.pendingDonations + response.acceptedDonations + response.completedDonations;
    } else if (role === "admin") {
      response.totalDonations = await Donation.countDocuments();
      response.pendingDonations = await Donation.countDocuments({ status: "pending" });
      response.acceptedDonations = await Donation.countDocuments({ status: "accepted" });
      response.completedDonations = await Donation.countDocuments({ status: "completed" });
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
