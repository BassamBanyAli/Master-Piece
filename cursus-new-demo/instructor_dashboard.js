async function getProfile() {
    debugger;
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


async function getInstructorId() {
    // Retrieve the email from localStorage
    var email = localStorage.getItem('instructorEmail');
    
    if (!email) {
        alert('Instructor email not found in local storage.');
        return;
    }

    // Construct the API URL with the email query parameter
    var url = `https://localhost:7246/api/Instructors/getInstructorIdByEmail?email=${email}`;

    try {
        // Make the API call to fetch the instructor ID
        const response = await fetch(url, {
            method: 'GET',
        });

        // Check if the response is successful
        if (response.ok) {
            const result = await response.json();
            // Save the instructor ID to localStorage
            localStorage.setItem('instructorId', result.instructorId);

        } else {
            const errorData = await response.json();

        }
    } catch (error) {
        console.error('Error:', error);

    }
}
getInstructorId();
