module.exports = (roles) => {
  return (req, res, next) => {
    const { role } = req.user; // assuming JWT payload contains the role
    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
