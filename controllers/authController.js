const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user);
    res.json({ message: "Registration successful!", token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");
    const token = generateToken(user);
    res.json({ "User Token": token, message: "Login Successful!" });
  } catch (error) {
    if (error.message === "Invalid email or password") {
      res.status(401).json({ error: error.message }); // Return status code 401 for invalid credentials
    } else {
      res.status(500).json({ error: "Login error" }); // Return status code 500 for other login failures
    }
  }
};

const logout = (req, res) => {
  res.json({ message: "Logout successful" });
};

const getUserProfile = (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, logout, getUserProfile };
