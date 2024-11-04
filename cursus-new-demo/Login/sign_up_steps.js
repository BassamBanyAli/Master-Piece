async function step(event) {
    debugger;
    event.preventDefault();
    
    var id = localStorage.getItem("id");
    var url = 'https://localhost:7246/api/Users/sign_up_step'; // Corrected URL

    var form = document.getElementById("form");
    var formData = new FormData(form);
    formData.append('id', id); // Assuming `id` is the name of your property in DTO

    try {
        var response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert('Registered successfully');
            var result = await response.json();
            console.log(result); // Log the response for debugging
            window.location.href = "sign_in.html";
        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Registration failed'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while registering. Please try again.');
    }
}







async function handleInstructorSignUp(event) {
    event.preventDefault();
    var id = localStorage.getItem("id");
    const form = document.getElementById('instructor-signup-form');
    const formData = new FormData(form);
    formData.append('id', id); // Assuming `id` is the name of your property in DTO

    // Alert the user that their registration is pending approval
 

    try {
        const response = await fetch('https://localhost:7246/api/Users/sign_up_step_Instructor', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            // Notify the user about the successful registration
            window.location.href = "../thank_you.html"; // Redirect after successful signup
        } else {
            const errorData = await response.json();
            alert('Error: ' + (errorData.message || 'Registration failed'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration. Please try again.');
    }
}


