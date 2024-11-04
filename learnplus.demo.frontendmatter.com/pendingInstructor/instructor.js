async function get() {
    const url = `https://localhost:7246/api/Instructors/AllPendingInstructors`;
    const tableBody = document.getElementById("studentList");
    const response = await fetch(url);
    const result = await response.json();

    result.forEach(element => {
        const row = document.createElement("tr");

        // Create columns and append them to the row
        row.innerHTML = `
            <td><span class="js-lists-values-employee-name">${element.fullName}</span></td>
            <td><small>${element.email}</small></td>
            <td><small>${element.debartement}</small></td>
            <td>
                <small>${element.createdAt ? new Date(element.createdAt).toLocaleDateString() : "N/A"}</small>
            </td>
            <td>
                ${element.image ? `<i class="fas fa-file-alt" style="font-size: 24px;"></i>` : 'N/A'}
            </td>
            <td>
                ${element.image ? `<a href="https://localhost:7246/uploads/${element.image}" download="InstructorFile_${element.userId}" class="btn btn-primary btn-sm">Download</a>` : ''}
            </td>
            <td>
                <button onclick="acceptInstructor(${element.userId})" class="btn btn-success btn-sm">Accept</button>
                <button onclick="rejectInstructor(${element.userId})" class="btn btn-danger btn-sm">Reject</button>
            </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

async function acceptInstructor(id) {
    const url = `https://localhost:7246/api/Instructors/AcceptInstructor/${id}`;
    const response = await fetch(url, { method: 'POST' });
    
    if (response.ok) {
        alert("Instructor accepted.");
        location.reload(); // Reload to update the list
    } else {
        alert("Failed to accept instructor.");
    }
}

async function rejectInstructor(id) {
    const url = `https://localhost:7246/api/Instructors/RejectInstructor/${id}`;
    const response = await fetch(url, { method: 'POST' });
    
    if (response.ok) {
        alert("Instructor rejected.");
        location.reload(); // Reload to update the list
    } else {
        alert("Failed to reject instructor.");
    }
}

// Load instructors when the page loads
get();
