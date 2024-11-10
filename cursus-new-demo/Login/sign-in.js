async function login(event) {
    debugger;
    event.preventDefault();
    const url = 'https://localhost:7246/api/Users/login';
    const form = document.getElementById("form");
    const formData = new FormData(form);
    localStorage.setItem("fromotp", 0);

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('jwtToken', result.Token);
            localStorage.setItem('id', result.userId);

            // Display a specific alert based on the user's role message
            alert(result.message);

            // Redirect based on role message
            if (result.message === "Accepted Instructor access granted.") {
                localStorage.setItem("instructorEmail",result.email);
                // Redirect to instructor dashboard if role is accepted instructor
                window.location.href = "../instructor_dashboard.html";
            } else if (result.message !== "Instructor access pending approval." && 
                       result.message !== "Instructor access rejected.") {
                // Redirect to main page for all other roles except pending/rejected
                window.location.href = "../index.html";
            } else {
                // Optional: Message for pending/rejected roles
                console.log("Pending or rejected access.");
            }
        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Email or password is incorrect'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in. Please try again.');
    }
}




