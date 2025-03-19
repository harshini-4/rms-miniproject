import express from "express";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import menuRoutes from "./routes/menu.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse form data (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON data
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
    res.send("Restaurant Management System Backend is running");
});

// Use Admin Routes
app.use("/admin", adminRoutes);
app.use("/menu", menuRoutes);
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
