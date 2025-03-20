const API_URL = "http://localhost:5000/employee"; // Change based on your backend

// Fetch and Display Employees
async function fetchEmployees() {
    const response = await fetch(API_URL);
    const employees = await response.json();
    const tableBody = document.getElementById("employeeTable");

    tableBody.innerHTML = ""; // Clear table before inserting new rows

    employees.forEach(emp => {
        tableBody.innerHTML += `
            <tr>
                <td>${emp.employee_id}</td>
                <td>${emp.name}</td>
                <td>${emp.phone}</td>
                <td>${emp.address || "N/A"}</td>
                <td>${emp.role}</td>
                <td>
                    <button onclick="editEmployee(${emp.employee_id}, '${emp.name}', '${emp.phone}', '${emp.address}', '${emp.role}')">Edit</button>
                    <button onclick="deleteEmployee(${emp.employee_id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Add or Update Employee
document.getElementById("employeeForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("employeeId").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const role = document.getElementById("role").value;

    const employeeData = { name, phone, address, role, admin_id: 1 }; // admin_id should be dynamic

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/update/${id}` : `${API_URL}/add`;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData)
    });

    document.getElementById("employeeForm").reset();
    document.getElementById("employeeId").value = ""; // Clear hidden field
    fetchEmployees();
});

// Edit Employee (Prefill Form)
function editEmployee(id, name, phone, address, role) {
    document.getElementById("employeeId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("phone").value = phone;
    document.getElementById("address").value = address;
    document.getElementById("role").value = role;
}

// Delete Employee
async function deleteEmployee(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
        await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
        fetchEmployees();
    }
}

// Load employees when page loads
fetchEmployees();
