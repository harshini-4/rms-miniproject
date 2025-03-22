// Redirect if not logged in
if (localStorage.getItem("adminLoggedIn") !== "true") {
    alert("Unauthorized! Please log in first.");
    window.location.href = "../login/login.html";
}

// Logout function
document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "../login/login.html";
});

// Format Date/Time (For MySQL DATETIME)
function formatDateTime(dateTime) {
    if (!dateTime) return "Not Available"; // Handle null values

    return new Date(dateTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
}

// Fetch Orders
document.getElementById("viewOrdersButton").addEventListener("click", () => {
    fetch("http://localhost:5000/order/fetch-all-orders")
        .then(response => response.json())
        .then(orders => {
            const ordersTableBody = document.getElementById("ordersTableBody");
            ordersTableBody.innerHTML = ""; // Clear previous data

            orders.forEach(order => {
                const formattedDate = formatDateTime(order.order_date); // ✅ Format date

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${order.order_no}</td>
                    <td>${order.order_type}</td>
                    <td>Rs${order.total_amount}</td>
                    <td>${formattedDate}</td>
                    <td>${order.order_status}</td>
                    <td><button onclick="viewOrderDetails(${order.order_no})">View Details</button></td>
                `;

                ordersTableBody.appendChild(row);
            });

            document.getElementById("ordersContainer").style.display = "block";
        })
        .catch(error => console.error("Error fetching orders:", error));
});

// Fetch Order Details
function viewOrderDetails(orderId) {
    fetch(`http://localhost:5000/order/fetch-order-details/${orderId}`)
        .then(response => response.json())
        .then(details => {
            const detailsTableBody = document.getElementById("orderDetailsTableBody");
            const paymentTableBody = document.getElementById("paymentDetailsTableBody");
            const extraChargeMessage = document.getElementById("extraChargeMessage");

            detailsTableBody.innerHTML = ""; // Clear previous order items
            paymentTableBody.innerHTML = ""; // Clear previous payment details
            extraChargeMessage.innerHTML = ""; // Clear previous extra charge message

            let orderType = "";

            if (details.length > 0) {
                // Populate Order Items Table
                details.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>Rs ${item.price}</td>
                    `;
                    detailsTableBody.appendChild(row);

                    orderType = item.order_type; // Get order type (Dine-in or Takeaway)
                });

                // Show Extra Charge Message if Takeaway
                if (orderType === "Takeaway") {
                    extraChargeMessage.innerHTML = `<p style="color: red;"><strong>Extra Charges: Rs 15 for Takeaway</strong></p>`;
                }

                // Populate Payment Details Table (Only once per order)
                const paymentRow = document.createElement("tr");
                paymentRow.innerHTML = `
                    <td>${details[0].payment_id || "Not Available"}</td>
                    <td>${details[0].payment_method || "Not Available"}</td>
                    <td>${details[0].payment_method === "UPI" ? (details[0].upi_id || "Not Available") : "-"}</td>
                    <td>${formatDateTime(details[0].payment_time)}</td>
                    <td>${details[0].payment_status || "Not Available"}</td>
                `;
                paymentTableBody.appendChild(paymentRow);

                // Update feedback stars
                document.getElementById("feedbackStars").innerText = details[0].feedback_stars || "Not Rated";
            } else {
                detailsTableBody.innerHTML = "<tr><td colspan='3'>No details available</td></tr>";
                paymentTableBody.innerHTML = "<tr><td colspan='5'>No payment details available</td></tr>";
            }

            document.getElementById("orderDetailsContainer").style.display = "block";
        })
        .catch(error => console.error("Error fetching order details:", error));
}

// Fetch Today's Revenue & Completed Orders
document.getElementById("viewRevenueButton").addEventListener("click", () => {
    fetch("http://localhost:5000/order/daily-revenue")
        .then(response => response.json())
        .then(data => {
            document.getElementById("todayRevenue").innerText = `Rs ${data.todayRevenue}`;

            const revenueOrdersTableBody = document.getElementById("revenueOrdersTableBody");
            revenueOrdersTableBody.innerHTML = ""; // Clear previous data

            data.completedOrders.forEach(order => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${order.order_no}</td>
                    <td>${order.order_type}</td>
                    <td>Rs ${order.total_amount}</td>
                    <td>${formatDateTime(order.order_date)}</td>
                `;
                revenueOrdersTableBody.appendChild(row);
            });

            document.getElementById("revenueContainer").style.display = "block";
        })
        .catch(error => console.error("Error fetching daily revenue:", error));
});
