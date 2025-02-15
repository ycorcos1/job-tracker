const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();
const pool = require("../config/db");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Users API is working" });
});

// **Signup Route**
router.post("/signup", async (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    if (!first_name || !last_name || !username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, username",
            [username, hashedPassword, first_name, last_name]
        );
        res.status(201).json({ message: "User created successfully", user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
});

// **Login Route**
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user.id, username: user.username, first_name: user.first_name } });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// **Authentication Check**
router.get("/auth", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ error: "Access Denied" });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: verified });
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
});

// **Change Password Route**
router.post("/change-password", async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }
        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Old password is incorrect" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await pool.query("UPDATE users SET password = $1 WHERE username = $2", [hashedNewPassword, username]);
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update password" });
    }
});

module.exports = router;
