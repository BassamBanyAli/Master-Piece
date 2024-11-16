async function get() {
    const url = `https://localhost:7246/api/Revenue/course-revenue-details`;
    const tableBody = document.getElementById("revenueTableBody");
    const noCoursesMessageContainer = document.getElementById("noCoursesMessage");

    try {
        const response = await fetch(url);

        // Handle 404 or empty data
        if (response.status === 404 || response.status === 204) {
            noCoursesMessageContainer.style.display = 'block'; // Show "No courses" message
            tableBody.innerHTML = ''; // Clear the table
            return;
        }

        // Handle other errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Clear previous table content
        tableBody.innerHTML = '';

        // If result is empty, show "No courses" message
        if (result.length === 0) {
            noCoursesMessageContainer.style.display = 'block';
            return;
        } else {
            noCoursesMessageContainer.style.display = 'none'; // Hide message
        }

        // Populate the table with data
        result.forEach(revenue => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${revenue.courseName}</td>
                <td>${revenue.instructorName}</td>
                <td>${revenue.totalAmount}</td>
                <td>${revenue.instructorEarnings}</td>
                <td>${revenue.adminEarnings}</td>
                <td>${revenue.numberOfStudents}</td>
                <td>${revenue.paymentDate ? new Date(revenue.paymentDate).toLocaleDateString() : "N/A"}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching revenue details:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: red;">
                    Failed to load data.
                </td>
            </tr>
        `;
    }
}

// Load revenue details when the page loads
get();



async function updateTotal() {
    try {
        // Fetch total students
        const response = await fetch('https://localhost:7246/api/Revenue/total-students-all');
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const result = await response.json();
        document.getElementById("totalStudents").innerHTML = result.totalStudents;

        // Fetch total courses
        const response2 = await fetch('https://localhost:7246/api/Revenue/total-courses');
        if (!response2.ok) {
            throw new Error(`Failed to fetch: ${response2.statusText}`);
        }

        const result2 = await response2.json();
        document.getElementById("totalCourses").innerHTML = result2.totalCourses;

    } catch (error) {
        console.error("Error updating totals:", error);

        // Optionally display an error message in the HTML
        const errorElement = document.createElement("p");
        errorElement.textContent = "Failed to load data.";
        errorElement.style.color = "red";

        const cardDashLeft = document.querySelector(".card_dash_left");
        cardDashLeft.appendChild(errorElement);
    }
}

// Example usage with a specific instructorId
updateTotal();
async function getTotalInstructors() {
    try {

        const response = await fetch('https://localhost:7246/api/Revenue/total-instructors');
        if (!response.ok) {
            throw new Error('Failed to fetch total instructors');
        }

        const result = await response.json();
        console.log('Total Instructors:', result.totalInstructors);

        // You can now update the HTML with the total instructors
        document.getElementById('totalInstructors').innerHTML = result.totalInstructors;
    } catch (error) {
        console.error('Error fetching total instructors:', error);
    }
}

// Call the function to get total instructors
getTotalInstructors();



async function updateTotalSales() {
    try {
        // Fetch the total sales from the API
        const response = await fetch('https://localhost:7246/api/revenue/total-sales');
        
        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        // Parse the JSON response
        const result = await response.json();

        // Update the total sales in the HTML element
        document.getElementById("totalSales").innerHTML = result.totalSales+"$";

    } catch (error) {
        console.error("Error updating total sales:", error);

        // Optionally display an error message in the HTML
        const errorElement = document.createElement("p");
        errorElement.textContent = "Failed to load total sales data.";
        errorElement.style.color = "red";

        const cardDashLeft = document.querySelector(".card_dash_left");
        cardDashLeft.appendChild(errorElement);
    }
}

// Example usage
updateTotalSales();




// Function to update total profit dynamically
async function updateTotalProfit() {
    try {
        // Fetch total profit from the API
        const response = await fetch('https://localhost:7246/api/Revenue/total-profit');
        
        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        // Parse the JSON response
        const result = await response.json();

        // Log the response to check what it contains
        console.log(result);

        // Check if the properties exist in the response
        if (result && result.totalAdminEarnings !== undefined) {
            document.getElementById("allProfitInstructors").innerHTML=result.totalInstructorEarnings+"$";
            document.getElementById("totalProfit").innerHTML = result.totalAdminEarnings + "$";
        } else {
            console.error("TotalAdminEarnings not found in the response.");
            document.getElementById("totalProfit").innerHTML = "Data not available";
        }

    } catch (error) {
        console.error("Error updating total profit:", error);

        // Optionally display an error message in the HTML
        const errorElement = document.createElement("p");
        errorElement.textContent = "Failed to load total profit.";
        errorElement.style.color = "red";

        const cardDashLeft = document.querySelector(".card.dashboard-card");
        cardDashLeft.appendChild(errorElement);
    }
}

// Call the function to update total profit
updateTotalProfit();


