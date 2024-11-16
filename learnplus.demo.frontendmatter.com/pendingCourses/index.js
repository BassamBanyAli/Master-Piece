async function get() {
    const url = `https://localhost:7246/api/Courses/GetPendingCourses`;
    const tableBody = document.getElementById("studentList");
    const noCoursesMessageContainer = document.getElementById("noCoursesMessage");

    try {
        const response = await fetch(url);

        // Check for 404 status (No pending courses found)
        if (response.status === 404) {
            // Show the "no courses" message box
            noCoursesMessageContainer.style.display = 'block';
            tableBody.innerHTML = '';  // Clear any previous table data
            return; // Exit the function since no courses were found
        }

        // If there is any other status error, throw an error
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Clear previous content (in case it's updated)
        tableBody.innerHTML = '';

        // If there are no courses, show the message
        if (result.length === 0) {
            noCoursesMessageContainer.style.display = 'block'; // Show the message
        } else {
            // Hide the "no courses" message box
            noCoursesMessageContainer.style.display = 'none';

            // Iterate through the courses and display them in the table
            result.forEach(course => {
                const row = document.createElement("tr");

                // Create columns and append them to the row
                row.innerHTML = `
                    <td>${course.courseName}</td>
                    <td>${course.courseDescription}</td>
                    <td>${course.department}</td>
                    <td>${course.price}</td>
                    <td>${course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td>${course.instructorName}</td>
                    <td>
                        <button onclick="acceptCourse(${course.courseId})" class="btn btn-success btn-sm">Accept</button>
                        <button onclick="rejectCourse(${course.courseId})" class="btn btn-danger btn-sm">Reject</button>
                    </td>
                `;

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Error fetching pending courses:", error);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Failed to load data.</td></tr>`;
    }
}



async function acceptCourse(courseId) {
    debugger;
    const url = `https://localhost:7246/api/Courses/acceptedCourse/${courseId}`;

    try {
        const response = await fetch(url, { 
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',  // Ensure proper content type (if needed)
            }
        });

        if (response.ok) {
            const result = await response.json(); // Get the response message
            alert(result.message || "Course accepted successfully.");
            location.reload(); // Reload to update the list of courses
        } else {
            const errorResult = await response.json();
            alert(errorResult.message || "Failed to accept course.");
        }
    } catch (error) {
        console.error("Error accepting course:", error);
        alert("Error accepting course.");
    }
}


async function rejectCourse(courseId) {
    const url = `https://localhost:7246/api/Courses/RejectCourse/${courseId}`;

    try {
        const response = await fetch(url, { 
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json(); // Get the response message
            alert(result.message || "Course rejected successfully.");
            location.reload(); // Reload to update the list of courses
        } else {
            const errorResult = await response.json();
            alert(errorResult.message || "Failed to reject course.");
        }
    } catch (error) {
        console.error("Error rejecting course:", error);
        alert("Error rejecting course.");
    }
}

// Load instructors when the page loads
get();
