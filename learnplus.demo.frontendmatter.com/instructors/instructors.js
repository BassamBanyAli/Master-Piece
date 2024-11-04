// Function to add one student row
async function get() {
    debugger;
    var url = `https://localhost:7246/api/Instructors/AllInstructors`;
    const tableBody = document.getElementById("studentList");
    var response = await fetch(url);
    var result = await response.json();

    result.forEach(element => {
        const row = document.createElement("tr");

        // Create columns and append them to the row
        row.innerHTML = `
            <td><span class="js-lists-values-employee-name">${element.fullName}</span></td>
            <td><small>${element.email}</small></td>
            <td><small>${element.department}</small></td>
                        <td><small>${element.qualifications ? element.qualifications : "N/A"}</small></td> <!-- New Role column -->

            <td>
                <small>
                    ${element.createdAt ? new Date(element.createdAt).toLocaleDateString() : "N/A"}
                                <td><a href="#" class="text-muted"><i class="material-icons">more_vert</i></a></td>
                </small>
            </td>

        `;

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

get();
