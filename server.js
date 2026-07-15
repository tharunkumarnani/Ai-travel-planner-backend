// Node/Express API Gateway Entrypoint
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require(
  "./config/db"
);

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message:
      "AI Travel Planner API Running"
  });
});

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/trips",
  require("./routes/tripRoutes")
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});