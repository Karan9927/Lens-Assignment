const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authMiddleware.authenticateUser, authController.logout);
router.get(
  "/profile",
  authMiddleware.authenticateUser,
  authController.getUserProfile
);

module.exports = router;
