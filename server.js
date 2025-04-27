const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");

// 1. Load models so associations are registered
require("./models/User");
require("./models/Store");
require("./models/Rating");

dotenv.config(); // Load .env variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 2. Mount your auth routes (register/login)
app.use("/auth", require("./routes/auth"));

// 3. Mount your admin‐protected routes
app.use("/admin", require("./routes/adminRoutes"));

// 4. Mount Store‐Owner routes (dashboard)
app.use("/owner", require("./routes/ownerRoutes"));

// 6. Mount store & rating routes (Step 5)
app.use("/stores", require("./routes/storeRoutes"));
app.use("/ratings", require("./routes/ratingRoutes"));

// Sample public route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 7. Connect to Database, then sync all models (Step 3)
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully!");
    return sequelize.sync();
  })
  .then(() => {
    console.log("✅ All models were synchronized successfully!");
  })
  .catch((err) => {
    console.error("❌ Database connection or sync failed:", err);
  });

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  return res
    .status(500)
    .json({ message: "Something went wrong. Please try again later." });
});

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
