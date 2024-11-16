async function setting(event) {
    event.preventDefault();
    
    var id = localStorage.getItem("id");
    var url = `https://localhost:7246/api/Users/setting?id=${id}`;
    var form = document.getElementById("form");

    // Initialize FormData with form inputs
    var formData = new FormData(form);

    // Set default values for optional fields if they are empty
    formData.set("FullName", formData.get("FullName") || "");
    formData.set("Debartement", formData.get("Debartement") || "");
    formData.set("About", formData.get("About") || "");
    formData.set("oldPassword", formData.get("oldPassword") || "");
    formData.set("password", formData.get("password") || "");

    // Handle Image File
    var imageInput = document.getElementById("profileImageInput");
    var imageFile = imageInput.files[0];

    // If an image was selected, append it to FormData
    if (imageFile) {
        formData.set("Image", imageFile);  // Add the image to the formData
    } else {
        // If no image selected, you can either skip this or send a placeholder/empty value
        formData.set("Image", new Blob()); // This sends an empty blob if no image selected
    }

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

// Function to preview image (optional, to display selected image before uploading)
function previewImage(event) {
    var reader = new FileReader();
    reader.onload = function() {
        var output = document.getElementById('image');
        output.src = reader.result;  // Update the image preview
    }
    reader.readAsDataURL(event.target.files[0]);
}



async function getProfile2() {
    var id = localStorage.getItem("id");
    var url = `https://localhost:7246/api/Users/getProfile?userId=${id}`;

    try {
        var response = await fetch(url, {
            method: "GET"
        });

        if (response.ok) {
            var result = await response.json();

            // Set default value for text fields
            document.getElementById("id[name]").value = result.fullName; // Full Name
            document.getElementById("id_headline").value = result.debartement; // Department
            document.getElementById("id_about").value = result.about; // About

            // Set the profile image source
            var imageElement = document.getElementById("image");
            imageElement.src = `https://localhost:7246/uploads/${result.image}`; // Set the profile image

            // You can also set the default values for password fields if needed, or leave them empty
            document.getElementById("id_old_password").value = ""; // Old Password (optional)
            document.getElementById("id_new_password").value = ""; // New Password (optional)
            document.getElementById("id_confirm_password").value = ""; // Confirm New Password (optional)

        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Profile retrieval failed'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the profile. Please try again.');
    }
}

getProfile2();

