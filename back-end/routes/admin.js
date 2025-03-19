import express from "express";
import db from "../db.js"; // Import the database connection

const router = express.Router();

// Admin Login Route
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const sql = "SELECT * FROM ADMIN WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length > 0) {
            res.json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
});

export default router;
