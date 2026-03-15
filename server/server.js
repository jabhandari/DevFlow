const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://devflow-juhi.vercel.app",
  "https://dev-flow-6yb1zaw56-juhis-projects-3a794e1f.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/entries", require("./routes/entryRoutes"));

// test route
app.get("/", (req, res) => {
  res.json({ message: "DevFlow API running 🚀" });
});

// ✅ define PORT BEFORE using it
const PORT = process.env.PORT || 5000;

// connect DB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use("/entries", require("./routes/entryRoutes"));
