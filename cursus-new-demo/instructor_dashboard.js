async function getProfile() {

    var id = localStorage.getItem("id");
    var url = `https://localhost:7246/api/Users/getProfile?userId=${id}`;

    try {
        var response = await fetch(url, {
            method: "GET"
        });

        if (response.ok) {
            var result = await response.json();

            // Update the profile image, name, and email
            document.getElementById("profile-image").src = `https://localhost:7246/uploads/${result.image}`;
            document.getElementById("firstProfile-image").src = `https://localhost:7246/uploads/${result.image}`;
            document.getElementById("profile-name").textContent = result.fullName;
            document.getElementById("profile-email").textContent = result.email;

        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Profile retrieval failed'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while retrieving the profile. Please try again.');
    }
}

getProfile();

async function signOut() {
    debugger;
    localStorage.removeItem("instructorId");
    window.location.href="Login/sign_in.html"
    
}




async function updateTotal() {
    try {
        var instructorId=localStorage.getItem("instructorId");
        // Fetch total students
        const response = await fetch(`https://localhost:7246/api/Revenue/total-students/${instructorId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const result = await response.json();
        document.getElementById("totalStudents").innerHTML = result.totalStudents;

        // Fetch total courses
        const response2 = await fetch(`https://localhost:7246/api/Revenue/getCoursesForInstructor?instructorId=${instructorId}`);
        if (!response2.ok) {
            throw new Error(`Failed to fetch: ${response2.statusText}`);
        }

        const result2 = await response2.json();
        document.getElementById("totalCourses").innerHTML = result2;

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
async function getTotalProfits() {
    debugger;
    try {
        var instructorId=localStorage.getItem("instructorId");
        debugger;
        const response = await fetch(`https://localhost:7246/api/Revenue/total-profits-for-instructor?instructorId=${instructorId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch total profits');
        }

        const result = await response.json();
        console.log('Total profits:', result.totalProfits);

        // You can now update the HTML with the total instructors
        document.getElementById('totalProfits').innerHTML = result.totalProfits+"$";
    } catch (error) {
        console.error('Error fetching total profits:', error);
    }
}

// Call the function to get total instructors
getTotalProfits();



async function updateTotalSales() {
    try {
        var instructorId=localStorage.getItem("instructorId");
        // Fetch the total sales from the API
        const response = await fetch(`https://localhost:7246/api/Revenue/total-sales-for-instructor?instructorId=${instructorId}`);
        
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


async function loadRevenueDetails() {
    debugger;
    const instructorId = localStorage.getItem("instructorId"); // Get instructor ID from local storage
    const apiUrl = `https://localhost:7246/api/Revenue/course-revenue-details/${instructorId}`;
    const tableBody = document.getElementById("revenueTableBody");
    const noDataMessage = document.getElementById("noDataMessage");

    try {
        const response = await fetch(apiUrl);

        // Handle not found (404) response
        if (response.status === 404) {
            noDataMessage.classList.remove("d-none");
            tableBody.innerHTML = ""; // Clear table body
            return;
        }

        // Handle other errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const revenueDetails = await response.json();

        // Clear table body and hide the no-data message
        tableBody.innerHTML = "";
        noDataMessage.classList.add("d-none");

        if (revenueDetails.length === 0) {
            noDataMessage.classList.remove("d-none");
        } else {
            // Populate table rows with revenue details
            revenueDetails.forEach(detail => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${detail.courseName}</td>
                    <td>${detail.totalAmount.toFixed(2)}</td>
                    <td>${detail.instructorEarnings.toFixed(2)}</td>
                    <td>${detail.adminEarnings.toFixed(2)}</td>
                    <td>${detail.numberOfStudents}</td>
                    <td>${detail.paymentDate ? new Date(detail.paymentDate).toLocaleDateString() : "N/A"}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Error fetching revenue details:", error);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load data.</td></tr>`;
    }
}

// Load revenue details on page load
document.addEventListener("DOMContentLoaded", loadRevenueDetails);




async function updateRevenueForInstructor() {
    debugger; // Debugger to pause execution for debugging in development
    const instructorId = localStorage.getItem("instructorId");
    const apiUrl = `https://localhost:7246/api/Revenue/update-revenue`;

    if (!instructorId) {
        console.error("Instructor ID not found in local storage.");
        return; // Stop execution if instructorId is not available
    }

    try {
        const response = await fetch(`${apiUrl}?instructorId=${instructorId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Check for response status
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error updating revenue:", errorData);
            return;
        }

        // Parse the response and log the result
        const result = await response.json();
        console.log("Revenue update successful:", result.message);
    } catch (error) {
        console.error("Error while updating revenue:", error);
    }
}

// Automatically call the function when the page loads
window.onload = updateRevenueForInstructor;



















