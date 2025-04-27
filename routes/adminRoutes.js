// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { User, Store, Rating } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/db");

// Protect every admin route
router.use(auth, role(["admin"]));

/**
 * GET /admin/dashboard
 * Total counts of users, stores, ratings
 */
router.get("/dashboard", async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /admin/users
 * Create a new user (admin or normal or storeowner)
 */
router.post("/users", async (req, res) => {
  try {
    const { username, email, address, password, role: newRole } = req.body;
    // Simple validation
    if (!username || !email || !password || !newRole) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Delegate to your existing registration logic (hashing, etc.)
    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      address,
      password: hashed,
      role: newRole,
    });
    res.status(201).json({
      message: "User created",
      user: { id: user.id, username, email, address, role: newRole },
    });
  } catch (err) {
    console.error("POST /admin/users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /admin/users
 * List users with optional filters: username, email, address, role
 */
router.get("/users", async (req, res) => {
  try {
    const { username, email, address, role: roleFilter } = req.query;
    const where = {};
    if (username) where.username = { [Op.iLike]: `%${username}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (roleFilter) where.role = roleFilter;

    const users = await User.findAll({
      where,
      attributes: ["id", "username", "email", "address", "role"],
      order: [["username", "ASC"]],
    });
    res.json(users);
  } catch (err) {
    console.error("GET /admin/users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /admin/users/:id
 * Get a single user's details; if they're a storeowner, include their avg store rating
 */
router.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: ["id", "username", "email", "address", "role"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const result = user.toJSON();

    // If storeowner, calculate their average store rating
    if (user.role === "storeowner") {
      const stores = await Store.findAll({ where: { ownerId: user.id } });
      const ratings = await Rating.findAll({
        where: { storeId: stores.map((s) => s.id) },
      });
      const avgRating = ratings.length
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;
      result.avgStoreRating = avgRating;
    }

    res.json(result);
  } catch (err) {
    console.error("GET /admin/users/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /admin/stores
 * List stores with optional filters and avgRating
 */
router.get("/stores", async (req, res) => {
  try {
    const { name, email, address } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      attributes: [
        "id",
        "name",
        "email",
        "address",
        [sequelize.fn("AVG", sequelize.col("Ratings.rating")), "avgRating"],
      ],
      include: [{ model: Rating, attributes: [] }],
      group: ["Store.id"],
      order: [["name", "ASC"]],
    });
    res.json(stores);
  } catch (err) {
    console.error("GET /admin/stores error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
