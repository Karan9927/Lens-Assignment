const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Helmet Middleware
app.use(helmet());

// Middleware
app.use(bodyParser.json());

// Routes
const userRoutes = require("../routes/userRoutes");
app.use("/api/users", userRoutes);

// Invalid Routes
app.use("*", (req, res) => {
  res.json({
    message: "Invalid API Request !",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});