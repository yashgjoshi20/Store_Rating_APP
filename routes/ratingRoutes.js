const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const Rating = require("../models/Rating");

// Submit new rating
router.post("/:storeId", auth, role(["user"]), async (req, res) => {
  const userId = req.user.id;
  const { storeId } = req.params;
  const { rating } = req.body;
  try {
    const [r, created] = await Rating.upsert(
      {
        userId,
        storeId,
        rating,
      },
      { returning: true }
    );
    res.json(r);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
