import express from "express";
import db from "../db.js"; // Import MySQL database connection

const router = express.Router();

// 💰 Handle Payment Processing
router.post("/", async (req, res) => {
    try {
        const { order_no, payment_method, upi_id } = req.body;

        if (!order_no || !payment_method) {
            return res.status(400).json({ error: "Order number and payment method are required" });
        }

        // If payment method is UPI, UPI ID is required
        if (payment_method === "UPI" && (!upi_id || upi_id.trim() === "")) {
            return res.status(400).json({ error: "UPI ID is required for UPI payment" });
        }

        let payment_status = "Success"; // Always successful for simulation

        const insertQuery = `
            INSERT INTO PAYMENT (order_no, payment_method, upi_id, payment_status)
            VALUES (?, ?, ?, ?)
        `;

        db.query(insertQuery, [order_no, payment_method, upi_id || null, payment_status], (err) => {
            if (err) {
                console.error("Payment Error:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            // Fetch payment time after insertion
            const selectQuery = `SELECT payment_time FROM PAYMENT WHERE order_no = ?`;

            db.query(selectQuery, [order_no], (err, results) => {
                if (err) {
                    console.error("Error fetching payment time:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                let formattedTime = null;
                if (results.length > 0 && results[0].payment_time) {
                    const paymentDate = new Date(results[0].payment_time);
                    formattedTime = paymentDate.toLocaleString("en-US", {
                        timeZone: "Asia/Kolkata", // Convert to IST (or remove this if you want UTC)
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    });
                }

                res.json({
                    message: "Payment successful",
                    order_no,
                    payment_method,
                    payment_status,
                    payment_time: formattedTime // Send formatted time
                });
            });
        });
    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
