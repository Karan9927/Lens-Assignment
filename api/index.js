const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
require("dotenv").config();

const app = express();
const file = fs.readFileSync("../openapi.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(bodyParser.json());

// Helmet Middleware
app.use(helmet());

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
