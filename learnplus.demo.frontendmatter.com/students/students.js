

// Function to add one student row
async function get() {
    

    var url=`https://localhost:7246/api/Students/AllStudents`
    const tableBody = document.getElementById("studentList");
    var response=await fetch(url);
    var result=await response.json();

    result.forEach(element => {
    


    const row = document.createElement("tr");

    // Create columns and append them to the row
    row.innerHTML = `
        <td><span class="js-lists-values-employee-name">${element.fullName}</span></td>
        <td><small>${element.email}</small></td>
        <td><small>${element.department}</small></td>
<td>
    <small>
        ${element.enrolledDate ? new Date(element.enrolledDate).toLocaleDateString() : "N/A"}
    </small>
</td>
        <td><a href="#" class="text-muted"><i class="material-icons">more_vert</i></a></td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);


});
// Call the function to add just one student row on page load




}
get();


async function searchStudent() {
    
    debugger;
    var url=`https://localhost:7246/api/Students/AllStudents`
    var response=await fetch(url);
    var result=await response.json();

    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredStudents = result.filter(student => 
        student.fullName.toLowerCase().includes(searchInput) ||
        student.email.toLowerCase().includes(searchInput) ||
        student.department.toLowerCase().includes(searchInput)
    );

 filteredStudents.forEach(element => {
    


    const row = document.createElement("tr");

    // Create columns and append them to the row
    row.innerHTML = `
        <td><span class="js-lists-values-employee-name">${element.fullName}</span></td>
        <td><small>${element.email}</small></td>
        <td><small>${element.department}</small></td>
<td>
    <small>
        ${element.enrolledDate ? new Date(element.enrolledDate).toLocaleDateString() : "N/A"}
    </small>
</td>
        <td><a href="#" class="text-muted"><i class="material-icons">more_vert</i></a></td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);


});


}

// Optional: Add event listener to search on keyup (for live search)
document.getElementById('searchInput').addEventListener('keyup', searchStudent);
    
