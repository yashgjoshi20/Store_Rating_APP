const express = require("express");
const router = express.Router();
const { Store, Rating } = require("../models");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const sequelize = require("../config/db"); // for sequelize functions and operators

// Admin: add new store
router.post("/", auth, role(["admin"]), async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  try {
    const store = await Store.create({ name, email, address, ownerId });
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// User: list all stores with their overall rating and their own rating (if any)
router.get(
  "/",
  auth,
  role(["user", "admin", "storeowner"]),
  async (req, res) => {
    try {
      const { name, address } = req.query;
      const where = {};
      if (name) where.name = { [sequelize.Op.iLike]: `%${name}%` };
      if (address) where.address = { [sequelize.Op.iLike]: `%${address}%` };

      // Fetch stores, include all their ratings
      const stores = await Store.findAll({
        where,
        include: [{ model: Rating }],
      });

      const result = stores.map((store) => {
        const allRatings = store.Ratings.map((r) => r.rating);
        const avgRating =
          allRatings.length > 0
            ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
            : 0;

        // Find this user’s rating if it exists
        const myRating = store.Ratings.find((r) => r.userId === req.user.id);
        return {
          id: store.id,
          name: store.name,
          address: store.address,
          avgRating,
          myRating: myRating ? myRating.rating : null,
        };
      });

      res.json(result);
    } catch (err) {
      console.error("GET /stores error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// User: Submit or update a rating (1–5) for store :id
router.post(
  "/:id/rate",
  auth,
  role(["user", "admin", "storeowner"]),
  async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    try {
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }

      // Check if the store exists
      const store = await Store.findByPk(id);
      if (!store) return res.status(404).json({ message: "Store not found" });

      // Upsert rating (if the user already rated, update it)
      const [r] = await Rating.upsert({
        userId: req.user.id,
        storeId: id,
        rating,
      });

      res.json({ message: "Rating submitted successfully", rating: r.rating });
    } catch (err) {
      console.error("POST /stores/:id/rate error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
