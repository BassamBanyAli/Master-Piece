async function edit(event) {
    event.preventDefault();
debugger;
    // Get the user ID from local storage
    var id = localStorage.getItem("userIdAdmin");
    var url = `https://localhost:7246/api/Admin/setting?id=${id}`;
    



    // Get form field values
    var firstName = document.getElementById("firstname").value;
    var lastName = document.getElementById("lastname").value;
    var oldPassword = document.getElementById("oldpassword").value;
    var newPassword = document.getElementById("password").value;
    var confirmPassword = document.getElementById("password2").value;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return; // Stop form submission
    }

    // Create FormData object
    var formData = new FormData();
    
    // Append required fields to FormData
    var fullName = firstName + ' ' + lastName;
    formData.append('fullName', fullName);        // Append full name
    formData.append('oldPassword', oldPassword);  // Append old password
    formData.append('password', newPassword);  // Append new password

    try {
        // Send the form data using PUT request
        var response = await fetch(url, {
            method: "PUT",
            body: formData
        });

        // Check for success
        if (response.ok) {
            alert('Successfully edited profile');
        } else {
            // Handle error response
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Profile update failed'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the profile. Please try again.');
    }
}
