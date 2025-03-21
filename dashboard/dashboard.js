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

// Fetch Orders
document.getElementById("viewOrdersButton").addEventListener("click", () => {
    fetch("http://localhost:5000/order/fetch-all-orders")
        .then(response => response.json())
        .then(orders => {
            const ordersTableBody = document.getElementById("ordersTableBody");
            ordersTableBody.innerHTML = ""; // Clear previous data

            orders.forEach(order => {
                const formattedDate = new Date(order.order_date).toLocaleString("en-IN", { 
                    timeZone: "Asia/Kolkata", 
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit", second: "2-digit"
                });

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
            detailsTableBody.innerHTML = ""; // Clear previous details

            if (details.length > 0) {
                details.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price}</td>
                    `;
                    detailsTableBody.appendChild(row);
                });

                document.getElementById("paymentStatus").innerText = details[0].payment_status || "Not Available";
                document.getElementById("feedbackStars").innerText = details[0].feedback_stars || "Not Rated";
            } else {
                detailsTableBody.innerHTML = "<tr><td colspan='3'>No details available</td></tr>";
            }

            document.getElementById("orderDetailsContainer").style.display = "block";
        })
        .catch(error => console.error("Error fetching order details:", error));
}