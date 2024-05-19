const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authentication failed: Missing or invalid token");
    }
    const token = authHeader.replace("Bearer ", "");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error("Authentication failed: Invalid token");
    }
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { authenticateUser };
