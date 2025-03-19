import express from "express";
import db from "../db.js"; // Import database connection

const router = express.Router();

// 🟢 Add a menu item
router.post("/add", (req, res) => {
    const { name, description, price, menu_type, admin_id } = req.body;

    const sql = "INSERT INTO MENU (name, description, price, menu_type, admin_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, description, price, menu_type, admin_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to add menu item" });
        }
        res.status(201).json({ message: "Menu item added successfully", id: result.insertId });
    });
});

// 🔵 Get all menu items
router.get("/", (req, res) => {
    const sql = "SELECT * FROM MENU";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch menu" });
        }
        res.json(results);
    });
});

// 🟡 Update a menu item
router.put("/update/:id", (req, res) => {
    const { name, description, price, menu_type } = req.body;
    const { id } = req.params;

    const sql = "UPDATE MENU SET name=?, description=?, price=?, menu_type=? WHERE item_no=?";
    db.query(sql, [name, description, price, menu_type, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update menu item" });
        }
        res.json({ message: "Menu item updated successfully" });
    });
});

// 🔴 Delete a menu item
router.delete("/delete/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM MENU WHERE item_no=?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete menu item" });
        }
        res.json({ message: "Menu item deleted successfully" });
    });
});

export default router;
