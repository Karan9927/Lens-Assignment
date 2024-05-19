const User = require("../models/User");

const getUserProfile = (req, res) => {
  res.json(req.user);
};

module.exports = { getUserProfile };
