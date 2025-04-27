const express = require("express");
const router = express.Router();
const { Store, Rating } = require("../models");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const sequelize = require("../config/db"); // for fn & col

// Apply auth + “storeowner” role middleware to all store routes
router.use(auth, role(["storeowner"]));

/**
 * GET /owner/dashboard
 * Store owner dashboard to manage their stores and view ratings
 */
router.get("/dashboard", async (req, res) => {
  try {
    // Fetch stores owned by the store owner
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      include: [{ model: Rating }],
    });

    const storeData = stores.map((store) => {
      const allRatings = store.Ratings.map((r) => r.rating);
      const avgRating =
        allRatings.length > 0
          ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
          : 0;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        avgRating,
      };
    });

    res.status(200).json(storeData);
  } catch (err) {
    console.error("GET /owner/dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /owner/store
 * Store owner creates or updates a store
 */
router.post("/store", async (req, res) => {
  const { id, name, address } = req.body;

  try {
    // Check if the store already exists and belongs to the current store owner
    let store;
    if (id) {
      // If an ID is provided, try to find the store and update it
      store = await Store.findOne({ where: { id, ownerId: req.user.id } });
      if (store) {
        store.name = name || store.name;
        store.address = address || store.address;
        await store.save();
        return res
          .status(200)
          .json({ message: "Store updated successfully", store });
      } else {
        return res
          .status(404)
          .json({ message: "Store not found or you're not the owner" });
      }
    }

    // If no ID is provided, create a new store
    store = await Store.create({
      name,
      address,
      ownerId: req.user.id,
    });

    res.status(201).json({ message: "Store created successfully", store });
  } catch (err) {
    console.error("POST /owner/store error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
