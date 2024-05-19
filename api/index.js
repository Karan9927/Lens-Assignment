const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../openapi.json");
require("dotenv").config();

const app = express();

app.use(
  "/api-docs",
  (req, res, next) => {
    req.swaggerDoc = swaggerDocument;
    const url = req.url;
    if (url.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css");
    } else if (url.endsWith(".js")) {
      res.setHeader("Content-Type", "text/javascript");
    }
    next();
  },
  swaggerUi.serveFiles(),
  swaggerUi.setup()
);

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

// Swagger UI
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
