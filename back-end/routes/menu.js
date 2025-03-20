import express from "express";
import db from "../db.js"; // Import database connection

const router = express.Router();

// 🟢 Add a menu item with optional tags
router.post("/add", (req, res) => {
    const { name, description, price, menu_type, tags } = req.body;
    const admin_id = 1; // Assume admin_id is set (can be dynamic)
    // Step 1: Insert the menu item
    const sql = "INSERT INTO MENU (name, description, price, menu_type, admin_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, description, price, menu_type, admin_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to add menu item" });
        }

        const itemId = result.insertId;

        // Step 2: If tags are provided, insert them into MENU_TAGS
        if (tags && tags.length > 0) {
            const tagSql = "INSERT INTO MENU_TAGS (item_no, tag) VALUES ?";
            const tagValues = tags.map(tag => [itemId, tag]);

            db.query(tagSql, [tagValues], (err) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to add tags" });
                }
                res.status(201).json({ message: "Menu item and tags added successfully", itemId });
            });
        } else {
            res.status(201).json({ message: "Menu item added successfully", itemId });
        }
    });
});

// 🔵 Get all menu items with tags
router.get("/", (req, res) => {
    const sql = `
        SELECT MENU.item_no, MENU.name, MENU.description, MENU.price, MENU.menu_type, GROUP_CONCAT(MENU_TAGS.tag) AS tags
        FROM MENU
        LEFT JOIN MENU_TAGS ON MENU.item_no = MENU_TAGS.item_no
        GROUP BY MENU.item_no;
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch menu items with tags" });
        }
        res.json(results);
    });
});

// 🟡 Update a menu item with optional tags
router.put("/update/:id", (req, res) => {
    const { name, description, price, menu_type, tags } = req.body;
    const { id } = req.params;

    // Step 1: Update the menu item itself
    const sql = "UPDATE MENU SET name=?, description=?, price=?, menu_type=? WHERE item_no=?";
    db.query(sql, [name, description, price, menu_type, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update menu item" });
        }

        // Step 2: Remove existing tags for this menu item (optional)
        const deleteTagsSql = "DELETE FROM MENU_TAGS WHERE item_no=?";
        db.query(deleteTagsSql, [id], (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to delete old tags" });
            }

            // Step 3: Add new tags if provided
            if (tags && tags.length > 0) {
                const tagSql = "INSERT INTO MENU_TAGS (item_no, tag) VALUES ?";
                const tagValues = tags.map(tag => [id, tag]);

                db.query(tagSql, [tagValues], (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Failed to add new tags" });
                    }
                    res.json({ message: "Menu item and tags updated successfully" });
                });
            } else {
                res.json({ message: "Menu item updated successfully" });
            }
        });
    });
});

// 🔴 Delete a menu item and its tags (cascade delete for tags)
router.delete("/delete/:id", (req, res) => {
    const { id } = req.params;

    // Step 1: Delete the menu item (tags will be deleted automatically due to ON DELETE CASCADE)
    const sql = "DELETE FROM MENU WHERE item_no=?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete menu item" });
        }
        res.json({ message: "Menu item and associated tags deleted successfully" });
    });
});

export default router;
