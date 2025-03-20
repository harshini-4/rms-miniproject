
// Function to fetch menu items from the API
async function fetchMenuItems() {
    try {
        const response = await fetch("http://localhost:5000/menu/"); // Replace with your actual API URL
        const data = await response.json();

        const menuItemsContainer = document.getElementById("menu-items");
        menuItemsContainer.innerHTML = ''; // Clear previous menu items

        data.forEach(item => {
            // Create a new menu item div
            const menuItemDiv = document.createElement("div");
            menuItemDiv.classList.add("menu-item");

            // Create the content for each menu item
            menuItemDiv.innerHTML = `
                        <div class="menu-details">
                            <span class="item-name">${item.name}</span>
                            <span class="item-description">${item.description}</span>
                            <span class="item-price">$${item.price}</span>
                            <span class="item-tags">${item.tags ? item.tags : ''}</span> <!-- Empty if no tags -->
                        </div>
                        <div class="quantity">
                            <button onclick="decreaseQuantity('${item.item_no}')">-</button>
                            <span id="${item.item_no}-qty">0</span>
                            <button onclick="increaseQuantity('${item.item_no}')">+</button>
                        </div>
                    `;

            // Append the menu item div to the container
            menuItemsContainer.appendChild(menuItemDiv);
        });
    } catch (error) {
        console.error("Failed to fetch menu items:", error);
    }
}

// Function to increase quantity
function increaseQuantity(itemNo) {
    let qtyElement = document.getElementById(itemNo + "-qty");
    let currentQty = parseInt(qtyElement.textContent);
    qtyElement.textContent = currentQty + 1;
}

// Function to decrease quantity
function decreaseQuantity(itemNo) {
    let qtyElement = document.getElementById(itemNo + "-qty");
    let currentQty = parseInt(qtyElement.textContent);
    if (currentQty > 0) {
        qtyElement.textContent = currentQty - 1;
    }
}

// Function to handle proceeding to the next step (e.g., checkout)
function proceedToOrder() {
    const items = document.querySelectorAll(".menu-item");
    const orderDetails = [];

    items.forEach(item => {
        const itemName = item.querySelector(".item-name").textContent;
        const itemNo = item.querySelector(".quantity button").onclick.toString().match(/'(\d+)'/)[1];
        const quantity = parseInt(document.getElementById(`${itemNo}-qty`).textContent);

        if (quantity > 0) {
            orderDetails.push({ itemNo, itemName, quantity });
        }
    });

    if (orderDetails.length > 0) {
        console.log("Proceeding with order:", orderDetails);
        // Send orderDetails to the backend for processing
        // For example:
        // await fetch("/api/order", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(orderDetails),
        // });
    } else {
        alert("Please select at least one item.");
    }
}

// Fetch the menu items when the page loads
fetchMenuItems();
