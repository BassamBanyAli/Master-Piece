async function setting(event) {
    event.preventDefault();
    
    var id = localStorage.getItem("id");
    var url = `https://localhost:7246/api/Users/setting?id=${id}`;
    var form = document.getElementById("form");
    
    // Initialize FormData with empty values for optional fields
    var formData = new FormData(form);

    // Check for required fields and set them as needed
    formData.set("FullName", formData.get("FullName") || "");
    formData.set("Debartement", formData.get("Debartement") || "");
    formData.set("About", formData.get("About") || null);
    formData.set("oldPassword", formData.get("oldPassword") || "");
    formData.set("password", formData.get("password") || "");
    
    try {
        var response = await fetch(url, {
            method: "PUT",
            body: formData
        });

        if (response.ok) {
            alert('Successfully edited profile');
        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Profile update failed'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the profile. Please try again.');
    }
}
