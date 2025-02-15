const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./config/db");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

const authRoutes = require("./routes/auth");
app.use("/api/users", authRoutes);
const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
