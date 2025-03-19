import express from "express";
import db from "../db.js"; // Import database connection

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
            // Redirect to dashboard with query parameter loggedIn=true
            //res.redirect(`/api/admin/dashboard?loggedIn=true`);
            res.status(200).json({ message: "Login successful, now go to /admin/dashboard to access the dashboard" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
});

// Admin Dashboard Route
router.get("/dashboard", (req, res) => {
    // Check if the loggedIn query parameter exists
    if (req.query.loggedIn) {
        res.json({ message: "Welcome to the Dashboard!" });
    } else {
        res.redirect("/login"); // Redirect to login if not logged in
    }
});

// Admin Logout Route
router.get("/logout", (req, res) => {
    res.redirect("/login"); // Redirect to login page
});

export default router;
