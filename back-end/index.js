import express from "express";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import menuRoutes from "./routes/menu.js";
//import orderRouter from "./routes/order.js";
//import paymentRouter from "./routes/payment.js";
//import feedbackRouter from "./routes/feedback.js";
import employeeRoutes from "./routes/employee.js";

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
// Use Menu Routes
app.use("/menu", menuRoutes);

// Use Order Routes
//app.use("/order", orderRoutes);
// Use Payment Routes
//app.use("/payment", paymentRoutes);
// Use Feedback Routes
//app.use("/feedback", feedbackRoutes);
app.use("/employee", employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
