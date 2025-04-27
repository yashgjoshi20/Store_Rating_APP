const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers["authorization"];
  console.log("❗️Auth header received:", header);

  if (!header) {
    return res.status(403).json({ message: "No token provided" });
  }

  const parts = header.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Malformed authorization header" });
  }

  const [scheme, token] = parts;
  if (scheme !== "Bearer") {
    return res.status(401).json({ message: "Malformed authorization header" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❗️JWT verify error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
