const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

const authRoutes = require("./routes/auth");
app.use("/api/users", authRoutes);
const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);

// Signup route
app.post("/api/signup", async (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    if (!first_name || !last_name || !username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING id, username",
            [first_name, last_name, username, hashedPassword]
        );
        res.status(201).json({ message: "User created successfully", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Signup failed" });
    }
});

// Login route
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }
        const user = result.rows[0]; 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user.id, username: user.username, first_name: user.first_name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
